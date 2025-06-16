
export type UserProfile = {
    userName: string,
    email: string
}

export type AuthResponse = {
  user: UserProfile;
}
export type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};
export type OtpFormInput ={
  otp:string
}