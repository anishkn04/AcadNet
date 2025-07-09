import express from 'express'
import { getGroups , createGroup, groupOverview, groupDetails, likeAdditionalResource, dislikeAdditionalResource, getResourceStatus } from '../controllers/groupcontroller.js'
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import upload from '../middlewares/multer.js';
import addUser from '../middlewares/addUsertoReq.js';

const router = express.Router()

router.get("/groups",authMiddleware,csrfMiddleware,getGroups)

router.post(
 "/create",
 authMiddleware, csrfMiddleware, addUser,
 upload.array("additionalResources", 10), 
 createGroup
);

router.get("/overview",  groupOverview);
router.get("/details/:groupId", authMiddleware, csrfMiddleware, groupDetails);

router.post("/resource/:resourceId/like", authMiddleware, csrfMiddleware, addUser, likeAdditionalResource);
router.post("/resource/:resourceId/dislike", authMiddleware, csrfMiddleware, addUser, dislikeAdditionalResource);
router.get("/resource/:resourceId/status", authMiddleware, csrfMiddleware, addUser, getResourceStatus);

export default router