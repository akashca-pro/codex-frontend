import type { ExecutionResult } from "../fieldTypes";

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