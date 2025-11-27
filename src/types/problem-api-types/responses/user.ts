import type { ExecutionResult, Language } from "../fieldTypes";

export interface SubmitProblemResponse {
    submissionId : string;
}

export interface SubmitResultResponse {
    submissionId : string;
    userId : string;
    executionResult : ExecutionResult;
}

export interface RunProblemResponse {
    tempId : string;
}

export interface RunResultResponse {
    tempId : string;
    executionResult : ExecutionResult;
}

export interface Submission {
    Id : string;
    status : string;
    language : Language;
    executionResult : ExecutionResult | null,
    userCode : string;
    createdAt : string;
}

export interface listProblemSpecificSubmissionsResponse {
    submissions : Submission[];
    nextCursor : string;
    hasMore : boolean;
}

export interface CreateCollabSessionResponse {
    inviteToken : string;
}

export interface IHints {
    hint : string;
    createdAt : string;
}

export interface GetPreviousHintsResponse{
    hints : IHints[];
}

export interface RequestHintResponse {
    hint : string;
}

