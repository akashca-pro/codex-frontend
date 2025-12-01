import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { AdminDashboardResponse } from "@/types/dashboard-api-types/responses/admin";

const preUrl = 'admin/dashboard';

const adminDashboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminDashboard : builder.query<ApiSuccess<AdminDashboardResponse>,void>({
            query : () => ({
                url : `${preUrl}/`,
                method : 'GET',
            }),
            providesTags : ['admin']
        })
    })
})

export const {

    useAdminDashboardQuery

} = adminDashboardApiSlice