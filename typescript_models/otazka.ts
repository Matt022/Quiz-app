import { Answer } from "./answer";

export interface Question {
    text: string;
    answers: Answer[];
}