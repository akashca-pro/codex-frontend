interface Activity {
    date : string;
    count : number;
}

interface LeaderboardData {
    userId : string;
    score : number;
    entity : string;
    globalRank : number;
    entityRank : number;
}

interface RecentActivity {
    title : string;
    difficulty : string;
    status : string;
    timeAgo : string
}

export interface UserDashboardResponse {
    heatmap : Activity[];
    currentStreak : number;
    leaderboardDetails : LeaderboardData;
    problemsSolved : number;
    recentActivities : RecentActivity[];
}