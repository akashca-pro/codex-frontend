import { apiSlice } from "@/store/rtk-query/apiSlice";
import { type ApiSuccess } from '@/types/apiTypes'
import type { RunProblemRequest, SubmitProblemRequest } from "@/types/problem-api-types/payload/user";
import type { SubmitProblemResponse } from "@/types/problem-api-types/responses/user";

const preUrl = '/user/problems';

const userProblemApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        submitProblem : builder.mutation<ApiSuccess<SubmitProblemResponse>,SubmitProblemRequest>({
            query : ({ problemId, payload }) => ({
                url : `${preUrl}/${problemId}/submit`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        }),
        runProblem : builder.mutation<ApiSuccess<null>,RunProblemRequest>({
            query : ({ problemId, payload }) => ({
                url : `${preUrl}/${problemId}/run`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['user']
        })
    })
})

export const {

    useSubmitProblemMutation,
    useRunProblemMutation,

} = userProblemApiSlice