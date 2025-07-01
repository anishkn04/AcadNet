import { DataTypes } from "sequelize";
import  sequelize  from "../config/database.js";

const Topic = sequelize.define(
  "Topic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    syllabusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "syllabi",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
  },
  {
    tableName: "topics",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Topic;
