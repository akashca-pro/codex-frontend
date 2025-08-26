import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { CustomCodeRunRequest } from "@/types/problem-api-types/responses/public";

const preUrl = `public/codepad`;

const publicCodepadApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        customCodeRun : builder.mutation<ApiSuccess<null>,CustomCodeRunRequest>({
            query : ({ payload }) => ({
                url : `${preUrl}/run`,
                method : 'POST',
                body : payload
            }),
            invalidatesTags : ['public']
        })
    })
});

export const {

    useCustomCodeRunMutation,

} = publicCodepadApiSlice