import axios from "axios"
import { handleError } from "@/helper/ErrorHandler";
import type { UserProfileToken } from "@/models/User";


const api = "http://localhost:5000/api/";
export const loginAPI = async (username:string,password:string)=>{
    try{
        const data  = await axios.post<UserProfileToken>(api+'auth/login',{
            username:username,
            password:password
        })
        return data
    }catch(error){
        handleError(error)
    }
}
export const registerAPI = async (email:string,username:string,password:string)=>{
    try{
        const data  = await axios.post<UserProfileToken>(api+'account/login',{
            email:email,
            username:username,
            password:password
        })
        return data
    }catch(error){
        handleError(error)
    }
}