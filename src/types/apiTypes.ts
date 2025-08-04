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


