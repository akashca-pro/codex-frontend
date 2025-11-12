import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { CountryLeaderboardRequest, GlobalLeaderboardRequest } from "@/types/leaderboard/payload/user";
import type { LeaderboardResponse } from "@/types/leaderboard/responses/user";

const preUrl = 'admin/leaderboard';

const leaderboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminGlobalLeaderboard : builder.query<ApiSuccess<{users : LeaderboardResponse[]}>, GlobalLeaderboardRequest>({
            query : (params) => ({
                url : `${preUrl}/global`,
                method : 'GET',
                params
            }),
            providesTags : ['admin']
        }),
        adminCountryLeaderboard : builder.query<ApiSuccess<{users : LeaderboardResponse[]}>, CountryLeaderboardRequest>({
            query : (params) => ({
                url : `${preUrl}/country`,
                method : 'GET',
                params
            }),
            providesTags : ['user']
        })
    })
})

export const {
    
    useAdminGlobalLeaderboardQuery,
    useAdminCountryLeaderboardQuery
     
} = leaderboardApiSlice