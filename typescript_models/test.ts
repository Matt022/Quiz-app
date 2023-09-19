import { Question } from "./question";

export interface Test {
    id: number;
    title: string;
    questions: Question[];
}