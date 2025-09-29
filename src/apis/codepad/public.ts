import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { CustomCodeResultRequest, CustomCodeRunRequest } from "@/types/problem-api-types/payload/public";
import type { CustomCodeResultResponse, CustomCodeRunResponse } from "@/types/problem-api-types/responses/public";

const preUrl = `public/codepad/code`;

const publicCodepadApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        customCodeRun : builder.mutation<ApiSuccess<CustomCodeRunResponse>,CustomCodeRunRequest>({
            query : (payload) => ({
                url : `${preUrl}/run`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['public']
        }),
        customCodeResult : builder.query<ApiSuccess<CustomCodeResultResponse>,CustomCodeResultRequest>({
            query : ({ tempId }) => ({
                url : `${preUrl}/${tempId}/run/result`,
                method : 'GET',
            }),
            providesTags : ['public']
        })
    })
});

export const {

    useCustomCodeRunMutation,
    useCustomCodeResultQuery,

} = publicCodepadApiSlice