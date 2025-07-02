import app from "./app.js";
import sequelize from './config/database.js';
import { 
  CountryModel,
  LevelModel,
  FieldOfStudyModel,
  UniversityModel,
  CollegeModel,
  AddressModel,
  AcademicModel,
  UserModel,
  StudyGroup,
  Membership,
  Syllabus,
  Topic,
  SubTopic,
  AdditionalResource
 } from './models/index.model.js';

const PORT = process.env.BACKEND_PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models in dependency order
    await CountryModel.sync({ force: true });
    await LevelModel.sync({ force: true });
    await FieldOfStudyModel.sync({ force: true });
    await UniversityModel.sync({ force: true });
    await CollegeModel.sync({ force: true });
    await AddressModel.sync({ force: true });
    await AcademicModel.sync({ force: true });
    await UserModel.sync({ force: true });
    await StudyGroup.sync({ force: true });
    await Membership.sync({ force: true });
    await Syllabus.sync({ force: true });
    await Topic.sync({ force: true });
    await SubTopic.sync({ force: true });
    await AdditionalResource.sync({ force: true });

    console.log('✅ Models synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at PORT ${PORT}`);
    });
  } catch (err) {
    console.error(`❌ Database connection error:`, err);
  }
};

startServer();
