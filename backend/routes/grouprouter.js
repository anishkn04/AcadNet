import express from 'express'
import { getGroups , createGroup, groupOverview, groupDetails, groupDetailsById, groupOverviewByCode , likeAdditionalResource, dislikeAdditionalResource, getResourceStatus, leaveGroup, removeGroupMember, promoteGroupMember, demoteGroupMember, getGroupResources, addGroupResources, reportUserInGroup, getGroupReportsController, getPendingResourcesController, approveResourceController, rejectResourceController, editGroupSyllabusController, deleteApprovedResourceController} from '../controllers/groupcontroller.js'
import { joinGroup } from '../services/groupservices.js';
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import upload from '../middlewares/multer.js';
import addUser from '../middlewares/addUsertoReq.js';

const router = express.Router()

router.get("/groups",authMiddleware,csrfMiddleware,addUser,getGroups)

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
    const isAnonymous = req.body.isAnonymous || false;
    if (!groupCode) {
      return res.status(400).json({ success: false, message: "Group code is required." });
    }
    const result = await joinGroup(userId, groupCode, isAnonymous);
    res.status(200).json({ success: true, message: "Joined group successfully.", data: result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to join group." });
  }
});

router.post("/leave/:groupCode", authMiddleware, csrfMiddleware, addUser, leaveGroup);
router.post("/:groupCode/remove/:userId", authMiddleware, csrfMiddleware, addUser, removeGroupMember);
router.post("/:groupCode/members/:userId/promote", authMiddleware, csrfMiddleware, addUser, promoteGroupMember);
router.post("/:groupCode/members/:userId/demote", authMiddleware, csrfMiddleware, addUser, demoteGroupMember);


router.post("/resource/:resourceId/like", authMiddleware, csrfMiddleware, addUser, likeAdditionalResource);
router.post("/resource/:resourceId/dislike", authMiddleware, csrfMiddleware, addUser, dislikeAdditionalResource);
router.get("/resource/:resourceId/status", authMiddleware, csrfMiddleware, addUser, getResourceStatus);

// New routes for additional resources
router.get("/:groupCode/resources", authMiddleware, csrfMiddleware, getGroupResources);
router.post(
  "/:groupCode/resources/add",
  authMiddleware, 
  csrfMiddleware, 
  addUser,
  upload.array("resources", 10),
  addGroupResources
);

// Report a user within a group
router.post(
  "/:groupCode/report/:reportedUserId",
  authMiddleware,
  csrfMiddleware,
  addUser,
  reportUserInGroup
);

// Get reports for a group (admin only)
router.get(
  "/:groupCode/reports",
  authMiddleware,
  csrfMiddleware,
  addUser,
  getGroupReportsController
);

// Resource approval routes
router.get(
  "/:groupCode/resources/pending",
  authMiddleware,
  csrfMiddleware,
  addUser,
  getPendingResourcesController
);

router.post(
  "/:groupCode/resources/:resourceId/approve",
  authMiddleware,
  csrfMiddleware,
  addUser,
  approveResourceController
);

router.post(
  "/:groupCode/resources/:resourceId/reject",
  authMiddleware,
  csrfMiddleware,
  addUser,
  rejectResourceController
);

// New routes for syllabus editing and resource deletion
router.put(
  "/:groupCode/syllabus/edit",
  authMiddleware,
  csrfMiddleware,
  addUser,
  editGroupSyllabusController
);

router.delete(
  "/:groupCode/resources/:resourceId/delete",
  authMiddleware,
  csrfMiddleware,
  addUser,
  deleteApprovedResourceController
);

export default router