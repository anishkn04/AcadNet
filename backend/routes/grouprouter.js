import express from 'express'
import { getGroups , createGroup, groupOverview, groupDetails, groupOverviewByCode } from '../controllers/groupcontroller.js'
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
 upload.array("additionalResources", 10), // a new middleware to accept up to 10 files
 createGroup
);

router.get("/overview",  groupOverview);
router.get("/details/:groupCode", groupDetails);
router.get("/overview/:groupCode", groupOverviewByCode);

// Endpoint for user to join a group by group code
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

export default router