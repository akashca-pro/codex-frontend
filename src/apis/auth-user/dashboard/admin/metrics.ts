import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { AdminGrpcMetricResponse } from "@/types/dashboard-api-types/responses/admin";

const preUrl = '/admin/metrics'

const adminMetricsApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminGrpcMetrics : builder.query<ApiSuccess<AdminGrpcMetricResponse[]>,undefined>({
            query : ()=> ({
                url : `${preUrl}/grpcMetrics`,
                method : 'GET',
            }),
            providesTags : ['admin']
        }),
        adminHttpMetrics : builder.query({
            query : ()=> ({
                url : `${preUrl}/httpMetrics`,
                method : 'GET',
            }),
            providesTags : ['admin']
        })
    })
})


export const { 

    useAdminGrpcMetricsQuery,
    useAdminHttpMetricsQuery,

} = adminMetricsApiSlice
