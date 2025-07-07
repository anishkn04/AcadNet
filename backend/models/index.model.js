import UserModel from "./user.model.js";
import StudyGroup from "./studyGroup.model.js";
import Membership from "./membership.model.js";
import Syllabus from "./syallabus.model.js";
import Topic from "./topics.model.js";
import SubTopic from "./subtopics.model.js";
import AdditionalResource from "./additionalResources.model.js";
import OTP from "./otp.model.js";
import RefreshToken from "./refresh.sequelize.model.js";


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


export {
  UserModel,
  StudyGroup,
  Membership,
  Syllabus,
  Topic,
  SubTopic,
  AdditionalResource,
  OTP,
  RefreshToken
};
