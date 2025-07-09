import { DataTypes } from "sequelize";
import  sequelize  from "../config/database.js";

const Syllabus = sequelize.define(
  "syllabus",
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
  },
  {
    tableName: "syllabi",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Syllabus;
