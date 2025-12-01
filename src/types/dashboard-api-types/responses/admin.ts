export interface AdminDashboardResponse {
    problemSubmissionStats: {
        submissionStats: {
            totalSubmissions: number;
            todaysSubmissions: number;
            languageWise: {
                language: string;
                count: number;
            }[];
        };
        problemStats: {
            totalProblems: number;
            todaysProblems: number;
            difficultyWise: {
                difficulty: string;
                count: number;
            }[];
        };
    };
    userStats: {
        totalUsers: number;
        todaysUsers: number;
    };
    collabStats: {
        total: {
            active: number;
            ended: number;
            offline: number;
        };
        today: {
            active: number;
            ended: number;
            offline: number;
        };
    };
}

export interface AdminGrpcMetricResponse {
    [key: string]: any;
}