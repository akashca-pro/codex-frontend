import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess } from '@/types/apiTypes'
import type { SubmitProblemRequest, SubmitResultRequest } from "@/types/problem-api-types/payload/user";
import type { SubmitProblemResponse, SubmitResultResponse } from "@/types/problem-api-types/responses/user";

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
    })
})

export const {

    useSubmitProblemMutation,
    useSubmitResultQuery

} = userProblemApiSlice