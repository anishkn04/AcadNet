export type UserProfile = {
  userName: string;
  email: string;
};

export type AuthResponse = {
  user: UserProfile;
};
export type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};
export type OtpFormInput = {
  otp: string;
};
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}
export interface UserProfileData {
  user_id: number,
  username:string,
  created_at:Date,
  email:string,
  fullName:string | undefined,
  role:string,
  age:string | undefined,
  phone:string | undefined,
  nationality:string | undefined,
  address:{
    province:string | undefined,
    district:string | undefined,
    municipality:string | undefined,
    wordNo:string | undefined
  },
  education:{
    level:string | undefined,
    FOS:string | undefined,
    university:string | undefined,
    college:string | undefined
  }
}

//study groups
export interface subTopics{
  id:string
  title:string,
  content?:string
}
export interface topics{
  id:string
  title:string,
  description?:string,
  subTopics:subTopics[];
}
export interface Resource {
  filePath: string;
  file?: File;
  linkedTo?: {
    topic: number | null;
    subtopic: number | null;
  };
}
export interface CreateGroupInterface{
  name:string,
  isPrivate?:boolean,
  description?:string,
  syllabus:{
    topics:topics[]
  },
  additionalResources:Resource[],
}

export interface Groups{
  id: number;
  name:string,
  description:string,
  creatorId: number; 
  isPrivate:boolean,
  createdAt: string; 
  updatedAt: string; 
  creator?: {
    user_id: number;
    username: string;
  };
}
export interface fetchGroupInterface{
  data:Groups[],
}