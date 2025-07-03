import UserModel from "./user.model.js";
import StudyGroup from "./studyGroup.model.js";
import Membership from "./membership.model.js";
import Syllabus from "./syallabus.model.js";
import Topic from "./topics.model.js";
import SubTopic from "./subtopics.model.js";
import AddressModel from "./address.model.js";
import AcademicModel from "./academic.model.js";
import CollegeModel from "./college.model.js";
import CountryModel from "./country.model.js";
import FieldOfStudyModel from "./fieldOfStudy.model.js";
import LevelModel from "./level.model.js";
import UniversityModel from "./university.model.js";
import AdditionalResource from "./additionalResources.model.js";
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

// User-Address
UserModel.hasOne(AddressModel, { foreignKey: "address_id" });
AddressModel.belongsTo(UserModel, { foreignKey: "user_id" });

// User-Academic
UserModel.hasOne(AcademicModel, { foreignKey: "academic_id" });
AcademicModel.belongsTo(UserModel, { foreignKey: "user_id" });

// Academic Details
AcademicModel.belongsTo(LevelModel, { foreignKey: "level_id" });
LevelModel.hasMany(AcademicModel, { foreignKey: "level_id" });

AcademicModel.belongsTo(FieldOfStudyModel, { foreignKey: "field_of_study_id" });
FieldOfStudyModel.hasMany(AcademicModel, { foreignKey: "field_of_study_id" });

AcademicModel.belongsTo(UniversityModel, { foreignKey: "university_id" });
UniversityModel.hasMany(AcademicModel, { foreignKey: "university_id" });

AcademicModel.belongsTo(CollegeModel, { foreignKey: "college_id" });
CollegeModel.hasMany(AcademicModel, { foreignKey: "college_id" });

// University-College
UniversityModel.hasMany(CollegeModel, { foreignKey: "university_id" });
CollegeModel.belongsTo(UniversityModel, { foreignKey: "university_id" });

// Country associations
CountryModel.hasMany(UniversityModel, { foreignKey: "country_id" });
UniversityModel.belongsTo(CountryModel, { foreignKey: "country_id" });

CountryModel.hasMany(CollegeModel, { foreignKey: "country_id" });
CollegeModel.belongsTo(CountryModel, { foreignKey: "country_id" });
StudyGroup.hasMany(AdditionalResource, { foreignKey: "studyGroupId" });
AdditionalResource.belongsTo(StudyGroup, { foreignKey: "studyGroupId" });


export {
  UserModel,
  StudyGroup,
  Membership,
  Syllabus,
  Topic,
  SubTopic,
  AddressModel,
  AcademicModel,
  LevelModel,
  FieldOfStudyModel,
  UniversityModel,
  CollegeModel,
  CountryModel,
  RefreshToken,
  AdditionalResource
};
