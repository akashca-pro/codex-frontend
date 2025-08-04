import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type User } from "@/store/slices/authSlice";
import { type ApiSuccess } from "@/types/apiTypes";

const preUrl = '/user/auth/'

const userAuthApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        userSignup : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}signup`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userLogin : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}login`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userResendOtp : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}otp/resend-otp`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userVerifyOtp : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}otp/verify-otp`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userGoogleLogin : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}login/google-login`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userForgotPassword : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}password/forgot/request`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userPasswordChange : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}password/change`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['user']
        }),
        userLogout : builder.mutation<ApiSuccess<void>,void>({
            query : () => ({
                url : `${preUrl}logout`,
                method : 'DELETE',
            }),
            invalidatesTags : ['user']
        }),
    })
})

export const {

    useUserSignupMutation,
    useUserResendOtpMutation,
    useUserVerifyOtpMutation,
    useUserLoginMutation,
    useUserGoogleLoginMutation,
    useUserForgotPasswordMutation,
    useUserPasswordChangeMutation,
    useUserLogoutMutation,
    

} = userAuthApiSlice