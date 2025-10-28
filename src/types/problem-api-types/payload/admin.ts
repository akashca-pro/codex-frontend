import type { Difficulty, IExample, IStarterCode, ITestCase, TestCaseCollectionType } from "../fieldTypes";

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
        examples? : Partial<IExample>[];
        starterCodes? : Partial<IStarterCode>[];
    }
}

export interface AddTestCaseRequest {
    problemId : string;
    testCaseData : {
        testCaseCollectionType : TestCaseCollectionType;
        testCase : Omit<ITestCase,'Id'>
    }
}

export interface BulkUploadTestCasesRequest {
    problemId : string;
    testCases : {
        testCaseCollectionType : TestCaseCollectionType;
        testCase : Omit<ITestCase, "Id">[];
    }
}

export interface RemoveTestCaseRequest {
    problemId : string;
    testCaseId : string;
    testCaseCollectionType : TestCaseCollectionType
}

export interface CheckQuestionIdAvailRequest {
    questionId : string;
}

export interface CheckTitleAvailRequest {
    title : string
}

export interface UpdateTemplateCodeRequest {
    problemId : string;
    templateCodeId : string;
    updatedData : {
        language? : string;
        submitWrapperCode? : string;
        runWrapperCode? : string;
    }
}
