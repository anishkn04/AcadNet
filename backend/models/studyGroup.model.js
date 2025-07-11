import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

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
