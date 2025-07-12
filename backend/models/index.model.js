import UserModel from "./user.model.js";
import StudyGroup from "./studyGroup.model.js";
import Membership from "./membership.model.js";
import Syllabus from "./syallabus.model.js";
import Topic from "./topics.model.js";
import SubTopic from "./subtopics.model.js";
import AdditionalResource from "./additionalResources.model.js";
import ResourceLike from "./resourceLike.model.js";
import OTP from "./otp.model.js";
import RefreshToken from "./refresh.sequelize.model.js";
import Forum from "./forum.model.js";
import Thread from "./thread.model.js";
import Reply from "./reply.model.js";
import ReplyLike from "./replyLike.model.js";


UserModel.hasMany(StudyGroup, { foreignKey: "creatorId" });
StudyGroup.belongsTo(UserModel, { foreignKey: "creatorId" });


UserModel.belongsToMany(StudyGroup, {
  through: Membership,
  foreignKey: "userId",
  otherKey: "studyGroupId",
});
StudyGroup.belongsToMany(UserModel, {
  through: Membership,
  foreignKey: "studyGroupId",
  otherKey: "userId",
});

StudyGroup.hasOne(Syllabus, { foreignKey: "studyGroupId" });
Syllabus.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });

Syllabus.hasMany(Topic, { foreignKey: "syllabusId" });
Topic.belongsTo(Syllabus, { foreignKey: "syllabusId" });

Topic.hasMany(SubTopic, { foreignKey: "topicId" });
SubTopic.belongsTo(Topic, { foreignKey: "topicId" });

StudyGroup.hasMany(AdditionalResource, { foreignKey: "studyGroupId" });
AdditionalResource.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });
AdditionalResource.belongsTo(Topic, { foreignKey: "topicId" });
AdditionalResource.belongsTo(SubTopic, { foreignKey: "subTopicId" });

// User-OTP
UserModel.hasMany(OTP, { foreignKey: "user_id" });
OTP.belongsTo(UserModel, { foreignKey: "user_id" });

// User-RefreshToken
UserModel.hasMany(RefreshToken, { foreignKey: "user_id" });
RefreshToken.belongsTo(UserModel, { foreignKey: "user_id" });

// Resource Likes
UserModel.hasMany(ResourceLike, { foreignKey: "userId" });
ResourceLike.belongsTo(UserModel, { foreignKey: "userId" });

AdditionalResource.hasMany(ResourceLike, { foreignKey: "resourceId" });
ResourceLike.belongsTo(AdditionalResource, { foreignKey: "resourceId" });

// User-Membership direct associations
UserModel.hasMany(Membership, { foreignKey: "userId" });
Membership.belongsTo(UserModel, { foreignKey: "userId" });

StudyGroup.hasMany(Membership, { foreignKey: "studyGroupId" });
Membership.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });

// Forum Associations
StudyGroup.hasOne(Forum, { foreignKey: "studyGroupId" });
Forum.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });

// Thread Associations
Forum.hasMany(Thread, { foreignKey: "forumId" });
Thread.belongsTo(Forum, { foreignKey: "forumId" });

UserModel.hasMany(Thread, { foreignKey: "authorId", as: "authoredThreads" });
Thread.belongsTo(UserModel, { foreignKey: "authorId", as: "author" });

UserModel.hasMany(Thread, { foreignKey: "lastReplyBy", as: "lastRepliedThreads" });
Thread.belongsTo(UserModel, { foreignKey: "lastReplyBy", as: "lastReplier" });

// Reply Associations
Thread.hasMany(Reply, { foreignKey: "threadId" });
Reply.belongsTo(Thread, { foreignKey: "threadId" });

UserModel.hasMany(Reply, { foreignKey: "authorId", as: "authoredReplies" });
Reply.belongsTo(UserModel, { foreignKey: "authorId", as: "author" });

// Self-referential association for nested replies
Reply.hasMany(Reply, { foreignKey: "parentReplyId", as: "childReplies" });
Reply.belongsTo(Reply, { foreignKey: "parentReplyId", as: "parentReply" });

// Reply Like Associations
UserModel.hasMany(ReplyLike, { foreignKey: "userId" });
ReplyLike.belongsTo(UserModel, { foreignKey: "userId" });

Reply.hasMany(ReplyLike, { foreignKey: "replyId" });
ReplyLike.belongsTo(Reply, { foreignKey: "replyId" });


export {
  UserModel,
  StudyGroup,
  Membership,
  Syllabus,
  Topic,
  SubTopic,
  AdditionalResource,
  ResourceLike,
  OTP,
  RefreshToken,
  Forum,
  Thread,
  Reply,
  ReplyLike
};
