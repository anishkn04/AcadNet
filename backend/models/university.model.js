import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UniversityModel = sequelize.define(
  "University",
  {
    university_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "universities",
    timestamps: false,
  }
);

export default UniversityModel;
