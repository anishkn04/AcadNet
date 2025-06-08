import axios from "axios"
import { handleError } from "@/helper/ErrorHandler";
import type { UserProfileToken } from "@/models/User";


const api = "http://localhost:5000/api";
export const loginAPI = async (email:string,password:string)=>{
    try{
        const data  = await axios.post<UserProfileToken>(api+'/login',{
            email:email,
            password:password
        })
        return data
    }catch(error){
        handleError(error)
    }
}
export const registerAPI = async (email:string,userName:string,password:string)=>{
    try{
        const data  = await axios.post<UserProfileToken>(api+'/signup',{
            email:email,
            userName:userName,
            password:password
        })
        return data
    }catch(error){
        handleError(error)
    }
}