interface users {
    userId : string;
    username : string;
    email : string;
    firstName : string;
    lastName : string;
    avatar : string;
    country : string;
    preferredLanguage : string;
    isArchived : boolean;
    easySolved : number;
    mediumSolved : number;
    hardSolved : number;
    totalSubmission : number;
    streak : number;
    createdAt : string;
    updatedAt : string;
    isVerified : boolean;
    authProvider : string;
    isBlocked : boolean;
}

export interface AdminListUsersResponse {
    currentPage : number;
    totalPage : number;
    totalItems : number;
    users : users[]
}