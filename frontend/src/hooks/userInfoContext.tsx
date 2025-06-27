import type { UserProfileData } from "@/models/User";
import { fetchUserAPI } from "@/services/UserServices";
import React, { createContext, type ReactNode } from "react";

type UserInfoType ={
    getInfo: () => Promise<UserProfileData | null>
}

type Props = {children:ReactNode}

const UserInfoContext = createContext<UserInfoType>({} as UserInfoType)


export const UserInfoProvider = ({children}:Props) =>{


    const getInfo = async():Promise<UserProfileData | null> =>{
        try{
            const {data,status,} = await fetchUserAPI();
            if( status !== 200 ){
                console.log('failed to fetch data from the backend')
            }
            return data
        }catch(error){
            console.log(error)
        }
        return null
    }

    return (
        <UserInfoContext.Provider value = {{getInfo}}>
            {children}
        </UserInfoContext.Provider>
    )
}
export const useData = () => React.useContext(UserInfoContext)