import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import Membership from "./membership.model.js";

// Utility function to generate 6-character alphanumeric codes
function generateGroupCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateUniqueGroupCode() {
  let code, exists, attempts = 0;
  do {
    code = generateGroupCode();
    exists = await StudyGroup.findOne({ where: { groupCode: code } });
    attempts++;
  } while (exists && attempts < 5);
  if (exists) throw new Error("Failed to generate unique group code");
  return code;
}

const StudyGroup = sequelize.define(
  "studyGroup",
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
      defaultValue: () => generateUniqueGroupCode(),
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

// Association for group-membership
StudyGroup.hasMany(Membership, { foreignKey: "studyGroupId" });
Membership.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });

export default StudyGroup;
