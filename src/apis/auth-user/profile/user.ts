import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess, UserProfileResponse } from "@/types/apiTypes";

const preUrl = `/user/profile`

const userProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        profile : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => ({
                url : `${preUrl}/`,
                method : 'GET'
            }),
            providesTags : ['user']
        }),

        updateProfile : builder.mutation<ApiSuccess<null>,FormData>({
            query : (formData) => ({
                url : `${preUrl}/update`,
                method : 'PATCH',
                body : formData
            }),
            invalidatesTags : ['user']
        })

    })
})

export const {

    useProfileQuery,
    useUpdateProfileMutation

} = userProfileApi