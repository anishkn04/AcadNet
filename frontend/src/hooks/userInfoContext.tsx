import type {  UserProfileData } from "@/models/User";
import { editUserAPI, fetchUserAPI } from "@/services/UserServices";
import React, { createContext, useEffect, type ReactNode,useState } from "react";
import { useAuth } from "./userContext";

type UserInfoType ={
    getInfo: () => Promise<UserProfileData | null>;
    updateProfile: (updates:UserProfileData) => Promise<void>
    user : string
}

type Props = {children:ReactNode}

const UserInfoContext = createContext<UserInfoType>({} as UserInfoType)


export const UserInfoProvider = ({children}:Props) =>{
    const [user,setUser] = useState<string>("")
    const {isAuthenticated} = useAuth()

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
    },[isAuthenticated])
    return (
        <UserInfoContext.Provider value = {{getInfo,updateProfile,user}}>
            {children}
        </UserInfoContext.Provider>
    )
}
export const useData = () => React.useContext(UserInfoContext)