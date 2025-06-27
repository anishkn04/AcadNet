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
  email:string,
  fullName:String,
  isBanned:boolean
  isVerified:boolean
  lastOtp:string
  password:string,
  role:string,
  updatedAt:string,
  username:string
}
