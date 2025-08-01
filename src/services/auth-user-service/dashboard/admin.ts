import { apiSlice } from "@/store/rtk-query/apiSlice";

const preUrl = '/admin/dashboard/'

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
