import StudyGroup from "../models/studyGroup.model.js"
import throwWithCode from "../utils/errorthrow.js";
import AdditionalResource from "../models/additionalResources.model.js";
import ResourceLike from "../models/resourceLike.model.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import UserModel from "../models/user.model.js";
import Syllabus from "../models/syallabus.model.js";
import Topic from "../models/topics.model.js";
import SubTopic from "../models/subtopics.model.js";
import Forum from "../models/forum.model.js";
import fs from "fs";
import path from "path";
import Membership from "../models/membership.model.js";

// Helper function to check if user profile is complete
export const checkUserProfileCompleteness = async (userId) => {
  const user = await UserModel.findByPk(userId, {
    attributes: ['user_id', 'fullName', 'phone', 'education', 'age', 'nationality', 'address']
  });

  if (!user) {
    throwWithCode("User not found.", 404);
  }

  const missingFields = [];

  // Check required fields
  if (!user.fullName || user.fullName.trim() === '') {
    missingFields.push('fullName');
  }
  if (!user.phone || user.phone.trim() === '') {
    missingFields.push('phone');
  }
  // if (!user.age || user.age <= 0) {
  //   missingFields.push('age');
  // }
  // if (!user.nationality || user.nationality.trim() === '') {
  //   missingFields.push('nationality');
  // }
  
  // Check if education object has meaningful data
  if (!user.education || 
      Object.keys(user.education).length === 0 || 
      !user.education.college || 
      user.education.college.trim() === '') {
    missingFields.push('education');
  }
  
  // Check if address object has meaningful data
  if (!user.address || 
      Object.keys(user.address).length === 0 || 
      !user.address.municipality || 
      user.address.municipality.trim() === '') {
    missingFields.push('address');
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    user
  };
};

export const getAllGroups= async (req)=>{
    try{
        const userId = req.id; // Get user ID from auth middleware
        
        if (!userId) {
            // If no user ID, only show public groups
            const publicGroups = await StudyGroup.findAll({
                where: { isPrivate: false },
                include: [
                    {
                        model: Membership,
                        attributes: ['id', 'userId', 'studyGroupId', 'isAnonymous', 'role', 'created_at', 'updated_at'],
                        required: false,
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
                        where: { status: 'approved' },
                        attributes: ['id', 'filePath', 'fileType', 'topicId', 'subTopicId', 'created_at', 'uploadedBy', 'status'],
                        required: false,
                    }
                ]
            });
            return publicGroups;
        }

        // Get user's group memberships first
        const userMemberships = await Membership.findAll({
            where: { userId },
            attributes: ['studyGroupId']
        });
        const userGroupIds = userMemberships.map(membership => membership.studyGroupId);
        
        // Get all groups where:
        // 1. Group is public, OR
        // 2. Group is private AND user is a member
        const groups = await StudyGroup.findAll({
            include: [
                {
                    model: Membership,
                    attributes: ['id', 'userId', 'studyGroupId', 'isAnonymous', 'role', 'created_at', 'updated_at'],
                    required: false,
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
                    where: { status: 'approved' },
                    attributes: ['id', 'filePath', 'fileType', 'topicId', 'subTopicId', 'created_at', 'uploadedBy', 'status'],
                    required: false,
                }
            ]
        });

        // Filter groups based on privacy and membership
        const filteredGroups = groups.filter(group => {
            // Show all public groups
            if (!group.isPrivate) {
                return true;
            }
            
            // For private groups, check if user is a member by checking group ID
            const isMember = userGroupIds.includes(group.id);
            return isMember;
        });

        return filteredGroups;
      }catch(error){
        console.error("Error in getAllGroups:", error);
        throwWithCode("Can't Get Response", 400);
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
    // Check if user profile is complete before allowing group creation
    const profileCheck = await checkUserProfileCompleteness(creatorId);
    if (!profileCheck.isComplete) {
      throwWithCode(
        `Please complete your profile before creating a study group. Missing fields: ${profileCheck.missingFields.join(', ')}`, 
        400
      );
    }

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


    // Add creator as a member of the group with admin role
    await Membership.create(
      {
        userId: creatorId,
        studyGroupId: newGroup.id,
        isAnonymous: false,
        role: 'admin',
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
            uploadedBy: creatorId,
            status: 'approved' // Creator's resources are auto-approved
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

    // Create forum for the group
    const newForum = await Forum.create(
      {
        studyGroupId: newGroup.id,
        name: "General Discussion",
        description: `Discussion forum for ${groupData.name}`
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
        where: { status: 'approved' },
        attributes: ['fileType'],
        required: false,
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
        where: { status: 'approved' },
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
        where: { status: 'approved' },
        required: false,
        attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount', 'topicId', 'subTopicId', 'created_at', 'uploadedBy', 'status'],
        include: [
          {
            model: Topic,
            attributes: ['id', 'title'],
            required: false
          },
          {
            model: SubTopic,
            attributes: ['id', 'title'],
            required: false
          },
          {
            model: UserModel,
            attributes: ['user_id', 'username', 'fullName'],
            required: false,
            as: 'uploader'
          }
        ]
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
        where: { status: 'approved' },
        required: false,
        attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount', 'topicId', 'subTopicId', 'created_at', 'uploadedBy', 'status'],
        include: [
          {
            model: Topic,
            attributes: ['id', 'title'],
            required: false
          },
          {
            model: SubTopic,
            attributes: ['id', 'title'],
            required: false
          },
          {
            model: UserModel,
            attributes: ['user_id', 'username', 'fullName'],
            required: false,
            as: 'uploader'
          }
        ]
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
export const joinGroup = async (userId, groupCode,anonymous) => {
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
    isAnonymous:anonymous || false,
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
      userReaction: userReaction ? userReaction.likeType : 'none'
    };
  } catch (error) {
    throw error;
  }
};

// Leave a study group
export const leaveGroup = async (userId, groupCode) => {
  const group = await StudyGroup.findOne({ where: { groupCode } });
  if (!group) {
    throwWithCode("Group not found.", 404);
  }

  const membership = await Membership.findOne({
    where: { userId, studyGroupId: group.id },
  });

  if (!membership) {
    throwWithCode("You are not a member of this group.", 404);
  }

  if (group.creatorId === userId) {
    throwWithCode("The creator cannot leave the group. You can delete it instead.", 403);
  }

  await membership.destroy();
  return { message: "Successfully left the group." };
};

// Remove a member from a group (admin only)
export const removeMember = async (adminId, groupCode, userIdToRemove) => {
  const group = await StudyGroup.findOne({ where: { groupCode } });
  if (!group) {
    throwWithCode("Group not found.", 404);
  }

  const adminMembership = await Membership.findOne({
    where: { userId: adminId, studyGroupId: group.id },
  });

  if (!adminMembership || adminMembership.role !== "admin") {
    throwWithCode("You do not have permission to remove members.", 403);
  }

  if (adminId === userIdToRemove) {
    throwWithCode("You cannot remove yourself.", 400);
  }

  const memberToRemove = await Membership.findOne({
    where: { userId: userIdToRemove, studyGroupId: group.id },
  });

  if (!memberToRemove) {
    throwWithCode("User is not a member of this group.", 404);
  }

  await memberToRemove.destroy();
  return { message: "Member removed successfully." };
};

// Promote a member to admin (admin only)
export const promoteMember = async (adminId, groupCode, userIdToPromote) => {
  const group = await StudyGroup.findOne({ where: { groupCode } });
  if (!group) {
    throwWithCode("Group not found.", 404);
  }

  const adminMembership = await Membership.findOne({
    where: { userId: adminId, studyGroupId: group.id },
  });

  if (!adminMembership || adminMembership.role !== "admin") {
    throwWithCode("You do not have permission to promote members.", 403);
  }

  const memberToPromote = await Membership.findOne({
    where: { userId: userIdToPromote, studyGroupId: group.id },
  });

  if (!memberToPromote) {
    throwWithCode("User is not a member of this group.", 404);
  }

  if (memberToPromote.role === "admin") {
    throwWithCode("User is already an admin.", 400);
  }

  memberToPromote.role = "admin";
  await memberToPromote.save();
  return { message: "Member promoted to admin successfully." };
};

// Demote a member from admin (creator only)
export const demoteMember = async (creatorId, groupCode, userIdToDemote) => {
  const group = await StudyGroup.findOne({ where: { groupCode } });
  if (!group) {
    throwWithCode("Group not found.", 404);
  }

  if (group.creatorId !== creatorId) {
    throwWithCode("Only the group creator can demote admins.", 403);
  }

  const memberToDemote = await Membership.findOne({
    where: { userId: userIdToDemote, studyGroupId: group.id },
  });

  if (!memberToDemote) {
    throwWithCode("User is not a member of this group.", 404);
  }

  if (memberToDemote.role !== "admin") {
    throwWithCode("User is not an admin.", 400);
  }

  if (group.creatorId === userIdToDemote) {
    throwWithCode("The creator cannot be demoted.", 403);
  }

  memberToDemote.role = "member";
  await memberToDemote.save();
  return { message: "Admin demoted to member successfully." };
};

// Get all additional resources for a group with like/dislike counts
export const getGroupAdditionalResources = async (groupCode) => {
  try {
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: AdditionalResource,
          where: { status: 'approved' },
          required: false,
          attributes: ['id', 'filePath', 'fileType', 'likesCount', 'dislikesCount', 'created_at', 'uploadedBy', 'status'],
          include: [
            {
              model: Topic,
              attributes: ['id', 'title'],
              required: false
            },
            {
              model: SubTopic,
              attributes: ['id', 'title'],
              required: false,
              as: 'subTopic'
            },
            {
              model: UserModel,
              attributes: ['user_id', 'username', 'fullName'],
              required: false,
              as: 'uploader'
            }
          ]
        }
      ]
    });

    if (!group) {
      throwWithCode("Study group not found.", 404);
    }

    const resources = group.additionalResources.map(resource => ({
      id: resource.id,
      fileName: path.basename(resource.filePath),
      filePath: resource.filePath,
      fileType: resource.fileType,
      likesCount: resource.likesCount,
      dislikesCount: resource.dislikesCount,
      uploadedAt: resource.created_at,
      uploadedBy: resource.uploadedBy,
      uploader: resource.uploader ? {
        id: resource.uploader.user_id,
        username: resource.uploader.username,
        fullName: resource.uploader.fullName
      } : null,
      topic: resource.topic ? {
        id: resource.topic.id,
        title: resource.topic.title
      } : null,
      subTopic: resource.subTopic ? {
        id: resource.subTopic.id,
        title: resource.subTopic.title
      } : null
    }));

    return {
      groupCode,
      groupName: group.name,
      totalResources: resources.length,
      resources
    };
  } catch (error) {
    throw error;
  }
};

// Add additional resources to a group
export const addAdditionalResources = async (groupCode, userId, files, topicId = null, subTopicId = null) => {
  let transaction;
  const createdResourcesForCleanup = [];

  try {
    transaction = await sequelize.transaction();

    // Check if group exists and user is a member
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { userId },
          required: true
        },
        {
          model: Syllabus,
          include: [
            {
              model: Topic,
              attributes: ['id', 'title']
            }
          ]
        }
      ],
      transaction
    });

    if (!group) {
      throwWithCode("Study group not found or you are not a member of this group.", 404);
    }

    // Validate topic and subtopic if provided
    if (topicId) {
      const syllabusId = group.syllabus?.id;
      if (!syllabusId) {
        throwWithCode("Group does not have a syllabus.", 400);
      }
      
      const topic = await Topic.findOne({
        where: { 
          id: topicId,
          syllabusId: syllabusId
        },
        transaction
      });
      
      if (!topic) {
        throwWithCode("Invalid topic ID for this group.", 400);
      }
    }

    if (subTopicId) {
      const subTopic = await SubTopic.findOne({
        where: { 
          id: subTopicId,
          topicId: topicId
        },
        transaction
      });
      
      if (!subTopic) {
        throwWithCode("Invalid subtopic ID for the specified topic.", 400);
      }
    }

    if (!files || files.length === 0) {
      throwWithCode("No files provided.", 400);
    }

    const createdResources = [];

    for (const file of files) {
      const allowedTypes = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg',
        '.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm',
        '.mp3', '.wav', '.aac', '.ogg', '.flac',
        '.txt'
      ];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        throwWithCode(`File type ${fileExtension} is not allowed.`, 400);
      }

      const resourceData = {
        studyGroupId: group.id,
        filePath: file.path,
        fileType: file.mimetype,
        topicId: topicId || null,
        subTopicId: subTopicId || null,
        uploadedBy: userId,
        status: 'pending' // New uploads need approval
      };

      const newResource = await AdditionalResource.create(resourceData, { transaction });
      createdResourcesForCleanup.push(newResource);
      
      createdResources.push({
        id: newResource.id,
        fileName: file.originalname,
        filePath: newResource.filePath,
        fileType: newResource.fileType,
        uploadedAt: newResource.created_at
      });
    }

    await transaction.commit();
    
    return {
      message: "Additional resources added successfully!",
      groupCode,
      addedResources: createdResources
    };

  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    // Clean up uploaded files if database operation failed
    createdResourcesForCleanup.forEach((resource) => {
      if (resource.filePath && fs.existsSync(resource.filePath)) {
        fs.unlink(resource.filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
          }
        });
      }
    });

    // Also clean up files that weren't saved to database
    if (files) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting temp file:", unlinkErr);
            }
          });
        }
      });
    }

    throw error;
  }
};

// Report a user within a group
export const reportUserInGroup = async (reporterId, reportedUserId, groupCode, reportData) => {
  try {
    // Find the group by group code
    const group = await StudyGroup.findOne({ 
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { userId: reporterId },
          required: true
        }
      ]
    });

    if (!group) {
      throwWithCode("Group not found or you are not a member of this group.", 404);
    }

    // Check if reported user is a member of this group
    const reportedUserMembership = await Membership.findOne({
      where: { 
        userId: reportedUserId, 
        studyGroupId: group.id 
      }
    });

    if (!reportedUserMembership) {
      throwWithCode("Cannot report a user who is not a member of this group.", 400);
    }

    // Prevent self-reporting
    if (reporterId === reportedUserId) {
      throwWithCode("You cannot report yourself.", 400);
    }

    // Import UserReport model here to avoid circular dependency
    const { UserReport } = await import("../models/index.model.js");

    // Check if user has already reported this user in this group
    const existingReport = await UserReport.findOne({
      where: {
        reporterId,
        reportedUserId,
        studyGroupId: group.id
      }
    });

    if (existingReport) {
      throwWithCode("You have already reported this user in this group.", 409);
    }

    // Create the report
    const userReport = await UserReport.create({
      reporterId,
      reportedUserId,
      studyGroupId: group.id,
      reason: reportData.reason,
      description: reportData.description || null
    });

    // Fetch the created report with user details
    const createdReport = await UserReport.findByPk(userReport.id, {
      include: [
        {
          model: UserModel,
          as: "reporter",
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: UserModel,
          as: "reportedUser",
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: StudyGroup,
          attributes: ['id', 'name', 'groupCode']
        }
      ]
    });

    return createdReport;
  } catch (error) {
    throw error;
  }
};

// Get reports for a specific group (for group admins)
export const getGroupReports = async (userId, groupCode, status = null) => {
  try {
    // Verify user is admin of the group
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { 
            userId,
            role: 'admin' 
          },
          required: true
        }
      ]
    });

    if (!group) {
      throwWithCode("Group not found or you are not an admin of this group.", 403);
    }

    // Import UserReport model here to avoid circular dependency
    const { UserReport } = await import("../models/index.model.js");

    // Build where condition for reports
    const whereCondition = { studyGroupId: group.id };
    if (status) {
      whereCondition.status = status;
    }

    const reports = await UserReport.findAll({
      where: whereCondition,
      include: [
        {
          model: UserModel,
          as: "reporter",
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: UserModel,
          as: "reportedUser",
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: UserModel,
          as: "reviewer",
          attributes: ['user_id', 'username', 'fullName'],
          required: false
        },
        {
          model: StudyGroup,
          attributes: ['id', 'name', 'groupCode']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return reports;
  } catch (error) {
    throw error;
  }
};

// Get pending resources for group admin approval
export const getPendingResources = async (adminUserId, groupCode) => {
  try {
    // Check if group exists
    const group = await StudyGroup.findOne({
      where: { groupCode }
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: adminUserId, 
        studyGroupId: group.id 
      }
    });

    const isCreator = group.creatorId === adminUserId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to view pending resources.", 403);
    }

    // Get all pending resources for this group
    const pendingResources = await AdditionalResource.findAll({
      where: { 
        studyGroupId: group.id,
        status: 'pending'
      },
      include: [
        {
          model: UserModel,
          attributes: ['user_id', 'username', 'fullName'],
          as: 'uploader'
        },
        {
          model: Topic,
          attributes: ['id', 'title'],
          required: false
        },
        {
          model: SubTopic,
          attributes: ['id', 'title'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formattedResources = pendingResources.map(resource => ({
      id: resource.id,
      fileName: path.basename(resource.filePath),
      filePath: resource.filePath,
      fileType: resource.fileType,
      uploadedAt: resource.created_at,
      status: resource.status,
      uploader: {
        id: resource.uploadedBy,
        username: resource.uploader?.username || 'Unknown',
        fullName: resource.uploader?.fullName || 'Unknown'
      },
      topic: resource.Topic ? {
        id: resource.Topic.id,
        title: resource.Topic.title
      } : null,
      subTopic: resource.SubTopic ? {
        id: resource.SubTopic.id,
        title: resource.SubTopic.title
      } : null
    }));

    return {
      groupCode,
      groupName: group.name,
      totalPendingResources: formattedResources.length,
      pendingResources: formattedResources
    };
  } catch (error) {
    throw error;
  }
};

// Approve a resource
export const approveResource = async (adminUserId, resourceId, groupCode) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists and user is admin
    const group = await StudyGroup.findOne({
      where: { groupCode },
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: adminUserId, 
        studyGroupId: group.id 
      },
      transaction
    });

    const isCreator = group.creatorId === adminUserId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to approve resources.", 403);
    }

    // Find the resource
    const resource = await AdditionalResource.findOne({
      where: { 
        id: resourceId,
        studyGroupId: group.id,
        status: 'pending'
      },
      transaction
    });

    if (!resource) {
      throwWithCode("Resource not found or already processed.", 404);
    }

    // Update resource status to approved
    resource.status = 'approved';
    await resource.save({ transaction });

    await transaction.commit();

    return {
      message: "Resource approved successfully.",
      resourceId: resource.id,
      fileName: path.basename(resource.filePath)
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Reject a resource
export const rejectResource = async (adminUserId, resourceId, groupCode, reason = null) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists and user is admin
    const group = await StudyGroup.findOne({
      where: { groupCode },
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: adminUserId, 
        studyGroupId: group.id 
      },
      transaction
    });

    const isCreator = group.creatorId === adminUserId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to reject resources.", 403);
    }

    // Find the resource
    const resource = await AdditionalResource.findOne({
      where: { 
        id: resourceId,
        studyGroupId: group.id,
        status: 'pending'
      },
      transaction
    });

    if (!resource) {
      throwWithCode("Resource not found or already processed.", 404);
    }

    // Delete the physical file
    if (fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }

    // Delete the resource record
    await resource.destroy({ transaction });

    await transaction.commit();

    return {
      message: "Resource rejected and deleted successfully.",
      resourceId: resource.id,
      fileName: path.basename(resource.filePath),
      reason: reason || "No reason provided"
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Edit syllabus for a group (admin only)
export const editGroupSyllabus = async (adminUserId, groupCode, updatedSyllabusData) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Syllabus,
          include: [
            {
              model: Topic,
              include: [SubTopic]
            }
          ]
        }
      ],
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: adminUserId, 
        studyGroupId: group.id 
      },
      transaction
    });

    const isCreator = group.creatorId === adminUserId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to edit the syllabus.", 403);
    }

    if (!group.syllabus) {
      throwWithCode("Group doesn't have a syllabus.", 404);
    }

    // Validate the updated syllabus data
    if (!updatedSyllabusData.topics || !Array.isArray(updatedSyllabusData.topics) || updatedSyllabusData.topics.length === 0) {
      throwWithCode("Syllabus must contain at least one topic.", 400);
    }

    for (const topic of updatedSyllabusData.topics) {
      if (!topic.title) {
        throwWithCode("Each topic must have a title.", 400);
      }
    }

    const syllabusId = group.syllabus.id;

    // Delete existing topics and subtopics
    // First get all topic IDs for this syllabus
    const topics = await Topic.findAll({
      where: { syllabusId },
      attributes: ['id'],
      transaction
    });

    const topicIds = topics.map(topic => topic.id);

    // Delete subtopics first (due to foreign key constraints)
    if (topicIds.length > 0) {
      await SubTopic.destroy({
        where: {
          topicId: {
            [Op.in]: topicIds
          }
        },
        transaction
      });
    }

    // Then delete topics
    await Topic.destroy({
      where: { syllabusId },
      transaction
    });

    // Create new topics and subtopics
    const createdTopics = [];
    for (const topicData of updatedSyllabusData.topics) {
      const newTopic = await Topic.create(
        {
          syllabusId: syllabusId,
          title: topicData.title,
          description: topicData.description || null,
        },
        { transaction }
      );

      const createdSubTopics = [];
      if (topicData.subTopics && Array.isArray(topicData.subTopics)) {
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
      }
      createdTopics.push({ ...newTopic.toJSON(), subTopics: createdSubTopics });
    }

    await transaction.commit();

    return {
      message: "Syllabus updated successfully.",
      groupCode,
      groupName: group.name,
      syllabus: {
        id: syllabusId,
        topics: createdTopics
      }
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Delete an approved resource (admin only)
export const deleteApprovedResource = async (adminUserId, groupCode, resourceId) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists
    const group = await StudyGroup.findOne({
      where: { groupCode },
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: adminUserId, 
        studyGroupId: group.id 
      },
      transaction
    });

    const isCreator = group.creatorId === adminUserId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to delete resources.", 403);
    }

    // Find the resource
    const resource = await AdditionalResource.findOne({
      where: { 
        id: resourceId,
        studyGroupId: group.id,
        status: 'approved'
      },
      transaction
    });

    if (!resource) {
      throwWithCode("Resource not found or not approved.", 404);
    }

    // Delete the physical file
    if (fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }

    // Delete the resource record
    await resource.destroy({ transaction });

    await transaction.commit();

    return {
      message: "Resource deleted successfully.",
      resourceId: resource.id,
      fileName: path.basename(resource.filePath)
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Report a resource (changes status from approved to pending)
export const reportResource = async (userId, groupCode, resourceId, reportData) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists
    const group = await StudyGroup.findOne({
      where: { groupCode },
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is a member of the group
    const membership = await Membership.findOne({
      where: { 
        userId, 
        studyGroupId: group.id 
      },
      transaction
    });

    if (!membership) {
      throwWithCode("You must be a member of this group to report resources.", 403);
    }

    // Find the resource
    const resource = await AdditionalResource.findOne({
      where: { 
        id: resourceId,
        studyGroupId: group.id,
        status: 'approved'
      },
      transaction
    });

    if (!resource) {
      throwWithCode("Resource not found or not approved.", 404);
    }

    // Prevent users from reporting their own resources
    if (resource.uploadedBy === userId) {
      throwWithCode("You cannot report your own resource.", 400);
    }

    // Import UserReport model to create resource report
    const { UserReport } = await import("../models/index.model.js");

    // Check if user has already reported this resource
    const existingReport = await UserReport.findOne({
      where: {
        reporterId: userId,
        reportedUserId: resource.uploadedBy,
        studyGroupId: group.id,
        reason: reportData.reason,
        description: `Resource ID: ${resourceId}`
      },
      transaction
    });
    if (existingReport) {
      throwWithCode("You have already reported this resource.", 409);
    }

    // Create a user report for the resource
    const userReport = await UserReport.create({
      reporterId: userId,
      reportedUserId: resource.uploadedBy,
      studyGroupId: group.id,
      reason: reportData.reason || 'offensive_content',
      description: `Resource Report - Resource ID: ${resourceId} - ${reportData.description || 'No description provided'}`
    }, { transaction });

    // Change resource status to pending
    resource.status = 'pending';
    await resource.save({ transaction });

    await transaction.commit();

    return {
      message: "Resource reported successfully. The resource has been marked as pending review.",
      resourceId: resource.id,
      fileName: path.basename(resource.filePath),
      reportId: userReport.id,
      status: 'pending'
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

// Edit group details (name and description) - Creator or admin only
export const editGroupDetails = async (userId, groupCode, updatedDetails) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if group exists
    const group = await StudyGroup.findOne({
      where: { groupCode },
      transaction
    });

    if (!group) {
      throwWithCode("Group not found.", 404);
    }

    // Check if user is group creator or admin
    const membership = await Membership.findOne({
      where: { 
        userId: userId, 
        studyGroupId: group.id 
      },
      transaction
    });

    const isCreator = group.creatorId === userId;
    const isAdmin = membership && membership.role === 'admin';

    if (!isCreator && !isAdmin) {
      throwWithCode("You don't have permission to edit group details.", 403);
    }

    // Validate input
    const { name, description } = updatedDetails;
    
    if (!name || name.trim() === '') {
      throwWithCode("Group name is required.", 400);
    }

    if (name.length > 255) {
      throwWithCode("Group name must be 255 characters or less.", 400);
    }

    // Update group details
    await group.update({
      name: name.trim(),
      description: description ? description.trim() : description
    }, { transaction });

    await transaction.commit();

    // Return updated group data
    const updatedGroup = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: UserModel,
          attributes: ['username', 'fullName']
        }
      ]
    });

    return {
      success: true,
      message: "Group details updated successfully.",
      group: {
        id: updatedGroup.id,
        name: updatedGroup.name,
        description: updatedGroup.description,
        groupCode: updatedGroup.groupCode,
        isPrivate: updatedGroup.isPrivate,
        createdAt: updatedGroup.created_at,
        updatedAt: updatedGroup.updated_at
      }
    };

  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};





