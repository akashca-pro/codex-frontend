
export interface ListProblemParams {
    page? : number;
    limit? : number;
    difficulty? : string,
    tags?:string[];
    active? : boolean;
    search? : string;
    questionId? : string;
    sort? : string;
}
