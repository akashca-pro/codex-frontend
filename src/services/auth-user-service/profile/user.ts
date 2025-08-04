import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess, UserProfileResponse } from "@/types/apiTypes";

const preUrl = `/user/dashboard`

const userProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        profile : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => ({
                url : `${preUrl}/profile`,
                method : 'GET'
            }),
            providesTags : ['user']
        }),

        updateProfile : builder.mutation({
            query : (updatingData) => ({
                url : `${preUrl}/profile/update-profile`,
                method : 'PATCH',
                body : updatingData
            }),
            invalidatesTags : ['user']
        })

    })
})

export const {

    useProfileQuery,
    useUpdateProfileMutation

} = userProfileApi