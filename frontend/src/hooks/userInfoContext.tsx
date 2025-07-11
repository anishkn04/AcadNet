import type {  CreateGroupInterface, Groups, UserProfileData } from "@/models/User";
import { createGroupAPI, editUserAPI, fetchGroupAPI, fetchUserAPI } from "@/services/UserServices";
import React, { createContext, useEffect, type ReactNode,useState } from "react";
import { useAuth } from "./userContext";
import { isAxiosError } from "axios";

type UserInfoType ={
    getInfo: () => Promise<UserProfileData | null>;
    updateProfile: (updates:UserProfileData) => Promise<void>
    createGroup: (createGroupData:CreateGroupInterface) => Promise<boolean>
    retreiveGroups: () => Promise<Groups |undefined>
    user : string,
    userId:Number | undefined,
}

type Props = {children:ReactNode}

const UserInfoContext = createContext<UserInfoType>({} as UserInfoType)


export const UserInfoProvider = ({children}:Props) =>{
    const [user,setUser] = useState<string>("")
    const[userId,setUserId] = useState<Number>()
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
                console.log('here')
                return true
            }else if(status === 400 && success === false){
                return false
            }
        }catch(e){
          console.log('error',e)
        }
        return false
    }
    const retreiveGroups = async ():Promise<Groups | undefined> =>{
        const {data,status} = await fetchGroupAPI();
        if (status === 200) {
            return (data.message);
        } else {
            console.log('groupList error');
            return 
        }
    }
    // Fetch group details by groupCode


    return (
        <UserInfoContext.Provider value = {{getInfo,updateProfile,createGroup,retreiveGroups,user,userId}}>
            {children}
        </UserInfoContext.Provider>
    )
}
export const useData = () => React.useContext(UserInfoContext)