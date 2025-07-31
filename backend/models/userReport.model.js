import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserReport = sequelize.define(
  "userReport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    reportedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    studyGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "study_groups",
        key: "id",
      },
    },
    reason: {
      type: DataTypes.ENUM(
        'inappropriate_behavior',
        'harassment',
        'spam',
        'offensive_content',
        'violation_of_rules',
        'fake_profile',
        'academic_dishonesty',
        'other'
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'resolved', 'dismissed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_reports",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['reporterId', 'reportedUserId', 'studyGroupId'],
        name: 'unique_reporter_reported_group'
      }
    ]
  }
);

export default UserReport;
