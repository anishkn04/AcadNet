import type {  CreateGroupInterface, fetchGroupInterface, Groups, UserProfileData } from "@/models/User";
import { createGroupAPI, editUserAPI, fetchGroupAPI, fetchUserAPI } from "@/services/UserServices";
import React, { createContext, useEffect, type ReactNode,useState } from "react";
import { useAuth } from "./userContext";

type UserInfoType ={
    getInfo: () => Promise<UserProfileData | null>;
    updateProfile: (updates:UserProfileData) => Promise<void>
    createGroup: (createGroupData:CreateGroupInterface) => Promise<boolean>
    retreiveGroups: () => Promise<Groups |undefined>
    user : string
}

type Props = {children:ReactNode}

const UserInfoContext = createContext<UserInfoType>({} as UserInfoType)


export const UserInfoProvider = ({children}:Props) =>{
    const [user,setUser] = useState<string>("")
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
        }
        if(isAuthenticated){
            fetchUsername()
        }

    },[])
  
    //groups
    const createGroup = async(createGroupData:CreateGroupInterface):Promise<boolean>=>{
        try{
            const {success,status} = await createGroupAPI(createGroupData)
            if(status === 201 && success === true){
                return true
            }else if(status === 400 && success === false){
                return false
            }
        }catch{
          console.log('catch')
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
 

    return (
        <UserInfoContext.Provider value = {{getInfo,updateProfile,createGroup,retreiveGroups,user}}>
            {children}
        </UserInfoContext.Provider>
    )
}
export const useData = () => React.useContext(UserInfoContext)