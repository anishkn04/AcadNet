import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Utility function to generate 6-character alphanumeric codes
function generateGroupCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const StudyGroup = sequelize.define(
  "StudyGroup",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,

    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
  

    groupCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
      defaultValue: () => generateGroupCode(),
    },

    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "study_groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default StudyGroup;
