import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess } from '@/types/apiTypes'
import type { ListProblemParams } from "@/types/problem-api-types/payload/public";
import type { RunProblemRequest, RunResultRequest } from "@/types/problem-api-types/payload/user";
import type { ListProblemResponse, PublicProblemDetailsResponse } from "@/types/problem-api-types/responses/public";
import type { RunProblemResponse, RunResultResponse } from "@/types/problem-api-types/responses/user";

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
        }),
        runProblem : builder.mutation<ApiSuccess<RunProblemResponse>,RunProblemRequest>({
            query : ({ problemId, payload }) => ({
                url : `${preUrl}/${problemId}/code/run`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['public']
        }),
        runResult : builder.query<ApiSuccess<RunResultResponse>,RunResultRequest>({
            query : ({ tempId, problemId }) => ({
                url : `${preUrl}/${problemId}/${tempId}/code/run/result`,
                method : 'GET',
            }),
            providesTags : ['public']
        })
    })
})

export const { 

    usePublicListProblemsQuery,
    usePublicGetProblemDetailsQuery,
    useRunProblemMutation,
    useLazyRunResultQuery,

} = publicProblemApiSlice 