import * as userReportServices from "../services/userReportServices.js";
import jsonRes from "../utils/response.js";

// Report a user
export const reportUser = async (req, res) => {
  try {
    const reporterId = req.id;
    const { reportedUserId, studyGroupId } = req.params;
    const { reason, description } = req.body;

    // Validate required fields
    if (!reason) {
      return jsonRes(res, 400, false, "Reason is required.");
    }

    if (!reportedUserId || !studyGroupId) {
      return jsonRes(res, 400, false, "Reported user ID and study group ID are required.");
    }

    const validReasons = [
      'inappropriate_behavior',
      'harassment', 
      'spam',
      'offensive_content',
      'violation_of_rules',
      'fake_profile',
      'academic_dishonesty',
      'other'
    ];

    if (!validReasons.includes(reason)) {
      return jsonRes(res, 400, false, "Invalid reason provided.");
    }

    const report = await userReportServices.reportUser(
      reporterId,
      parseInt(reportedUserId),
      studyGroupId,
      { reason, description }
    );

    jsonRes(res, 201, true, {
      message: "User reported successfully.",
      report
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to report user.");
  }
};

// Get reports for a group (admin only)
export const getGroupReports = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;
    const { status } = req.query;

    const reports = await userReportServices.getGroupReports(userId, groupCode, status);

    jsonRes(res, 200, true, {
      message: "Reports retrieved successfully.",
      reports
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve reports.");
  }
};

// Update report status (admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return jsonRes(res, 400, false, "Status is required.");
    }

    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return jsonRes(res, 400, false, "Invalid status provided.");
    }

    const updatedReport = await userReportServices.updateReportStatus(
      userId,
      parseInt(reportId),
      { status, adminNotes }
    );

    jsonRes(res, 200, true, {
      message: "Report status updated successfully.",
      report: updatedReport
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to update report status.");
  }
};

// Get user's own reports
export const getUserReports = async (req, res) => {
  try {
    const userId = req.id;

    const reports = await userReportServices.getUserReports(userId);

    jsonRes(res, 200, true, {
      message: "User reports retrieved successfully.",
      reports
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve user reports.");
  }
};

// Get report details
export const getReportDetails = async (req, res) => {
  try {
    const userId = req.id;
    const { reportId } = req.params;

    const report = await userReportServices.getReportDetails(userId, parseInt(reportId));

    jsonRes(res, 200, true, {
      message: "Report details retrieved successfully.",
      report
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve report details.");
  }
};

// Get report statistics for a group (admin only)
export const getReportStatistics = async (req, res) => {
  try {
    const userId = req.id;
    const { groupCode } = req.params;

    const statistics = await userReportServices.getReportStatistics(userId, groupCode);

    jsonRes(res, 200, true, {
      message: "Report statistics retrieved successfully.",
      statistics
    });
  } catch (err) {
    jsonRes(res, err.code || 500, false, err.message || "Failed to retrieve report statistics.");
  }
};
