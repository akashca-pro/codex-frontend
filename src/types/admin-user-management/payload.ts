export interface AdminListUsersRequest {
    page? : number;
    limit? : number;
    search? : string;
    sort? : string;
    isArchived? : boolean;
    isVerified? : boolean;
    isBlocked? : boolean;
    authProvider? : string;
}

export interface BlockUserRequest {
    userId : string;
    block : boolean;
}