import apiClient from "@/lib/apiClient";
import type { CreateGroupInterface, UserProfileData } from "@/models/User";

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
    try {
        const formData = new FormData();
        formData.append('name', createGroupData.name);
        if (createGroupData.description)
            formData.append('description', createGroupData.description);
        if (typeof createGroupData.isPrivate !== 'undefined')
            formData.append('isPrivate', String(createGroupData.isPrivate));
        formData.append('syllabus', JSON.stringify({ topics: createGroupData.syllabus.topics }));
        if (Array.isArray(createGroupData.additionalResources)) {
            createGroupData.additionalResources.forEach((res) => {
                if (res.file && res.linkedTo) {
                    formData.append('additionalResources', res.file);
                    formData.append('additionalResources',JSON.stringify(res.linkedTo));
                }
            });
        }

        const response = await apiClient.post('/group/create', formData);
        return { status: response.status, success: response.data.success };
    } catch (error) {
        throw error;
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

export const fetchOverviewAPI = async (groupCode:string | number)=>{
    try{
        const response = await apiClient.get<any>(`/group/overview/${groupCode}`)
        return {data:response.data,status:response.status};
    }catch(error){
        throw error
    }
}

export const fetchGroupDetailsByIdAPI = async (groupCode: string | number) => {
    try {
        const response = await apiClient.get<any>(`/group/details/${groupCode}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        throw error;
    }
}