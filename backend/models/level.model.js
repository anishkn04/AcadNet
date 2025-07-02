import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const LevelModel = sequelize.define(
  "Level",
  {
    level_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    level_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "levels",
    timestamps: false,
  }
);

export default LevelModel;
