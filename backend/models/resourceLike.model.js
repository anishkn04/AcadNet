import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ResourceLike = sequelize.define(
  "ResourceLike",
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
        model: "user_models",
        key: "user_id",
      },
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "additional_resources",
        key: "id",
      },
    },
    likeType: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
  },
  {
    tableName: "resource_likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['userId', 'resourceId']
      }
    ]
  }
);

export default ResourceLike;
