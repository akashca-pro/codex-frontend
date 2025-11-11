export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  country: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmission: number;
  streak: number;
  preferredLanguage : string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileResponse {

  username?: string;
  firstName?: string;
  lastName?: string | null;
  avatar? : string | null;
  email?: string;
  country?: string | null;
  password? : string,
  isVerified? : boolean;
  isArchived? : boolean;
  isBlocked? : boolean;
  preferredLanguage? : string | null;
  easySolved?: number | null;
  mediumSolved?: number | null;
  hardSolved?: number | null;
  totalSubmission?: number | null;
  streak?: number | null; 
  updatedAt? : Date;
}


