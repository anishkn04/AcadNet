import * as forumServices from "../services/forumservices.js";
import jsonRes from "../utils/response.js";

// Get forum for a group
export const getGroupForum = async (req, res) => {
  try {
    const { groupCode } = req.params;
    const forum = await forumServices.getGroupForum(groupCode);
    jsonRes(res, 200, true, forum);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch group forum.");
  }
};

// Create a new thread
export const createThread = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;
    const { title, content, isPinned } = req.body;

    if (!title || !content) {
      return jsonRes(res, 400, false, "Title and content are required.");
    }

    const thread = await forumServices.createThread(groupCode, userId, {
      title,
      content,
      isPinned: isPinned || false
    });

    jsonRes(res, 201, true, {
      message: "Thread created successfully!",
      thread
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to create thread.");
  }
};

// Get thread details with replies
export const getThreadDetails = async (req, res) => {
  try {
    const { threadId } = req.params;
    const userId = req.id || null;
    
    const thread = await forumServices.getThreadDetails(threadId, userId);
    jsonRes(res, 200, true, thread);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to fetch thread details.");
  }
};

// Create a reply to a thread
export const createReply = async (req, res) => {
  try {
    const userId = req.id;
    const { threadId } = req.params;
    const { content, parentReplyId } = req.body;

    if (!content) {
      return jsonRes(res, 400, false, "Content is required.");
    }

    const reply = await forumServices.createReply(threadId, userId, {
      content,
      parentReplyId: parentReplyId || null
    });

    jsonRes(res, 201, true, {
      message: "Reply created successfully!",
      reply
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to create reply.");
  }
};

// Like a reply
export const likeReply = async (req, res) => {
  try {
    const userId = req.id;
    const { replyId } = req.params;
    
    const result = await forumServices.likeReply(userId, replyId);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to like reply.");
  }
};

// Dislike a reply
export const dislikeReply = async (req, res) => {
  try {
    const userId = req.id;
    const { replyId } = req.params;
    
    const result = await forumServices.dislikeReply(userId, replyId);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to dislike reply.");
  }
};

// Edit a reply
export const editReply = async (req, res) => {
  try {
    const userId = req.id;
    const { replyId } = req.params;
    const { content } = req.body;

    if (!content) {
      return jsonRes(res, 400, false, "Content is required.");
    }

    const reply = await forumServices.editReply(userId, replyId, content);
    jsonRes(res, 200, true, {
      message: "Reply edited successfully!",
      reply
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to edit reply.");
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const userId = req.id;
    const { replyId } = req.params;
    
    // Check if user is admin (you can implement this logic based on your needs)
    const isAdmin = false; // This should be determined based on group membership
    
    const result = await forumServices.deleteReply(userId, replyId, isAdmin);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to delete reply.");
  }
};

// Pin/Unpin a thread (admin only)
export const toggleThreadPin = async (req, res) => {
  try {
    const userId = req.id;
    const { threadId, groupCode } = req.params;
    
    const result = await forumServices.toggleThreadPin(userId, threadId, groupCode);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to toggle thread pin.");
  }
};

// Lock/Unlock a thread (admin only)
export const toggleThreadLock = async (req, res) => {
  try {
    const userId = req.id;
    const { threadId, groupCode } = req.params;
    
    const result = await forumServices.toggleThreadLock(userId, threadId, groupCode);
    jsonRes(res, 200, true, result);
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to toggle thread lock.");
  }
};
