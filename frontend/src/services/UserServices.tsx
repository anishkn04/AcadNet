import apiClient from "@/lib/apiClient";
import type { CreateGroupInterface, Groups, UserProfileData } from "@/models/User";

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
        // Handle both direct array and message-wrapped responses
        const groupsData = response.data.message || response.data;
        
        // Map backend response to frontend expected structure
        const mappedGroups = Array.isArray(groupsData) ? groupsData.map((group: any) => ({
            ...group,
            // Map backend Memberships to frontend members
            members: (group.Memberships || group.memberships || []).map((membership: any) => ({
                id: membership.id,
                userId: membership.userId || membership.user_id,
                studyGroupId: membership.studyGroupId || membership.study_group_id,
                isAnonymous: membership.isAnonymous || false,
                created_at: membership.created_at,
                updated_at: membership.updated_at,
                UserModel: membership.UserModel ? {
                    user_id: membership.UserModel.user_id,
                    username: membership.UserModel.username,
                    fullName: membership.UserModel.fullName
                } : undefined
            })),
            // Map backend AdditionalResources to frontend AdditionalResources (if needed)
            AdditionalResources: group.AdditionalResources || group.additionalResources || [],
            // Map backend UserModel to frontend creator info
            creator: group.UserModel ? {
                user_id: group.creatorId,
                username: group.UserModel.username
            } : undefined,
            // Map backend Syllabus to frontend syllabus
            syllabus: group.Syllabus ? {
                id: group.Syllabus.id,
                topics: group.Syllabus.Topics || group.Syllabus.topics || []
            } : { topics: [] }
        })) : [groupsData];
        
        return {data: mappedGroups, status:response.status};
    }catch(error){
        throw error
    }
}

export const fetchOverviewAPI = async (groupCode:string | number)=>{
    try{
        const response = await apiClient.get<any>(`/group/overview/${groupCode}`)
        // Extract data from the nested message structure
        const backendData = response.data.message || response.data;
        return {data:backendData,status:response.status};
    }catch(error){
        throw error
    }
}

export const fetchGroupDetailsByIdAPI = async (groupCode: string | number) => {
    try {
        const response = await apiClient.get<any>(`/group/details/${groupCode}`);
        
        // Extract data from the nested message structure
        const backendData = response.data.message || response.data;
        
        // Map backend response to frontend expected structure
        const mappedData: Groups = {
            ...backendData,
            // Map additionalResources to AdditionalResources (capitalize first letter)
            AdditionalResources: backendData.additionalResources || [],
            // Map memberships to members
            members: (backendData.memberships || []).map((membership: any) => ({
                id: membership.id,
                userId: membership.userId || membership.user_id,
                studyGroupId: membership.studyGroupId || membership.study_group_id,
                isAnonymous: membership.isAnonymous || false,
                created_at: membership.created_at,
                updated_at: membership.updated_at,
                UserModel: membership.UserModel ? {
                    user_id: membership.UserModel.user_id,
                    username: membership.UserModel.username,
                    fullName: membership.UserModel.fullName
                } : undefined
            })),
            // Map userModel to creator
            creator: backendData.userModel ? {
                user_id: backendData.creatorId,
                username: backendData.userModel.username
            } : undefined,
        };
        
        return { data: mappedData, status: response.status };
    } catch (error) {
        throw error;
    }
}

export const joinGroupAPI = async (groupCode: string) => {
    try {
        const response = await apiClient.post(`/group/join/${groupCode}`);
        return { data: response.data, status: response.status };
    } catch (error) {
        throw error;
    }
}

// Like/Dislike Resource APIs
export const likeResourceAPI = async (resourceId: number) => {
    try {
        const response = await apiClient.post(`/group/resource/${resourceId}/like`);
        return { data: response.data, status: response.status };
    } catch (error) {
        throw error;
    }
}

export const dislikeResourceAPI = async (resourceId: number) => {
    try {
        const response = await apiClient.post(`/group/resource/${resourceId}/dislike`);
        return { data: response.data, status: response.status };
    } catch (error) {
        throw error;
    }
}

export const getResourceStatusAPI = async (resourceId: number) => {
    try {
        const response = await apiClient.get(`/group/resource/${resourceId}/status`);
        return { data: response.data, status: response.status };
    } catch (error) {
        throw error;
    }
}