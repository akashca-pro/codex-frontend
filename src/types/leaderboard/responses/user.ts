export interface LeaderboardResponse {
    id : string;
    entity? : string;
    score : number;
    problemsSolved? : number;
    username : string;
    rank : number
}