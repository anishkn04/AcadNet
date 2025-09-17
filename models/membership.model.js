import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const Membership = sequelize.define(
  "membership",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    studyGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "study_groups",
        key: "id",
      },
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),
      defaultValue: 'member',
      allowNull: false,
    },
  },
  {
    tableName: "memberships",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Membership;
