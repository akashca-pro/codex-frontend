import type { Difficulty } from "../fieldTypes";

export interface ListProblemParams {
    page? : number;
    limit? : number;
    difficulty? : Difficulty,
    tag?:string;
    active? : boolean;
    search? : string;
    questionId? : string
}
