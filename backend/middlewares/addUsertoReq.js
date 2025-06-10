import User from "../models/user.model.js";


const addUser = async(req,res,next)=>{
        console.log("Reached ADD USER")
        console.log(req.id)
        const id = req.id
        const user = await User.findById(id);
        console.log(user)
        req.user = user;
        next()
}

export default addUser