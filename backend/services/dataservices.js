import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import AcademicModel from "../models/academic.model.js";
import LevelModel from "../models/level.model.js";
import FieldOfStudyModel from "../models/fieldOfStudy.model.js";
import UniversityModel from "../models/university.model.js";
import CollegeModel from "../models/college.model.js";
import CountryModel from "../models/country.model.js";
import throwWithCode from "../utils/errorthrow.js";



export const userData = async (id) => {
  try {
    if (!id || typeof id != "string") {
      throwWithCode("Error Fetching Id", 200);
    }
    const user = await UserModel.findByPk(id, {
      include: [
        { model: AddressModel },
        {
          model: AcademicModel,
          include: [
            { model: LevelModel },
            { model: FieldOfStudyModel },
            {
              model: UniversityModel,
              include: [{ model: CountryModel }],
            },
            {
              model: CollegeModel,
              include: [
                {
                  model: UniversityModel,
                  include: [{ model: CountryModel }],
                },
                { model: CountryModel },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      throwWithCode("Eror Fetching User", 404);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const id = parseInt(userId, 10);

    if (isNaN(id)) {
      const error = new Error("Invalid user ID format");
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findByPk(id, {
      attributes: [
        "user_id",
        "username",
        "created_at",
        "email",
        "fullName",
        "role",
        "age",
        "phone",
        "nationality",
        "address",
        "education",
      ],
    });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  } catch (err) {
    throw err;
  }
};

export const userEdit = async (updates, id) => {
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      throwWithCode("User not found", 404);
    }

    const { address, education, ...userProfileUpdates } = updates;

    await user.update(userProfileUpdates);

    if (address) {
      console.log("DEBUG: address received in backend:", address);
      const [userAddress, created] = await AddressModel.findOrCreate({
        where: { user_id: user.user_id },
        defaults: address,
      });
      if (!created) {
        await userAddress.update({
          province: address.province,
          district: address.district,
          municipality: address.municipality,
          postal_code: address.postal_code,
        });
      }
      await user.setAddress(userAddress);
    }

    if (education) {
      const { level, FOS, university, college } = education;

      const [levelRecord] = await LevelModel.findOrCreate({ where: { level_name: level } });
      const [fieldOfStudyRecord] = await FieldOfStudyModel.findOrCreate({ where: { field_of_study_name: FOS } });
      const [universityRecord] = await UniversityModel.findOrCreate({ where: { university_name: university } });
      const [collegeRecord] = await CollegeModel.findOrCreate({ 
        where: { college_name: college },
        defaults: { university_id: universityRecord.university_id }
      });

      const academicDetails = {
        level_id: levelRecord.level_id,
        field_of_study_id: fieldOfStudyRecord.field_of_study_id,
        university_id: universityRecord.university_id,
        college_id: collegeRecord.college_id,
      };

      const [userAcademic] = await AcademicModel.findOrCreate({
        where: { user_id: user.user_id },
      });
      await userAcademic.update(academicDetails);
      await user.setAcademic(userAcademic);
    }

    await user.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
