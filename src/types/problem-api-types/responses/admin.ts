import type { Difficulty, IExample, IStarterCode, ITemplateCode, ITestCaseCollection } from "../fieldTypes";

export interface AdminProblemDetailsResponse {
    Id : string;
    questionId : string;
    title : string;
    description : string;
    difficulty : Difficulty;
    tags : string[];
    constraints : string[];
    starterCodes : IStarterCode[];
    testcaseCollection : ITestCaseCollection;
    examples : IExample[];
    active : boolean;
    templateCodes : ITemplateCode[]
    updatedAt : string;
    createdAt : string;
}