import { userData } from "../services/dataservices.js"
import jsonRes from "../utils/response.js"


export const userInfo =  async (req,res) => {
    try{
    const id = req.id
    const data = userData(id)
    jsonRes(res,200,true,"Data Found")
    }catch(err){
        console.log(err.message)
        jsonRes(res,err.code,false,err.message)
    }
}