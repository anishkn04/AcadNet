import User from "../models/user.model.js";
import throwWithCode from "../utils/errorthrow.js";

export const userData = async (id) => {
  try {
    if (!id || typeof id != "string") {
      throwWithCode("Error Fetching Id", 200);
    }
    const user = await User.findOne({_id: id})
    
    if(!user){
        throwWithCode("Eror Fetching User",200)
    }
    return user
} catch (err) {
    throw err;
  }
};
