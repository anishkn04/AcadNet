import type {  CreateGroupInterface, Groups, UserProfileData } from "@/models/User";
import { createGroupAPI, editUserAPI, fetchGroupAPI, fetchUserAPI, joinGroupAPI, leaveGroupAPI, removeGroupMemberAPI, promoteGroupMemberAPI, demoteGroupMemberAPI, fetchGroupDetailsByIdDirectAPI, fetchGroupDetailsByIdAPI } from "@/services/UserServices";
import React, { createContext, useEffect, type ReactNode,useState } from "react";
import { useAuth } from "./userContext";

type UserInfoType ={
    getInfo: () => Promise<UserProfileData | null>;
    updateProfile: (updates:UserProfileData) => Promise<void>
    createGroup: (createGroupData:CreateGroupInterface) => Promise<boolean>
    retreiveGroups: () => Promise<Groups[] |undefined>
    retreiveGroupById: (groupId: string | number) => Promise<Groups | undefined>
    retreiveGroupByCode: (groupCode: string | number) => Promise<Groups | undefined>
    joinGroup: (groupCode: string, isAnonymous?: boolean) => Promise<{ success: boolean, message: string }>
    leaveGroup: (groupCode: string) => Promise<{ success: boolean, message: string }>
    removeGroupMember: (groupCode: string, userId: number) => Promise<{ success: boolean, message: string }>
    promoteGroupMember: (groupCode: string, userId: number) => Promise<{ success: boolean, message: string }>
    demoteGroupMember: (groupCode: string, userId: number) => Promise<{ success: boolean, message: string }>
    user : string,
    userId:Number | undefined,
    userProfile: UserProfileData | null,
}

type Props = {children:ReactNode}

const UserInfoContext = createContext<UserInfoType>({} as UserInfoType)


export const UserInfoProvider = ({children}:Props) =>{
    const [user,setUser] = useState<string>("")
    const[userId,setUserId] = useState<Number>()
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
    const {isAuthenticated} = useAuth()
    //fetch the user info
    const getInfo = async():Promise<UserProfileData | null> =>{
        try{
            const {data :ApiResponse ,status,} = await fetchUserAPI();
            if( status !== 200 ){
                console.log('failed to fetch data from the backend')
            }
            return ApiResponse.message
        }catch(error){
            console.log(error)
        }
        return null
    }
    //update userInfo
    const updateProfile = async (update:UserProfileData):Promise<void> =>{
        try{
            const {status}= await editUserAPI(update);
            if(status === 200){
                console.log('success')
            }else{
                console.log('failed',status)
            }
        }catch(error){
            console.log('failed',error)
        }     
    }
    useEffect(()=>{
        const fetchUsername = async() =>{
            const data = await getInfo();
            setUser(data?.username ?? '')
            setUserId(data?.user_id ?? 0)
            setUserProfile(data)
        }
        if(isAuthenticated){
            fetchUsername()
        }

    },[isAuthenticated])
  
    //groups
    const createGroup = async(createGroupData:CreateGroupInterface):Promise<boolean>=>{
        try{
            const {success,status} = await createGroupAPI(createGroupData)
            if(status === 201 && success === true){
                return true
            }else if(status === 400 && success === false){
                return false
            }
        }catch(e){
          console.log('error',e)
        }
        return false
    }
    const retreiveGroups = async ():Promise<Groups[] | undefined> =>{
        const {data,status} = await fetchGroupAPI();
        if (status === 200) {
            // Handle both direct array and message-wrapped responses
            const groupsData = data;
            return Array.isArray(groupsData) ? groupsData : [groupsData];
        } else {
            console.log('groupList error');
            return 
        }
    }
    
    const retreiveGroupById = async (groupId: string | number): Promise<Groups | undefined> => {
        try {
            const {data, status} = await fetchGroupDetailsByIdDirectAPI(groupId);
            if (status === 200) {
                return data;
            } else {
                console.log('group details by id error');
                return undefined;
            }
        } catch (error) {
            console.error('Error fetching group by id:', error);
            return undefined;
        }
    }
    
    const retreiveGroupByCode = async (groupCode: string | number): Promise<Groups | undefined> => {
        try {
            const {data, status} = await fetchGroupDetailsByIdAPI(groupCode);
            if (status === 200) {
                return data;
            } else {
                console.log('group details by code error');
                return undefined;
            }
        } catch (error) {
            console.error('Error fetching group by code:', error);
            return undefined;
        }
    }
    
    const joinGroup = async (groupCode: string, isAnonymous: boolean = false): Promise<{ success: boolean, message: string }> => {
        try {
            const { data, status } = await joinGroupAPI(groupCode, isAnonymous);
            if (status === 200) {
                return { success: true, message: data.message || 'Successfully joined the group!' };
            } else {
                return { success: false, message: data.message || 'Failed to join group' };
            }
        } catch (error: any) {
            console.error('Join group error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while joining the group' 
            };
        }
    }

    const leaveGroup = async (groupCode: string): Promise<{ success: boolean, message: string }> => {
        try {
            const { data, status } = await leaveGroupAPI(groupCode);
            if (status === 200) {
                return { success: true, message: data.message || 'Successfully left the group!' };
            } else {
                return { success: false, message: data.message || 'Failed to leave group' };
            }
        } catch (error: any) {
            console.error('Leave group error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while leaving the group' 
            };
        }
    }

    const removeGroupMember = async (groupCode: string, userId: number): Promise<{ success: boolean, message: string }> => {
        try {
            const { data, status } = await removeGroupMemberAPI(groupCode, userId);
            if (status === 200) {
                return { success: true, message: data.message || 'Member removed successfully!' };
            } else {
                return { success: false, message: data.message || 'Failed to remove member' };
            }
        } catch (error: any) {
            console.error('Remove member error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while removing the member' 
            };
        }
    }

    const promoteGroupMember = async (groupCode: string, userId: number): Promise<{ success: boolean, message: string }> => {
        try {
            const { data, status } = await promoteGroupMemberAPI(groupCode, userId);
            if (status === 200) {
                return { success: true, message: data.message || 'Member promoted successfully!' };
            } else {
                return { success: false, message: data.message || 'Failed to promote member' };
            }
        } catch (error: any) {
            console.error('Promote member error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while promoting the member' 
            };
        }
    }

    const demoteGroupMember = async (groupCode: string, userId: number): Promise<{ success: boolean, message: string }> => {
        try {
            const { data, status } = await demoteGroupMemberAPI(groupCode, userId);
            if (status === 200) {
                return { success: true, message: data.message || 'Member demoted successfully!' };
            } else {
                return { success: false, message: data.message || 'Failed to demote member' };
            }
        } catch (error: any) {
            console.error('Demote member error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while demoting the member' 
            };
        }
    }


    return (
        <UserInfoContext.Provider value = {{getInfo,updateProfile,createGroup,retreiveGroups,joinGroup,leaveGroup,user,userId,removeGroupMember,promoteGroupMember,demoteGroupMember,retreiveGroupById,retreiveGroupByCode,userProfile}}>
            {children}
        </UserInfoContext.Provider>
    )
}
export const useData = () => React.useContext(UserInfoContext)