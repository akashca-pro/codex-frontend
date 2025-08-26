import type { ITestCase, Language } from "../fieldTypes";

export interface SubmitProblemRequest {
    problemId : string;
    payload : {
        userId : string;
        country : string;
        userCode : string;
        language : Language
    }
}

export interface RunProblemRequest {
    problemId : string;
    payload : {
        userId : string;
        language : Language;
        userCode : string;
        testCases : ITestCase[];
    }
}