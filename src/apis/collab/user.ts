import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { CreateCollabSessionResponse } from "@/types/problem-api-types/responses/user";

const preUrl = `user/collab`

const collabApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        createSession : builder.mutation<ApiSuccess<CreateCollabSessionResponse>,null>({
            query : () => ({
                url : `${preUrl}/session/create`,
                method : 'POST'
            }),
            invalidatesTags : ['user']
        })
    })
})

export const {

     useCreateSessionMutation

} = collabApiSlice
