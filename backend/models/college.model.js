import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CollegeModel = sequelize.define(
  "College",
  {
    college_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    college_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "universities",
        key: "university_id",
      },
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "countries",
        key: "country_id",
      },
    },
  },
  {
    tableName: "colleges",
    timestamps: false,
  }
);

export default CollegeModel;
