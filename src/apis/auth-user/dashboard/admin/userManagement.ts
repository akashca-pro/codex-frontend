import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { AdminListUsersRequest, BlockUserRequest } from "@/types/admin-user-management/payload";
import type { AdminListUsersResponse } from "@/types/admin-user-management/responses";
import type { ApiSuccess } from "@/types/apiTypes";

const preUrl = '/admin/users'

const adminUsersApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        listUsers : builder.query<ApiSuccess<AdminListUsersResponse>,AdminListUsersRequest>({
            query : (params) => ({
                url : `${preUrl}/`,
                method : 'GET',
                params 
            }),
            providesTags : ['admin']
        }),
        toggleBlockUsers : builder.mutation<ApiSuccess<null>,BlockUserRequest>({
            query : ({userId, block}) => ({
                url : `${preUrl}/${userId}/toggle-block`,
                method : 'PATCH',
                body : {block}
            }),
            invalidatesTags : ['admin']
        })
    })
})

export const {

    useListUsersQuery,
    useToggleBlockUsersMutation

} =  adminUsersApiSlice