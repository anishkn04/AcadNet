import apiClient from "@/lib/apiClient";
import type { CreateGroupInterface, fetchGroupInterface, UserProfileData } from "@/models/User";

//user Profile
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

//study Groups
export const createGroupAPI = async (createGroupData: CreateGroupInterface) => {
    try{
        const response = await apiClient.post<any,any>('/group/create',createGroupData);
        console.log('reached here')
        return {status:response.status, success:response.success}
    }catch(error){
        console.log('error')
        throw error
    }
}
export const fetchGroupAPI = async () => {
    try{
        const response = await apiClient.get<any>('/group/groups');
        return {data:response.data, status:response.status};
    }catch(error){
        throw error
    }
}