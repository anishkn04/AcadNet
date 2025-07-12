import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Forum = sequelize.define(
  "forum",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "General Discussion",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "forums",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Forum;
