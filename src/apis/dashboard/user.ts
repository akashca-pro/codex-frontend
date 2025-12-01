import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { UserDashboardRequest } from "@/types/dashboard-api-types/payload/user";
import type { UserDashboardResponse } from "@/types/dashboard-api-types/responses/user";

const preUrl = `user/dashboard`;

const userDashboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        userDashboard : builder.query<ApiSuccess<UserDashboardResponse>,UserDashboardRequest>({
            query : (params) => ({
                url : `${preUrl}/`,
                method : 'GET',
                params
            }),
            providesTags : ['user']
        })

    })
})

export const {

    useUserDashboardQuery

} = userDashboardApiSlice