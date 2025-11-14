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
}

export interface ITemplateCode {
    Id : string;
    language : Language,
    submitWrapperCode : string;
    runWrapperCode : string;
}

export interface ITestCaseCollection {
    run : ITestCase[];
    submit : ITestCase[];
}

interface Stats {
    totalTestCase: number;
    passedTestCase: number;
    failedTestCase: number;
    stdout? : string;
    executionTimeMs?: number;
    memoryMB? : number;
}

interface FailedTestCase {
    index: number;
    input: string;
    output: any; // Can be string for error, or array for wrong answer
    expectedOutput: any;
}

interface TestResult {
    Id?: string;
    index : string;
    input : string;
    output : any;
    expectedOutput: string;
    passed: boolean
    executionTimeMs: number
    memoryMB: number
}

export interface ExecutionResult {
    stats?: Stats | undefined;
    failedTestCase?: FailedTestCase | undefined;
    testResults? : TestResult[]
}