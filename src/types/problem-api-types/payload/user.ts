import type { ITestCase, Language } from "../fieldTypes";

export interface SubmitProblemRequest {
    problemId : string;
    payload : {
        country : string;
        userCode : string;
        language : Language
    }
}

export interface SubmitResultRequest {
    problemId : string;
    submissionId : string;
}

export interface RunProblemRequest {
    problemId : string;
    payload : {
        language : Language;
        userCode : string;
        testCases : ITestCase[];
    }
}

export interface RunResultRequest {
    problemId : string;
    tempId : string;
}