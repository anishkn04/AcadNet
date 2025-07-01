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
  SubTopic
 } from './models/index.model.js';

const PORT = process.env.BACKEND_PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models in dependency order
    await CountryModel.sync({ alter: true });
    await LevelModel.sync({ alter: true });
    await FieldOfStudyModel.sync({ alter: true });
    await UniversityModel.sync({ alter: true });
    await CollegeModel.sync({ alter: true });
    await AddressModel.sync({ alter: true });
    await AcademicModel.sync({ alter: true });
    await UserModel.sync({ alter: true });
    await StudyGroup.sync({ alter: true });
    await Membership.sync({ alter: true });
    await Syllabus.sync({ alter: true });
    await Topic.sync({ alter: true });
    await SubTopic.sync({ alter: true });

    console.log('✅ Models synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at PORT ${PORT}`);
    });
  } catch (err) {
    console.error(`❌ Database connection error:`, err);
  }
};

startServer();
