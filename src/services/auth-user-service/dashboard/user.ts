import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess, type UserProfileResponse } from "@/types/apiTypes";

const preUrl = '/user/dashboard/'

const userDashboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        userDashboard : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => `${preUrl}profile`,
            providesTags : ['user']
        })
    })
})


export const { 

    useUserDashboardQuery

 } = userDashboardApiSlice
