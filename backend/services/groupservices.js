import StudyGroup from "../models/studyGroup.model.js"
import throwWithCode from "../utils/errorthrow.js";
import AdditionalResource from "../models/additionalResources.model.js";
import sequelize from "../config/database.js";
import UserModel from "../models/user.model.js";
import Syllabus from "../models/syallabus.model.js";
import Topic from "../models/topics.model.js";
import SubTopic from "../models/subtopics.model.js";
import fs from "fs";
import path from "path";

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

    transaction = await sequelize.transaction();


    const creator = await UserModel.findByPk(creatorId, { transaction });
    if (!creator) {
      throwWithCode("Creator user not found.", 404);
    }

  
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


    const newGroup = await StudyGroup.create(
      {
        name: groupData.name,
        description: groupData.description || null,
        creatorId: creatorId,
        isPrivate: groupData.isPrivate || false,
      },
      { transaction }
    );


    const createdResources = [];
    if (additionalResourceFiles && additionalResourceFiles.length > 0) {
      const groupResourcePath = `resources/${newGroup.id}_resources`;
      fs.mkdirSync(groupResourcePath, { recursive: true });

      let fileCounter = 1;
      for (const file of additionalResourceFiles) {
        const ext = path.extname(file.originalname).toLowerCase();
        let fileType = "other";
        if ([".pdf"].includes(ext)) fileType = "pdf";
        else if ([".doc", ".docx"].includes(ext)) fileType = "doc";
        else if ([".xls", ".xlsx"].includes(ext)) fileType = "excel";
        else if ([".ppt", ".pptx"].includes(ext)) fileType = "ppt";
        else if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"].includes(ext)) fileType = "image";
        else if ([".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"].includes(ext)) fileType = "video";
        else if ([".mp3", ".wav", ".aac", ".ogg", ".flac"].includes(ext)) fileType = "audio";
        else if ([".txt"].includes(ext)) fileType = "text";

        const newFileName = `${fileCounter}${ext}`;
        const newFilePath = path.join(groupResourcePath, newFileName);
        fs.renameSync(file.path, newFilePath);
        createdResourcesForCleanup.push(newFilePath);

        const newResource = await AdditionalResource.create(
          {
            studyGroupId: newGroup.id,
            filePath: newFilePath,
            fileType: fileType,
          },
          { transaction }
        );
        createdResources.push(newResource.toJSON());
        fileCounter++;
      }
    }


    const newSyllabus = await Syllabus.create(
      {
        studyGroupId: newGroup.id,
      },
      { transaction }
    );


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

   
    await transaction.commit();

    return {
      ...newGroup.toJSON(),
      additionalResources: createdResources, 
      syllabus: {
        ...newSyllabus.toJSON(),
        topics: createdTopics,
      },
    };
  } catch (error) {

    if (transaction) {
      await transaction.rollback();
    }

    for (const filePath of createdResourcesForCleanup) {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error cleaning up orphaned file:", unlinkErr);
        });
      }
    }


    throw error;
  }
};
