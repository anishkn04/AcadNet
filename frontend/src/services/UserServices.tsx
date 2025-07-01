import apiClient from "@/lib/apiClient";
import type { UserProfileData } from "@/models/User";

export const fetchUserAPI = async ()=>{
    try{
        const response = await apiClient.get<any>('/data/user');
        return {data:response.data, status:response.status}
    }catch(error){
        throw error
    }
}

export const editUserAPI = async (userData:UserProfileData)=>{
    try{
        const response = await apiClient.post<any>('/data/editprofile',userData);
        return {data:response.data, status: response.status}
    }catch(error){
        throw error;
    }

}