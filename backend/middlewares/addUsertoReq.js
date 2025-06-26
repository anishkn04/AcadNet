import UserModel from "../models/user.model.js";

const addUser = async (req, res, next) => {

  const id = req.id;
  const user = await UserModel.findByPk(id);

  req.user = user;
  next();
};

export default addUser;
