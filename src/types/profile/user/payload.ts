
export interface UpdateEmailRequest {
    newEmail : string;
    password : string;
}

export interface VerifyEmailRequest {
    email : string;
    otp : string;
}

export interface EmailRequest {
    email : string;
}

export interface ChangePasswordSchema{
    currPass : string;
    newPass : string;
}

export interface PasswordRequest {
    password : string;
}