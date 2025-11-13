import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess, UserProfileResponse } from "@/types/apiTypes";
import type { ChangePasswordSchema, EmailRequest, PasswordRequest, UpdateEmailRequest, VerifyEmailRequest } from "@/types/profile/user/payload";

const preUrl = `/admin/profile`

const adminProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminProfile : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => ({
                url : `${preUrl}/`,
                method : 'GET'
            }),
            providesTags : ['admin']
        }),

        adminUpdateProfile : builder.mutation({
            query : (updatingData) => ({
                url : `${preUrl}/update`,
                method : 'PATCH',
                body : updatingData
            }),
            invalidatesTags : ['admin']
        }),

        adminUpdateEmail : builder.mutation<ApiSuccess<null>,UpdateEmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        adminVerifyEmail : builder.mutation<ApiSuccess<null>,VerifyEmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change/verify`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        adminChangeEmailresendOtp : builder.mutation<ApiSuccess<null>,EmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change/resend-otp`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        adminChangePassword : builder.mutation<ApiSuccess<null>,ChangePasswordSchema>({
            query : (payload) => ({
                url : `${preUrl}/password/change`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        adminDeleteAccount : builder.mutation<ApiSuccess<null>,PasswordRequest>({
            query : (payload) => ({
                url : `${preUrl}/delete`,
                method : 'PATCH',
                body : payload
            }),
            invalidatesTags : ['user']
        })
    })
})

export const {

    useAdminProfileQuery,
    useAdminUpdateProfileMutation,
    useAdminChangeEmailresendOtpMutation,
    useAdminUpdateEmailMutation,
    useAdminVerifyEmailMutation,
    useAdminChangePasswordMutation,
    useAdminDeleteAccountMutation,

} = adminProfileApi