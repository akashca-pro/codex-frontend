import type { Difficulty, IExample, ISolutionCode, IStarterCode, ITestCase, TestCaseCollectionType } from "../fieldTypes";

export interface CreateProblemRequest {
    questionId : string;
    title : string;
    description : string;
    difficulty : Difficulty;
    tags : string[];
}

export interface UpdateProblemRequest {
    problemId : string;
    updatedData : {
        questionId? : String;
        title? : string;
        description? : string;
        difficulty? : Difficulty;
        active? : boolean;
        tags? : string[];
        constraints? : string[];
        examples? : IExample[];
        starterCodes? : IStarterCode[];
    }
}

export interface AddTestCaseRequest {
    problemId : string;
    testCaseData : {
        testCaseCollectionType : TestCaseCollectionType;
        testCase : ITestCase
    }
}

export interface BulkUploadTestCasesRequest {
    problemId : string;
    testcaseData : {
        testCaseCollectionType : TestCaseCollectionType;
        testCase : ITestCase[];
    }
}

export interface RemoveTestCaseRequest {
    problemId : string;
    testCaseId : string;
}

export interface AddSolutionCodeRequest {
    problemId : string;
    solutionCode : Omit<ISolutionCode,'Id'>
}

export interface UpdateSolutionCodeRequest {
    problemId :string;
    solutionCodeId : string;
    updatedData : Omit<ISolutionCode,'Id'>
}

export interface RemoveSolutionCodeRequest {
    problemId : string;
    solutionCodeId : string;
}