import { apiSlice } from "@/store/rtk-query/apiSlice";

const preUrl = '/admin/profile/'

const adminDashboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        adminDashboard : builder.query({
            query : () => `${preUrl}`,
            providesTags : ['admin']
        })
    })
})


export const { 

    useAdminDashboardQuery

 } = adminDashboardApiSlice
