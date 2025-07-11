import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { type } from "os";

const AdditionalResource = sequelize.define(
 "additionalResource",
 {
  id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true,
  },
  studyGroupId: {
   type: DataTypes.UUID,
   allowNull: false,
   references: {
    model: "study_groups",
    key: "id",
   },
  },
  topicId: {
   type: DataTypes.INTEGER,
   allowNull: true,
   references: {
    model: "topics",
    key: "id"
   }
  },
  subTopicId: {
   type: DataTypes.INTEGER,
   allowNull: true,
   references: {
    model: "sub_topics",
    key: "id"
   }
  },
  filePath: {
   type: DataTypes.STRING,
   allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  dislikesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
 },
 {
  tableName: "additional_resources",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
 }
);

export default AdditionalResource;