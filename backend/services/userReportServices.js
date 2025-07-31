import UserReport from "../models/userReport.model.js";
import UserModel from "../models/user.model.js";
import StudyGroup from "../models/studyGroup.model.js";
import Membership from "../models/membership.model.js";
import throwWithCode from "../utils/errorthrow.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

// Report a user within a study group
export const reportUser = async (reporterId, reportedUserId, studyGroupId, reportData) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    // Validate that both users exist
    const reporter = await UserModel.findByPk(reporterId, { transaction });
    const reportedUser = await UserModel.findByPk(reportedUserId, { transaction });

    if (!reporter) {
      throwWithCode("Reporter user not found.", 404);
    }
    if (!reportedUser) {
      throwWithCode("Reported user not found.", 404);
    }

    // Validate that the study group exists
    const studyGroup = await StudyGroup.findByPk(studyGroupId, { transaction });
    if (!studyGroup) {
      throwWithCode("Study group not found.", 404);
    }

    // Check if reporter is a member of the study group
    const reporterMembership = await Membership.findOne({
      where: { 
        userId: reporterId, 
        studyGroupId: studyGroupId 
      },
      transaction
    });

    if (!reporterMembership) {
      throwWithCode("You must be a member of this group to report users.", 403);
    }

    // Check if reported user is a member of the study group
    const reportedMembership = await Membership.findOne({
      where: { 
        userId: reportedUserId, 
        studyGroupId: studyGroupId 
      },
      transaction
    });

    if (!reportedMembership) {
      throwWithCode("Cannot report a user who is not a member of this group.", 400);
    }

    // Prevent self-reporting
    if (reporterId === reportedUserId) {
      throwWithCode("You cannot report yourself.", 400);
    }

    // Check if user has already reported this user in this group
    const existingReport = await UserReport.findOne({
      where: {
        reporterId,
        reportedUserId,
        studyGroupId
      },
      transaction
    });

    if (existingReport) {
      throwWithCode("You have already reported this user in this group.", 409);
    }

    // Create the report
    const userReport = await UserReport.create({
      reporterId,
      reportedUserId,
      studyGroupId,
      reason: reportData.reason,
      description: reportData.description || null
    }, { transaction });

    await transaction.commit();

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
    if (transaction) await transaction.rollback();
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
            role: ['admin'] 
          },
          required: true
        }
      ]
    });

    if (!group) {
      throwWithCode("Group not found or you are not an admin of this group.", 403);
    }

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

// Update report status (for group admins)
export const updateReportStatus = async (userId, reportId, statusData) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const report = await UserReport.findByPk(reportId, {
      include: [
        {
          model: StudyGroup,
          include: [
            {
              model: Membership,
              where: { 
                userId,
                role: ['admin'] 
              },
              required: true
            }
          ]
        }
      ],
      transaction
    });

    if (!report) {
      throwWithCode("Report not found or you are not authorized to update it.", 403);
    }

    // Update the report
    await report.update({
      status: statusData.status,
      adminNotes: statusData.adminNotes || report.adminNotes,
      reviewedBy: userId,
      reviewedAt: new Date()
    }, { transaction });

    await transaction.commit();

    // Fetch updated report with all details
    const updatedReport = await UserReport.findByPk(reportId, {
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
          attributes: ['user_id', 'username', 'fullName']
        },
        {
          model: StudyGroup,
          attributes: ['id', 'name', 'groupCode']
        }
      ]
    });

    return updatedReport;
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
};

// Get user's own reports (reports they made)
export const getUserReports = async (userId) => {
  try {
    const reports = await UserReport.findAll({
      where: { reporterId: userId },
      include: [
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

// Get report details by ID
export const getReportDetails = async (userId, reportId) => {
  try {
    const report = await UserReport.findByPk(reportId, {
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
          attributes: ['id', 'name', 'groupCode'],
          include: [
            {
              model: Membership,
              where: { userId },
              required: true
            }
          ]
        }
      ]
    });

    if (!report) {
      throwWithCode("Report not found or you are not authorized to view it.", 404);
    }

    // Check if user is either the reporter or an admin of the group
    const userMembership = report.studyGroup.memberships[0];
    const isReporter = report.reporterId === userId;
    const isAdmin = userMembership.role === 'admin';

    if (!isReporter && !isAdmin) {
      throwWithCode("You are not authorized to view this report.", 403);
    }

    return report;
  } catch (error) {
    throw error;
  }
};

// Get aggregated report statistics for group admins
export const getReportStatistics = async (userId, groupCode) => {
  try {
    // Verify user is admin of the group
    const group = await StudyGroup.findOne({
      where: { groupCode },
      include: [
        {
          model: Membership,
          where: { 
            userId,
            role: ['admin'] 
          },
          required: true
        }
      ]
    });

    if (!group) {
      throwWithCode("Group not found or you are not an admin of this group.", 403);
    }

    const stats = await UserReport.findAll({
      where: { studyGroupId: group.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Convert to object format
    const statistics = {
      pending: 0,
      reviewed: 0,
      resolved: 0,
      dismissed: 0,
      total: 0
    };

    stats.forEach(stat => {
      statistics[stat.status] = parseInt(stat.count);
      statistics.total += parseInt(stat.count);
    });

    return statistics;
  } catch (error) {
    throw error;
  }
};
