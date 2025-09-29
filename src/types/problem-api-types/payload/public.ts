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

export interface CustomCodeRunRequest {
    userCode : string;
    language : string;
}

export interface CustomCodeResultRequest {
    tempId : string;
}