import type { ITestCase, Language } from "../fieldTypes";

export interface SubmitProblemRequest {
    problemId : string;
    payload : {
        country : string | undefined;
        userCode : string;
        language : string;
    }
}

export interface SubmitResultRequest {
    problemId : string;
    submissionId : string;
}

export interface RunProblemRequest {
    problemId : string;
    payload : {
        language : string;
        userCode : string;
        testCases : ITestCase[];
    }
}

export interface RunResultRequest {
    problemId : string;
    tempId : string;
}

export interface listProblemSpecificSubmissionsRequest {
    problemId : string;
    params : {
        limit : number;
        nextCursor : string | undefined
    }
}