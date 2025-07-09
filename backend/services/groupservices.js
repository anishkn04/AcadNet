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
import Membership from "../models/membership.model.js";

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


    // Add creator as a member of the group
    await Membership.create(
      {
        userId: creatorId,
        studyGroupId: newGroup.id,
        isAnonymous: false,
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

// Get overview for all groups
export const getGroupOverviewList = async () => {
  const groups = await StudyGroup.findAll({
    include: [
      {
        model: AdditionalResource,
        attributes: ['fileType'],
      },
      {
        model: Membership,
        attributes: ['id'],
      },
      {
        model: Syllabus,
        include: [{ model: Topic, include: [SubTopic] }],
      },
      {
        model: UserModel,
        as: 'UserModel',
        attributes: ['username', 'fullName'],
        foreignKey: 'creatorId',
      },
    ],
  });

  return groups.map((group) => {
    // File count by type
    const fileTypeCount = {};
    group.AdditionalResources?.forEach((r) => {
      fileTypeCount[r.fileType] = (fileTypeCount[r.fileType] || 0) + 1;
    });
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      fileCounts: fileTypeCount,
      totalFiles: group.AdditionalResources?.length || 0,
      membersCount: group.Memberships?.length || 0,
      syllabus: group.Syllabus,
      creatorName: group.UserModel?.fullName || group.UserModel?.username || '',
    };
  });
};

// Get overview for a single group by group code
export const getGroupOverviewByCode = async (groupCode) => {
  const group = await StudyGroup.findOne({
    where: { code: groupCode },
    include: [
      {
        model: AdditionalResource,
        attributes: ['fileType'],
      },
      {
        model: Membership,
        attributes: ['id'],
      },
      {
        model: Syllabus,
        include: [{ model: Topic, include: [SubTopic] }],
      },
      {
        model: UserModel,
        as: 'UserModel',
        attributes: ['username', 'fullName'],
        foreignKey: 'creatorId',
      },
    ],
  });
  if (!group) return null;
  const fileTypeCount = {};
  group.AdditionalResources?.forEach((r) => {
    fileTypeCount[r.fileType] = (fileTypeCount[r.fileType] || 0) + 1;
  });
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    fileCounts: fileTypeCount,
    totalFiles: group.AdditionalResources?.length || 0,
    membersCount: group.Memberships?.length || 0,
    syllabus: group.Syllabus,
    creatorName: group.UserModel?.fullName || group.UserModel?.username || '',
  };
};

// Get all details for a group by group code
export const getGroupDetailsByCode = async (groupCode) => {
  const group = await StudyGroup.findOne({
    where: { groupCode },
    include: [
      {
        model: Membership,
        as: "members",
        include: [User],
      },
      AdditionalResources,
      Syallabus,
    ],
  });
  return group;
};

// Service to join a group by group code
export const joinGroup = async (userId, groupCode) => {
  if (!userId || !groupCode) {
    throwWithCode("User ID and group code are required.", 400);
  }
  // Find the group by code
  const group = await StudyGroup.findOne({ where: { code: groupCode } });
  if (!group) {
    throwWithCode("Group not found.", 404);
  }
  // Check if user is already a member
  const existingMembership = await Membership.findOne({
    where: { userId, studyGroupId: group.id },
  });
  if (existingMembership) {
    throwWithCode("User is already a member of this group.", 409);
  }
  // Add user as a member
  const membership = await Membership.create({
    userId,
    studyGroupId: group.id,
    isAnonymous: false,
  });
  return membership;
};
