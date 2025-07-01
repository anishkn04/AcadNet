import { DataTypes } from "sequelize";
import { sequelize } from "./path-to-your-sequelize-instance.js"; // adjust path
import { v4 as uuidv4 } from "uuid";

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
        model: "users", // your UserModel table name
        key: "user_id",
      },
    },
    creatorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "study_groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations defined outside the model file, e.g., in models/index.js

export default StudyGroup;
