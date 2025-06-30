import { userData, userEdit, getUserById as getUserByIdService } from "../services/dataservices.js";
import jsonRes from "../utils/response.js";

export const userInfo = async (req, res) => {
  try {
    const id = req.id;
    const data = await userData(id);
    console.log(data);
    jsonRes(res, 200, true, data);
  } catch (err) {
    console.log(err.message);
    jsonRes(res, err.code, false, err.message);
  }
};

export const getUserById = async(req, res, next) => {
  try{
    console.log(req)
    const {userId} = req.params;
    const user = await getUserByIdService(userId)
    res.status(200).json(user);
  }catch(err){
    next(err);
  }
}

export const userProfile = async (req, res) => {
  try {
    const updates = req.body
    const id = req.id
    await userEdit(updates, id)
    jsonRes(res,200,true,'successful')
  } catch (err) {
    jsonRes(res, err.code, false, err.message)
  }
}