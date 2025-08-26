import type { IExample, IStarterCode, ITestCase, Language } from "../fieldTypes";


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
    difficulty : string;
    tags : string[];
    constraints : string[];
    starterCodes : IStarterCode[];
    run : ITestCase[];
    examples : IExample[];
    updatedAt : string;
    createdAt : string;
}

export interface CustomCodeRunRequest {
    payload : {
        tempId : string;
        userCode : string;
        language : Language;
    }
}