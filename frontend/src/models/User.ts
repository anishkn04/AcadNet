// User.ts - CORRECTED INTERFACES

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
  subTopics:subTopics[]; // Property name should be 'SubTopics' (capital S, capital T)
}
// export interface Topics{ 
//   id:string
//   title:string,
//   description?:string,
//   SubTopics:subTopics[]; // Property name should be 'SubTopics' (capital S, capital T)
// }
export interface Resource {
  id?: number;
  filePath: string;
  fileType?: string;
  file?: File;
  linkedTo?: {
    topicId: number | null;
    subTopicId: number | null;
  };
  likesCount?: number;
  dislikesCount?: number;
  userReaction?: 'like' | 'dislike' | null;
}

// *** CRITICAL CHANGE HERE: ALIGN CREATEGROUPINTERFACE WITH GROUPS FOR SYLLABUS STRUCTURE ***
export interface CreateGroupInterface{
  name:string,
  isPrivate?:boolean,
  description?:string,
  syllabus:{ // Changed to 'Syllabus' (capital S)
    topics:topics[] // Changed to 'Topics' (capital T)
  },
  additionalResources:Resource[], // This was already 'AdditionalResources' in CreateGroupInterface, but 'additionalResources' in Groups. Let's make them consistent.
}


export interface Groups{
  id: number;
  name:string,
  description:string,
  creatorId: number;
  isPrivate:boolean,
  createdAt: string;
  updatedAt: string;
  groupCode: string;
  creator?: {
    user_id: number;
    username: string;
  };
  syllabus:{ // Capital S
    id?: string;
    topics:topics[] // Capital T
  },
  AdditionalResources:Resource[], // Assuming backend returns lowercase 'a'
  members:member[],
  UserModel?:{
    username:string,
    fullName:string,
  }
}

export interface fetchGroupInterface{
  data:Groups[],
}
export interface member{
  id:number,
  userId:number,
  studyGroupId:string,
  isAnonymous:boolean,
  created_at?: string,
  updated_at?: string,
  UserModel?: {
    user_id: number,
    username: string,
    fullName: string
  }
}

// Forum interfaces
export interface ForumUser {
  user_id: number;
  username: string;
  fullName: string;
}

export interface Reply {
  id: number;
  threadId: number;
  authorId: number;
  content: string;
  parentReplyId?: number;
  isEdited: boolean;
  editedAt?: string;
  likeCount: number;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  author: ForumUser;
  childReplies?: Reply[];
}

export interface Thread {
  id: number;
  forumId: number;
  authorId: number;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: string;
  lastReplyBy?: number;
  created_at: string;
  updated_at: string;
  author: ForumUser;
  lastReplier?: ForumUser;
  replies?: Reply[];
}

export interface Forum {
  id: number;
  studyGroupId: string;
  name: string;
  description?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  threads?: Thread[];
}

export interface GroupForum {
  groupCode: string;
  groupName: string;
  forum: Forum;
}