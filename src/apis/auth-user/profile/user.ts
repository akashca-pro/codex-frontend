import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess, UpdateProfileResponse, UserProfileResponse } from "@/types/apiTypes";
import type { UpdateEmailRequest, EmailRequest, VerifyEmailRequest, ChangePasswordSchema, PasswordRequest } from "@/types/profile/user/payload";

const preUrl = `/user/profile`

const userProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        profile : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => ({
                url : `${preUrl}/`,
                method : 'GET'
            }),
            providesTags : ['user']
        }),

        updateProfile : builder.mutation<ApiSuccess<UpdateProfileResponse>,FormData>({
            query : (formData) => ({
                url : `${preUrl}/update`,
                method : 'PATCH',
                body : formData
            }),
            invalidatesTags : ['user']
        }),

        updateEmail : builder.mutation<ApiSuccess<null>,UpdateEmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        verifyEmail : builder.mutation<ApiSuccess<null>,VerifyEmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change/verify`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        changeEmailresendOtp : builder.mutation<ApiSuccess<null>,EmailRequest>({
            query : (payload) => ({
                url : `${preUrl}/email/change/resend-otp`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        changePassword : builder.mutation<ApiSuccess<null>,ChangePasswordSchema>({
            query : (payload) => ({
                url : `${preUrl}/password/change`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),

        deleteAccount : builder.mutation<ApiSuccess<null>,PasswordRequest>({
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

    useProfileQuery,
    useUpdateProfileMutation,
    useUpdateEmailMutation,
    useVerifyEmailMutation,
    useChangeEmailresendOtpMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation

} = userProfileApi