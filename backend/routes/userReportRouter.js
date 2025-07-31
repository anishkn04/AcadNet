import express from 'express';
import {
  reportUser,
  getGroupReports,
  updateReportStatus,
  getUserReports,
  getReportDetails,
  getReportStatistics
} from '../controllers/userReportController.js';
import authMiddleware from "../middlewares/authmiddleware.js";
import csrfMiddleware from "../middlewares/csrf.js";
import addUser from '../middlewares/addUsertoReq.js';

const router = express.Router();

// Report a user in a specific group
router.post("/groups/:studyGroupId/users/:reportedUserId/report", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  reportUser
);

// Get all reports for a group (admin only)
router.get("/groups/:groupCode/reports", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  getGroupReports
);

// Get report statistics for a group (admin only)
router.get("/groups/:groupCode/reports/statistics", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  getReportStatistics
);

// Update report status (admin only)
router.patch("/reports/:reportId/status", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  updateReportStatus
);

// Get user's own reports
router.get("/my-reports", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  getUserReports
);

// Get specific report details
router.get("/reports/:reportId", 
  authMiddleware, 
  csrfMiddleware, 
  addUser, 
  getReportDetails
);

export default router;
