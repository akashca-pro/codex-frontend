import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { CountryLeaderboardRequest, GlobalLeaderboardRequest } from "@/types/leaderboard/payload/user";
import type { LeaderboardResponse } from "@/types/leaderboard/responses/user";

const preUrl = 'user/leaderboard';

const leaderboardApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        userGlobalLeaderboard : builder.query<ApiSuccess<{users : LeaderboardResponse[]}>, GlobalLeaderboardRequest>({
            query : (params) => ({
                url : `${preUrl}/global`,
                method : 'GET',
                params
            }),
            providesTags : ['user']
        }),
        userCountryLeaderboard : builder.query<ApiSuccess<{users : LeaderboardResponse[]}>, CountryLeaderboardRequest>({
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

    useUserGlobalLeaderboardQuery,
    useUserCountryLeaderboardQuery

} = leaderboardApiSlice;