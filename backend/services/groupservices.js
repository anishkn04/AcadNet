import StudyGroup from "../models/studyGroup.model.js"
import throwWithCode from "../utils/errorthrow.js";
import AdditionalResource from "../models/additionalResources.model.js";


export const getAllGroups= async (req)=>{
    try{
        const publicGroups = await StudyGroup.findAll({
      where: {
        isPrivate: false
      }
    });
    return publicGroups
      }catch(error){
    throwWithCode("Can't Get Response",400)
}
}

export const createStudyGroupWithSyllabus = async (
  creatorId,
  groupData,
  syllabusTopicsData,
  additionalResourceFiles = []
) => {
  let transaction;
  const createdResourcesForCleanup = [];

  try {
    // 1. Start a transaction
    transaction = await sequelize.transaction();

    // 2. Validate the creator
    const creator = await UserModel.findByPk(creatorId, { transaction });
    if (!creator) {
      throwWithCode("Creator user not found.", 404);
    }

    // 3. Validate syllabus structure before creating anything
    if (
      !syllabusTopicsData ||
      !Array.isArray(syllabusTopicsData) ||
      syllabusTopicsData.length === 0
    ) {
      throwWithCode("Syllabus must contain at least one topic.", 400);
    }
    for (const topic of syllabusTopicsData) {
      if (!topic.title) {
        throwWithCode("Each topic must have a title.", 400);
      }
      if (
        !topic.subTopics ||
        !Array.isArray(topic.subTopics) ||
        topic.subTopics.length === 0
      ) {
        throwWithCode(
          `Topic "${topic.title}" must contain at least one subtopic.`,
          400
        );
      }
      for (const subTopic of topic.subTopics) {
        if (!subTopic.title) {
          throwWithCode("Each subtopic must have a title.", 400);
        }
      }
    }

    // 4. Create the Study Group
    const newGroup = await StudyGroup.create(
      {
        name: groupData.name,
        description: groupData.description || null,
        creatorId: creatorId,
        isPrivate: groupData.isPrivate || false,
      },
      { transaction }
    );

    // 5. Handle Additional Resource Files
    const createdResources = [];
    if (additionalResourceFiles && additionalResourceFiles.length > 0) {
      // Create a dedicated folder for this group's resources
      const groupResourcePath = `resources/${newGroup.id}_resources`;
      fs.mkdirSync(groupResourcePath, { recursive: true });

      let fileCounter = 1;
      for (const file of additionalResourceFiles) {
        // Define a new, safe filename to avoid conflicts
        const newFileName = `${fileCounter}${path.extname(file.originalname)}`;
        const newFilePath = path.join(groupResourcePath, newFileName);

        // Move the file from its temporary location to the permanent one
        fs.renameSync(file.path, newFilePath);
        createdResourcesForCleanup.push(newFilePath); // Add to cleanup list in case of failure

        // Create the database record for the resource
        const newResource = await AdditionalResource.create(
          {
            studyGroupId: newGroup.id,
            filePath: newFilePath,
          },
          { transaction }
        );
        createdResources.push(newResource.toJSON());
        fileCounter++;
      }
    }

    // 6. Create the Syllabus
    const newSyllabus = await Syllabus.create(
      {
        studyGroupId: newGroup.id,
      },
      { transaction }
    );

    // 7. Create Topics and SubTopics
    const createdTopics = [];
    for (const topicData of syllabusTopicsData) {
      const newTopic = await Topic.create(
        {
          syllabusId: newSyllabus.id,
          title: topicData.title,
          description: topicData.description || null,
        },
        { transaction }
      );

      const createdSubTopics = [];
      for (const subTopicData of topicData.subTopics) {
        const newSubTopic = await SubTopic.create(
          {
            topicId: newTopic.id,
            title: subTopicData.title,
            content: subTopicData.content || null,
          },
          { transaction }
        );
        createdSubTopics.push(newSubTopic.toJSON());
      }
      createdTopics.push({ ...newTopic.toJSON(), subTopics: createdSubTopics });
    }

    // 8. If everything is successful, commit the transaction
    await transaction.commit();

    // 9. Construct and return the final response object
    return {
      ...newGroup.toJSON(),
      additionalResources: createdResources, // Include the new resources
      syllabus: {
        ...newSyllabus.toJSON(),
        topics: createdTopics,
      },
    };
  } catch (error) {
    // 10. If any error occurs, roll back the transaction
    if (transaction) {
      await transaction.rollback();
    }

    // Clean up any files that were successfully moved before the error occurred
    for (const filePath of createdResourcesForCleanup) {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error cleaning up orphaned file:", unlinkErr);
        });
      }
    }

    // Re-throw the error to be handled by the controller
    throw error;
  }
};
