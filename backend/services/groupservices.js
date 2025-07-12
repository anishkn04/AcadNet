import StudyGroup from "../models/studyGroup.model.js"
import throwWithCode from "../utils/errorthrow.js";
import AdditionalResource from "../models/additionalResources.model.js";
import ResourceLike from "../models/resourceLike.model.js";
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
      },
      include: [
        {
          model: Membership,
          attributes: ['id', 'userId', 'studyGroupId', 'isAnonymous', 'created_at', 'updated_at'],
          required: false, // LEFT JOIN to include groups even without members
        },
        {
          model: UserModel,
          attributes: ['username', 'fullName'],
          required: false,
        },
        {
          model: Syllabus,
          include: [{ 
            model: Topic, 
            include: [SubTopic],
            required: false 
          }],
          required: false,
        },
        {
          model: AdditionalResource,
          attributes: ['id', 'filePath', 'fileType', 'topicId', 'subTopicId', 'created_at'],
          required: false,
        }
      ]
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

    // Generate unique group code
    const generateGroupCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let groupCode, existingGroup, attempts = 0;
    do {
      groupCode = generateGroupCode();
      existingGroup = await StudyGroup.findOne({ where: { groupCode: groupCode } });
      attempts++;
    } while (existingGroup && attempts < 10);
    
    if (existingGroup) {
      throwWithCode("Failed to generate unique group code after multiple attempts.", 500);
    }

    const newGroup = await StudyGroup.create(
      {
        name: groupData.name,
        description: groupData.description || null,
        creatorId: creatorId,
        isPrivate: groupData.isPrivate || false,
        groupCode: groupCode,
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
        attributes: ['username', 'fullName'],
      },
    ],
  });

  return groups.map((group) => {
    // File count by type
    const fileTypeCount = {};
    group.additionalResources?.forEach((r) => {
      fileTypeCount[r.fileType] = (fileTypeCount[r.fileType] || 0) + 1;
    });
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      fileCounts: fileTypeCount,
      totalFiles: group.additionalResources?.length || 0,
      membersCount: group.memberships?.length || 0,
      syllabus: group.syllabus,
      creatorName: group.userModel?.fullName || group.userModel?.username || '',
    };
  });
};

// Get overview for a single group by group code
export const getGroupOverviewByCode = async (groupCode) => {
  const group = await StudyGroup.findOne({
    where: { groupCode: groupCode },
    include: [
      {
        model: AdditionalResource,
        attributes: ['id', 'fileType', 'created_at'],
        required: false, // LEFT JOIN to include groups even without resources
      },
      {
        model: Membership,
        attributes: ['id'],
        required: false,
      },
      {
        model: Syllabus,
        include: [{ 
          model: Topic, 
          include: [SubTopic],
          required: false 
        }],
        required: false,
      },
      {
        model: UserModel,
        attributes: ['username', 'fullName'],
        required: false,
      },
    ],
  });
  
  if (!group) {
    throwWithCode("Group not found.", 404);
  }
  
  console.log('Raw group data:', JSON.stringify(group, null, 2));
  console.log('AdditionalResources:', group.AdditionalResources);
  console.log('UserModel:', group.UserModel);
  console.log('Syllabus:', group.Syllabus);
  
  const fileTypeCount = {};
  group.additionalResources?.forEach((r) => {
    fileTypeCount[r.fileType] = (fileTypeCount[r.fileType] || 0) + 1;
  });
  
  const result = {
    id: group.id,
    name: group.name,
    description: group.description,
    fileCounts: fileTypeCount,
    totalFiles: group.additionalResources?.length || 0,
    membersCount: group.memberships?.length || 0,
    syllabus: group.syllabus,
    creatorName: group.userModel?.fullName || group.userModel?.username || '',
  };
  
  console.log('Processed result:', JSON.stringify(result, null, 2));
  return result;
};

// Get all details for a group by group code
export const getGroupDetailsByCode = async (groupCode) => {
  const group = await StudyGroup.findOne({
    where: { groupCode },
    include: [
      {
        model: Membership,
        include: [
          {
            model: UserModel,
            attributes: ['user_id', 'username', 'fullName'],
          }
        ],
      },
      {
        model: AdditionalResource,
        attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount', 'topicId', 'subTopicId', 'created_at']
      },
      {
        model: Syllabus,
        include: [{ model: Topic, include: [SubTopic] }],
      },
      {
        model: UserModel,
        attributes: ['username', 'fullName'],
      },
    ],
  });
  console.log("Reached here")
  return group;
};

// Get all details for a group by group ID
export const getGroupDetailsById = async (groupId) => {
  const group = await StudyGroup.findByPk(groupId, {
    include: [
      {
        model: Membership,
        include: [
          {
            model: UserModel,
            attributes: ['user_id', 'username', 'fullName'],
          }
        ],
      },
      {
        model: AdditionalResource,
        attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount', 'topicId', 'subTopicId', 'created_at']
      },
      {
        model: Syllabus,
        include: [{ model: Topic, include: [SubTopic] }],
      },
      {
        model: UserModel,
        attributes: ['username', 'fullName'],
      },
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
  const group = await StudyGroup.findOne({ where: { groupCode: groupCode } });
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

// Like/Dislike Additional Resource Services
export const likeResource = async (userId, resourceId) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();

    // Check if resource exists
    const resource = await AdditionalResource.findByPk(resourceId, { transaction });
    if (!resource) {
      throwWithCode("Resource not found.", 404);
    }

    // Check if user already has a reaction to this resource
    const existingLike = await ResourceLike.findOne({
      where: { userId, resourceId },
      transaction
    });

    if (existingLike) {
      if (existingLike.likeType === 'like') {
        // User already liked, remove the like
        await existingLike.destroy({ transaction });
        await AdditionalResource.decrement('likesCount', { where: { id: resourceId }, transaction });
        await transaction.commit();
        return { action: 'removed_like', message: 'Like removed successfully' };
      } else {
        // User disliked before, change to like
        existingLike.likeType = 'like';
        await existingLike.save({ transaction });
        await AdditionalResource.increment('likesCount', { where: { id: resourceId }, transaction });
        await AdditionalResource.decrement('dislikesCount', { where: { id: resourceId }, transaction });
        await transaction.commit();
        return { action: 'changed_to_like', message: 'Changed from dislike to like successfully' };
      }
    } else {
      // User hasn't reacted before, add like
      await ResourceLike.create({ userId, resourceId, likeType: 'like' }, { transaction });
      await AdditionalResource.increment('likesCount', { where: { id: resourceId }, transaction });
      await transaction.commit();
      return { action: 'added_like', message: 'Resource liked successfully' };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

export const dislikeResource = async (userId, resourceId) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();

    // Check if resource exists
    const resource = await AdditionalResource.findByPk(resourceId, { transaction });
    if (!resource) {
      throwWithCode("Resource not found.", 404);
    }

    // Check if user already has a reaction to this resource
    const existingLike = await ResourceLike.findOne({
      where: { userId, resourceId },
      transaction
    });

    if (existingLike) {
      if (existingLike.likeType === 'dislike') {
        // User already disliked, remove the dislike
        await existingLike.destroy({ transaction });
        await AdditionalResource.decrement('dislikesCount', { where: { id: resourceId }, transaction });
        await transaction.commit();
        return { action: 'removed_dislike', message: 'Dislike removed successfully' };
      } else {
        // User liked before, change to dislike
        existingLike.likeType = 'dislike';
        await existingLike.save({ transaction });
        await AdditionalResource.increment('dislikesCount', { where: { id: resourceId }, transaction });
        await AdditionalResource.decrement('likesCount', { where: { id: resourceId }, transaction });
        await transaction.commit();
        return { action: 'changed_to_dislike', message: 'Changed from like to dislike successfully' };
      }
    } else {
      // User hasn't reacted before, add dislike
      await ResourceLike.create({ userId, resourceId, likeType: 'dislike' }, { transaction });
      await AdditionalResource.increment('dislikesCount', { where: { id: resourceId }, transaction });
      await transaction.commit();
      return { action: 'added_dislike', message: 'Resource disliked successfully' };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

export const getResourceLikeStatus = async (userId, resourceId) => {
  try {
    const resource = await AdditionalResource.findByPk(resourceId, {
      attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount']
    });
    
    if (!resource) {
      throwWithCode("Resource not found.", 404);
    }

    const userReaction = await ResourceLike.findOne({
      where: { userId, resourceId },
      attributes: ['likeType']
    });

    return {
      resource,
      userReaction: userReaction ? userReaction.likeType : null
    };
  } catch (error) {
    throw error;
  }
};



