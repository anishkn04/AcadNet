import UserModel from "../models/user.model.js";
import throwWithCode from "../utils/errorthrow.js";

export const userData = async (id) => {
  try {
    if (!id || typeof id != "string") {
      throwWithCode("Error Fetching Id", 200);
    }
    const user = await UserModel.findByPk(id)

    if (!user) {
      throwWithCode("Eror Fetching User", 200)
    }
    return user
  } catch (err) {
    throw err;
  }
};

export const userEdit = async (updates, id) => {
  try {
    const user = await UserModel.findByPk(id)

    await user.save()
    console.log(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}