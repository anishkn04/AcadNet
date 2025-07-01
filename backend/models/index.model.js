import UserModel from "./user.model.js";
import StudyGroup from "./studyGroup.model.js";
import Membership from "./membership.model.js";
import Syllabus from "./syallabus.model.js";
import Topic from "./topics.model.js";
import SubTopic from "./subtopics.model.js";

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

export {
  UserModel,
  StudyGroup,
  Membership,
  Syllabus,
  Topic,
  SubTopic,
};
