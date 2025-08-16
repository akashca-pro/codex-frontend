import type { Difficulty, IExample, ISolutionCode, IStarterCode, ITestCaseCollection } from "../fieldTypes";

export interface AdminProblemDetailsResponse {
    Id : string;
    questionId : string;
    title : string;
    decription : string;
    difficulty : Difficulty;
    tags : string[];
    constraints : string[];
    starterCodes : IStarterCode[];
    testcaseCollection : ITestCaseCollection;
    examples : IExample[];
    active : boolean;
    solutionCodes : ISolutionCode[];
    updatedAt : string;
    createdAt : string;
}