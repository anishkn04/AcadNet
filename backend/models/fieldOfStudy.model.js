import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FieldOfStudyModel = sequelize.define(
  "FieldOfStudy",
  {
    field_of_study_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    field_of_study_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "fields_of_study",
    timestamps: false,
  }
);

export default FieldOfStudyModel;
