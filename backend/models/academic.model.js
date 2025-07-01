import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AcademicModel = sequelize.define(
  "Academic",
  {
    academic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "levels",
        key: "level_id",
      },
    },
    field_of_study_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fields_of_study",
        key: "field_of_study_id",
      },
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "universities",
        key: "university_id",
      },
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "colleges",
        key: "college_id",
      },
    },
  },
  {
    tableName: "academics",
    timestamps: false,
  }
);

export default AcademicModel;
