import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess } from '@/types/apiTypes'
import type { GetPreviousHintsRequest, listProblemSpecificSubmissionsRequest, RequestHintRequest, SubmitProblemRequest, SubmitResultRequest } from "@/types/problem-api-types/payload/user";
import type { GetPreviousHintsResponse, listProblemSpecificSubmissionsResponse, RequestHintResponse, SubmitProblemResponse, SubmitResultResponse } from "@/types/problem-api-types/responses/user";

const preUrl = '/user/problems';

const userProblemApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        submitProblem : builder.mutation<ApiSuccess<SubmitProblemResponse>,SubmitProblemRequest>({
            query : ({ problemId, payload }) => ({
                url : `${preUrl}/${problemId}/code/submit`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),
        submitResult : builder.query<ApiSuccess<SubmitResultResponse>,SubmitResultRequest>({
            query : ({ problemId, submissionId }) => ({
                url : `${preUrl}/${problemId}/${submissionId}/code/submit/result`,
                method : 'GET',
            }),
            providesTags : ['user']
        }),
        listProblemSpecificSubmissions : builder.query<ApiSuccess<listProblemSpecificSubmissionsResponse>,listProblemSpecificSubmissionsRequest>({
            query : ({ params, problemId }) => ({
                url : `${preUrl}/${problemId}/submissions`,
                method : 'GET',
                params
            }),
            providesTags : ['user']
        }),
        getPreviousHints : builder.query<ApiSuccess<GetPreviousHintsResponse>,GetPreviousHintsRequest>({
            query : ({ problemId }) => ({
                url : `${preUrl}/${problemId}/hints`,
                method : 'GET',
            }),
            providesTags : ['user']
        }),
        requestHint : builder.mutation<ApiSuccess<RequestHintResponse>,RequestHintRequest>({
            query : ({ problemId, params }) => ({
                url : `${preUrl}/${problemId}/hints/request`,
                method : 'POST',
                body : params
            })
        })
    })
})

export const {

    useSubmitProblemMutation,
    useLazySubmitResultQuery,
    useListProblemSpecificSubmissionsQuery,
    useGetPreviousHintsQuery,
    useRequestHintMutation,

} = userProblemApiSlice