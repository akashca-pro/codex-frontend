import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess, type UserProfileResponse } from "@/types/apiTypes";

const preUrl = '/user/profile/'

const userDashboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        userDashboard : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => `${preUrl}`,
            providesTags : ['user']
        })
    })
})


export const { 

    useUserDashboardQuery

 } = userDashboardApiSlice
