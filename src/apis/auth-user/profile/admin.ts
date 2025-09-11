import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess, UserProfileResponse } from "@/types/apiTypes";

const preUrl = `/admin/profile`

const adminProfileApi = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminProfile : builder.query<ApiSuccess<UserProfileResponse>,void>({
            query : () => ({
                url : `${preUrl}/`,
                method : 'GET'
            }),
            providesTags : ['admin']
        }),

        adminUpdateProfile : builder.mutation({
            query : (updatingData) => ({
                url : `${preUrl}/profile/update-profile`,
                method : 'PATCH',
                body : updatingData
            }),
            invalidatesTags : ['admin']
        })

    })
})

export const {

    useAdminProfileQuery,
    useAdminUpdateProfileMutation

} = adminProfileApi