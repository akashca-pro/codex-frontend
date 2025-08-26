export type Difficulty = 'Easy' | 'Medium' | 'Hard' 
export type Language = 'javascript' | 'python' | 'go'
export type TestCaseCollectionType = 'run' | 'submit'

export interface IStarterCode {
    Id : string;
    language : Language;
    code : string;
}

export interface ITestCase {
    Id : string;
    input : string;
    output : string;
}

export interface IExample { 
    Id : string;
    input : string;
    output : string;
    explanation : string;
}

export interface ITestCaseCollection {
    run : ITestCase[];
    submit : ITestCase[];
}

export interface ISolutionCode {
    Id : string;
    language : Language;
    code : string;
    executionTime : number;
    memoryTaken : number;
}