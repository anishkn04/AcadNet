import express from 'express';
import { 
  getGroupForum, 
  createThread, 
  getThreadDetails, 
  createReply, 
  likeReply, 
  dislikeReply, 
  editReply, 
  deleteReply, 
  toggleThreadPin, 
  toggleThreadLock 
} from '../controllers/forumcontroller.js';
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import addUser from '../middlewares/addUsertoReq.js';

const router = express.Router();

// Get forum for a group
router.get("/groups/:groupCode/forum", authMiddleware, csrfMiddleware, getGroupForum);

// Thread routes
router.post("/groups/:groupCode/threads", authMiddleware, csrfMiddleware, addUser, createThread);
router.get("/threads/:threadId", authMiddleware, csrfMiddleware, addUser, getThreadDetails);

// Reply routes
router.post("/threads/:threadId/replies", authMiddleware, csrfMiddleware, addUser, createReply);
router.put("/replies/:replyId", authMiddleware, csrfMiddleware, addUser, editReply);
router.delete("/replies/:replyId", authMiddleware, csrfMiddleware, addUser, deleteReply);

// Reply like/dislike routes
router.post("/replies/:replyId/like", authMiddleware, csrfMiddleware, addUser, likeReply);
router.post("/replies/:replyId/dislike", authMiddleware, csrfMiddleware, addUser, dislikeReply);

// Admin routes
router.patch("/groups/:groupCode/threads/:threadId/pin", authMiddleware, csrfMiddleware, addUser, toggleThreadPin);
router.patch("/groups/:groupCode/threads/:threadId/lock", authMiddleware, csrfMiddleware, addUser, toggleThreadLock);

export default router;
