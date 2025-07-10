import express from 'express'
import { getGroups , createGroup, groupOverview, groupDetails, groupDetailsById, groupOverviewByCode , likeAdditionalResource, dislikeAdditionalResource, getResourceStatus} from '../controllers/groupcontroller.js'
import { joinGroup } from '../services/groupservices.js';
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
router.get("/details/:groupCode", groupDetails);
router.get("/details/id/:groupId", groupDetailsById);
router.get("/overview/:groupCode", groupOverviewByCode);


router.post("/join/:groupCode", authMiddleware, csrfMiddleware, addUser, async (req, res) => {
  try {
    const userId = req.id;
    const groupCode = req.params.groupCode;
    if (!groupCode) {
      return res.status(400).json({ success: false, message: "Group code is required." });
    }
    const result = await joinGroup(userId, groupCode);
    res.status(200).json({ success: true, message: "Joined group successfully.", data: result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to join group." });
  }
});


router.post("/resource/:resourceId/like", authMiddleware, csrfMiddleware, addUser, likeAdditionalResource);
router.post("/resource/:resourceId/dislike", authMiddleware, csrfMiddleware, addUser, dislikeAdditionalResource);
router.get("/resource/:resourceId/status", authMiddleware, csrfMiddleware, addUser, getResourceStatus);

export default router