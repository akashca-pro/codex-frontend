import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type User } from "@/store/slices/authSlice";
import type { ApiSuccess } from "@/types/apiTypes";

const preUrl = '/admin/auth/'

const adminAuthApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        adminLogin : builder.mutation({
            query : (credentials) => ({
                url : `${preUrl}login`,
                method : 'POST',
                body : credentials
            }),
            invalidatesTags : ['admin']
        }),
        adminLogout : builder.mutation<ApiSuccess<null>,void>({
            query : () => ({
                url : `${preUrl}logout`,
                method : 'DELETE',
            }),
            invalidatesTags : ['admin']
        }),
        adminCheckAuth : builder.query<ApiSuccess<User>,void>({
            query : () => `${preUrl}check-auth`
        }),
        adminRefreshToken : builder.mutation({
            query : () => ({
                url : `${preUrl}refreshToken`,
                method : 'POST',
            }),
            invalidatesTags : ['admin']
        }),
     })
})

export const { 

    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminCheckAuthQuery,
    useAdminRefreshTokenMutation

} = adminAuthApiSlice

export type AdminCheckAuthType = ReturnType<typeof useAdminCheckAuthQuery>