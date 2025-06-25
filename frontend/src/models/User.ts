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
  full_name: string;
  gender: string;
  date_of_birth: string;
  bio: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    province: string;
    district: string;
    municipality: string;
    ward_no: number;
  };
  academic_details: {
    level: string;
    field_of_study: string;
    university: string;
    college: string;
  };
}
