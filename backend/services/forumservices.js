import Forum from "../models/forum.model.js";
import Thread from "../models/thread.model.js";
import Reply from "../models/reply.model.js";
import ReplyLike from "../models/replyLike.model.js";
import StudyGroup from "../models/studyGroup.model.js";
import UserModel from "../models/user.model.js";
import Membership from "../models/membership.model.js";
import sequelize from "../config/database.js";
import throwWithCode from "../utils/errorthrow.js";

// Create a forum for a study group (automatically called when group is created)
export const createForum = async (studyGroupId, forumData = {}) => {
  try {
    const forum = await Forum.create({
      studyGroupId,
      name: forumData.name || "General Discussion",
      description: forumData.description || "Main discussion forum for the group"
    });
    return forum;
  } catch (error) {
    throw error;
  }
};

// Get forum for a group
export const getGroupForum = async (groupCode) => {
  try {
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Forum,
          include: [
            {
              model: Thread,
              include: [
                {
                  model: UserModel,
                  as: "author",
                  attributes: ['user_id', 'username', 'fullName']
                },
                {
                  model: UserModel,
                  as: "lastReplier",
                  attributes: ['user_id', 'username', 'fullName']
                }
              ],
              order: [
                ['isPinned', 'DESC'],
                ['lastReplyAt', 'DESC'],
                ['created_at', 'DESC']
              ]
            }
          ]
        }
      ]
    });

    if (!group) {
      throwWithCode("Study group not found.", 404);
    }

    return {
      groupCode,
      groupName: group.name,
      forum: group.forum
    };
  } catch (error) {
    throw error;
  }
};

// Create a new thread
export const createThread = async (groupCode, userId, threadData) => {
  let transaction;

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
          model: Forum
        }
      ],
      transaction
    });

    if (!group) {
      throwWithCode("Study group not found or you are not a member of this group.", 404);
    }

    if (!group.forum) {
      throwWithCode("Forum not found for this group.", 404);
    }

    const thread = await Thread.create({
      forumId: group.forum.id,
      authorId: userId,
      title: threadData.title,
      content: threadData.content,
      isPinned: threadData.isPinned || false
    }, { transaction });

    await transaction.commit();

    // Fetch the created thread with author details
    const createdThread = await Thread.findByPk(thread.id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ['user_id', 'username', 'fullName']
        }
      ]
    });

    return createdThread;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Get thread details with replies
export const getThreadDetails = async (threadId, userId = null) => {
  try {
    const thread = await Thread.findByPk(threadId, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: Reply,
          where: { isDeleted: false },
          required: false,
          include: [
            {
              model: UserModel,
              as: "author",
              attributes: ['user_id', 'username', 'fullName']
            },
            {
              model: Reply,
              as: "childReplies",
              where: { isDeleted: false },
              required: false,
              include: [
                {
                  model: UserModel,
                  as: "author",
                  attributes: ['user_id', 'username', 'fullName']
                }
              ]
            }
          ]
        }
      ],
      order: [
        [Reply, 'created_at', 'ASC'],
        [Reply, Reply, 'created_at', 'ASC']
      ]
    });

    if (!thread) {
      throwWithCode("Thread not found.", 404);
    }

    // Increment view count
    await Thread.increment('viewCount', { where: { id: threadId } });

    return thread;
  } catch (error) {
    throw error;
  }
};

// Create a reply to a thread
export const createReply = async (threadId, userId, replyData) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Check if thread exists and is not locked
    const thread = await Thread.findByPk(threadId, {
      include: [
        {
          model: Forum,
          include: [
            {
              model: StudyGroup,
              include: [
                {
                  model: Membership,
                  where: { userId },
                  required: true
                }
              ]
            }
          ]
        }
      ],
      transaction
    });

    if (!thread) {
      throwWithCode("Thread not found.", 404);
    }

    if (thread.isLocked) {
      throwWithCode("Cannot reply to a locked thread.", 403);
    }

    if (!thread.forum.study_group.memberships.length) {
      throwWithCode("You are not a member of this group.", 403);
    }

    // Validate parent reply if provided
    if (replyData.parentReplyId) {
      const parentReply = await Reply.findOne({
        where: { 
          id: replyData.parentReplyId, 
          threadId: threadId,
          isDeleted: false 
        },
        transaction
      });
      
      if (!parentReply) {
        throwWithCode("Parent reply not found or has been deleted.", 404);
      }
    }

    const reply = await Reply.create({
      threadId,
      authorId: userId,
      content: replyData.content,
      parentReplyId: replyData.parentReplyId || null
    }, { transaction });

    // Update thread reply count and last reply info
    await Thread.update({
      replyCount: sequelize.literal('reply_count + 1'),
      lastReplyAt: new Date(),
      lastReplyBy: userId
    }, {
      where: { id: threadId },
      transaction
    });

    await transaction.commit();

    // Fetch the created reply with author details
    const createdReply = await Reply.findByPk(reply.id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: ['user_id', 'username', 'fullName']
        }
      ]
    });

    return createdReply;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Like/Unlike a reply
export const likeReply = async (userId, replyId) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const reply = await Reply.findByPk(replyId, { transaction });
    if (!reply) {
      throwWithCode("Reply not found.", 404);
    }

    if (reply.isDeleted) {
      throwWithCode("Cannot like a deleted reply.", 400);
    }

    const existingLike = await ReplyLike.findOne({
      where: { userId, replyId },
      transaction
    });

    if (existingLike) {
      if (existingLike.likeType === 'like') {
        // Remove like
        await existingLike.destroy({ transaction });
        await Reply.decrement('likeCount', { where: { id: replyId }, transaction });
        await transaction.commit();
        return { action: 'removed_like', message: 'Like removed successfully' };
      } else {
        // Change from dislike to like
        existingLike.likeType = 'like';
        await existingLike.save({ transaction });
        await Reply.increment('likeCount', { where: { id: replyId }, transaction });
        await transaction.commit();
        return { action: 'changed_to_like', message: 'Changed from dislike to like' };
      }
    } else {
      // Add new like
      await ReplyLike.create({ userId, replyId, likeType: 'like' }, { transaction });
      await Reply.increment('likeCount', { where: { id: replyId }, transaction });
      await transaction.commit();
      return { action: 'added_like', message: 'Reply liked successfully' };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Dislike a reply
export const dislikeReply = async (userId, replyId) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const reply = await Reply.findByPk(replyId, { transaction });
    if (!reply) {
      throwWithCode("Reply not found.", 404);
    }

    if (reply.isDeleted) {
      throwWithCode("Cannot dislike a deleted reply.", 400);
    }

    const existingLike = await ReplyLike.findOne({
      where: { userId, replyId },
      transaction
    });

    if (existingLike) {
      if (existingLike.likeType === 'dislike') {
        // Remove dislike
        await existingLike.destroy({ transaction });
        await transaction.commit();
        return { action: 'removed_dislike', message: 'Dislike removed successfully' };
      } else {
        // Change from like to dislike
        existingLike.likeType = 'dislike';
        await existingLike.save({ transaction });
        await Reply.decrement('likeCount', { where: { id: replyId }, transaction });
        await transaction.commit();
        return { action: 'changed_to_dislike', message: 'Changed from like to dislike' };
      }
    } else {
      // Add new dislike
      await ReplyLike.create({ userId, replyId, likeType: 'dislike' }, { transaction });
      await transaction.commit();
      return { action: 'added_dislike', message: 'Reply disliked successfully' };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Edit a reply
export const editReply = async (userId, replyId, newContent) => {
  try {
    const reply = await Reply.findByPk(replyId);
    
    if (!reply) {
      throwWithCode("Reply not found.", 404);
    }

    if (reply.authorId !== userId) {
      throwWithCode("You can only edit your own replies.", 403);
    }

    if (reply.isDeleted) {
      throwWithCode("Cannot edit a deleted reply.", 400);
    }

    await reply.update({
      content: newContent,
      isEdited: true,
      editedAt: new Date()
    });

    return reply;
  } catch (error) {
    throw error;
  }
};

// Delete a reply (soft delete)
export const deleteReply = async (userId, replyId, isAdmin = false) => {
  try {
    const reply = await Reply.findByPk(replyId);
    
    if (!reply) {
      throwWithCode("Reply not found.", 404);
    }

    if (!isAdmin && reply.authorId !== userId) {
      throwWithCode("You can only delete your own replies.", 403);
    }

    if (reply.isDeleted) {
      throwWithCode("Reply is already deleted.", 400);
    }

    await reply.update({
      isDeleted: true,
      content: "[This reply has been deleted]"
    });

    return { message: "Reply deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Pin/Unpin a thread (admin only)
export const toggleThreadPin = async (userId, threadId, groupCode) => {
  try {
    // Check if user is admin of the group
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { userId, role: 'admin' },
          required: true
        }
      ]
    });

    if (!group && group.creatorId !== userId) {
      throwWithCode("You don't have permission to pin/unpin threads.", 403);
    }

    const thread = await Thread.findByPk(threadId);
    if (!thread) {
      throwWithCode("Thread not found.", 404);
    }

    await thread.update({ isPinned: !thread.isPinned });
    
    return { 
      message: `Thread ${thread.isPinned ? 'pinned' : 'unpinned'} successfully`,
      isPinned: thread.isPinned
    };
  } catch (error) {
    throw error;
  }
};

// Lock/Unlock a thread (admin only)
export const toggleThreadLock = async (userId, threadId, groupCode) => {
  try {
    // Check if user is admin of the group
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { userId, role: 'admin' },
          required: true
        }
      ]
    });

    if (!group && group.creatorId !== userId) {
      throwWithCode("You don't have permission to lock/unlock threads.", 403);
    }

    const thread = await Thread.findByPk(threadId);
    if (!thread) {
      throwWithCode("Thread not found.", 404);
    }

    await thread.update({ isLocked: !thread.isLocked });
    
    return { 
      message: `Thread ${thread.isLocked ? 'locked' : 'unlocked'} successfully`,
      isLocked: thread.isLocked
    };
  } catch (error) {
    throw error;
  }
};
