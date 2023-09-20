import { Answer } from '../typescript_models/answer';
import { CreateOrUpdate } from '../typescript_models/createOrUpdate';
import { Question } from "../typescript_models/question";
import { Test } from "../typescript_models/test";

// Funkcia pre získanie ID z URL
export function getQuizIdFromURL(): number | null {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const quizIdString: string | null = urlParams.get("id");

    if (quizIdString) {
        const quizId: number = parseInt(quizIdString, 10);
        if (!isNaN(quizId)) {
            return quizId;
        }
    }

    return null;
}

export function getData(createOrUpdate: CreateOrUpdate): Question[] {
    
    let otazkyDivs: NodeListOf<HTMLDivElement> | null = null;
    if (createOrUpdate === "update") {
        otazkyDivs = document.querySelectorAll("div.test-update-questions div.question");
    } else {
        otazkyDivs = document.querySelectorAll("div.question");

    }
    // Získáme seznam všech otázek
    // const otazkyDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll("div.test-update-questions div.question");
    // Vytvorme pole pre otázky
    const questions: Question[] = [];

    // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
    for (let i: number = 0; i < otazkyDivs.length; i++) {
        const question: Question = {
            text: "",
            answers: [],
        };

        // získame znenie otázky a priradíme do vytvoreného objektu
        const otazkaInput: HTMLInputElement = <HTMLInputElement>otazkyDivs[i].querySelector("input[type='text']");

        question.text = otazkaInput.value;

        // všetky answers a k nim správne answers
        // správne answers zistíme vo for cykle nižšie
        const odpovedeInputs: NodeListOf<HTMLInputElement> = otazkyDivs[i].querySelectorAll(".answer input[type='text']");
        const spravneInputs: NodeListOf<HTMLInputElement> = otazkyDivs[i].querySelectorAll(".answer input[type='checkbox']");

        for (let j: number = 0; j < odpovedeInputs.length; j++) {
            const answer: Answer = {
                text: odpovedeInputs[j].value,
                isCorrect: spravneInputs[j].checked,
            };
            question.answers.push(answer);
        }

        questions.push(question);
    }

    return questions;

}