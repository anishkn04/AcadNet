import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AdditionalResource = sequelize.define(
 "AdditionalResource",
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
  filePath: {
   type: DataTypes.STRING,
   allowNull: false,
  },
 },
 {
  tableName: "additional_resources",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
 }
);

export default AdditionalResource;