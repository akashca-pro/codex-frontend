import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess } from '@/types/apiTypes'
import type { ListProblemParams } from "@/types/problem-api-types/payload/public";
import type { ListProblemResponse, PublicProblemDetailsResponse } from "@/types/problem-api-types/responses/public";

const preUrl = '/public/problems';

const publicProblemApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        publicListProblems : builder.query<ApiSuccess<ListProblemResponse>,ListProblemParams>({
            query : (params) => ({
                url : `${preUrl}/`,
                method : 'GET',
                params
            }),
            providesTags : ['public']
        }),
        publicGetProblemDetails : builder.query<ApiSuccess<PublicProblemDetailsResponse>,string>({
            query : (problemId) => ({
                url : `${preUrl}/${problemId}`,
                method : 'GET',
            }),
            providesTags : ['public']
        })
    })
})

export const { 

    usePublicListProblemsQuery,
    usePublicGetProblemDetailsQuery

} = publicProblemApiSlice 