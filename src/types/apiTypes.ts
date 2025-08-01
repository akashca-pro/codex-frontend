export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ProfileDetails {
  firstName: string;
  lastName: string;
  avatar: string;
  country: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmission: number;
  streak: number;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  email: string;
  profileDetails: ProfileDetails;
  createdAt: string;
  updatedAt: string;
}


