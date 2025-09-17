import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ReplyLike = sequelize.define(
  "replyLike",
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
    replyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "replies",
        key: "id",
      },
    },
    likeType: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
  },
  {
    tableName: "reply_likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['userId', 'replyId']
      }
    ]
  }
);

export default ReplyLike;
