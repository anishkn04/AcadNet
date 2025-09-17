import UserModel from "../models/user.model.js";
import throwWithCode from "../utils/errorthrow.js";

export const userData = async (id) => {
  try {
    if (!id || typeof id != "string") {
      throwWithCode("Error Fetching Id", 200);
    }
    const user = await UserModel.findByPk(id);

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
    const dataFromFrontend = updates
    for (var key in dataFromFrontend) {
      if (dataFromFrontend[key] != undefined) {
        user.setDataValue(key, dataFromFrontend[key]);
      }
    }
    await user.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
