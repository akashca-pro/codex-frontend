import type { Difficulty, IExample, IStarterCode, ITestCase } from "../fieldTypes";


export interface ListProblemResponse {
    problems : {
        Id : string;
        title : string;
        questionId : string;
        difficulty : string;
        tags : string[];
        active : boolean;
        createdAt : string;
        updatedAt : string;
    }[]
    totalPage : number;
    currentPage : number;
    totalItems : number;
}

export interface PublicProblemDetailsResponse {
    Id : string;
    questionId : string;
    title : string;
    description : string;
    difficulty : Difficulty;
    tags : string[];
    constraints : string[];
    starterCodes : IStarterCode[];
    run : ITestCase[];
    examples : IExample[];
    updatedAt : string;
    createdAt : string;
}