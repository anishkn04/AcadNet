// SysAdmin Types
export interface SysAdminStats {
  totalUsers: number;
  totalResources: number;
  totalActiveGroups: number;
}

export interface SysAdminUser {
  user_id: string;
  username: string;
  email: string;
}

export interface SysAdminGroup {
  groupId: string;
  groupName: string;
  groupOwner: {
    username: string;
    email: string;
  } | null;
}

export interface SysAdminGroupSearchResult {
  id: string;
  name: string;
  creatorId: string;
}

export interface SearchResult<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
