import UserModel from "../models/user.model.js";
import throwWithCode from "../utils/errorthrow.js";

export const userData = async (id) => {
  try {
    if (!id || typeof id != "string") {
      throwWithCode("Error Fetching Id", 200);
    }
    const user = await UserModel.findByPk(id)

    if (!user) {
      throwWithCode("Eror Fetching User", 404)
    }
    return user
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
      attributes: ["user_id", "username", "created_at", "email", "fullName", "role", "age", "phone", "nationality", "address", "education"]
    })
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  } catch (err) {
    throw err;
  }
}

export const userEdit = async (updates, id) => {
  try {
    console.log("\n\n\n\n\nNew changes: ", updates, "\n\n\n\n\n\n")
    const user = await UserModel.findByPk(id)
    const dataFromFrontend = updates.userData
    console.log("userData is: ", dataFromFrontend)
    for (var key in dataFromFrontend){
      console.log("In the loop", key, dataFromFrontend[key])
      if(updates[key] != undefined){
        user.setDataValue(key, dataFromFrontend[key]);
      }
      console.log("After the changes: ", user)
    }
    await user.save()
    // console.log(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}