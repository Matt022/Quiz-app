import { Answer } from '../typescript_models/answer';
import { CreateOrUpdate } from '../typescript_models/createOrUpdate';
import { Question } from "../typescript_models/question";


export class HelperClass {
    getQuizIdFromURL(): number | null {
        // Získaj parametre URL adresy a ulož ich do objektu URLSearchParams.
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);

        // Získaj hodnotu parametra s názvom "id" z URLSearchParams.
        const quizIdString: string | null = urlParams.get("id");

        // Skontroluj, či bol parameter "id" nájdený v URL adrese.
        if (quizIdString) {
            // Ak parameter "id" existuje, pokús sa previesť ho na číslo.
            const quizId: number = parseInt(quizIdString, 10);

            // Skontroluj, či prevod na číslo bol úspešný a číslo je platné.
            if (!isNaN(quizId)) {
                // Vráť identifikátor kvízu ako číslo.
                return quizId;
            }
        }

        // Ak parameter "id" neexistuje alebo nie je platným číslom, vráť null.
        return null;
    }
    
    getData(createOrUpdate: CreateOrUpdate): Question[] {
        // Získáme zoznam všetkých otázok
        let questionDivContainers: NodeListOf<HTMLDivElement>;
        if (createOrUpdate === "update") {
            questionDivContainers = document.querySelectorAll("div.test-update-questions div.question");
        } else {
            questionDivContainers = document.querySelectorAll("div.question");
        }
        
        // Vytvorme pole pre otázky
        const questions: Question[] = [];
    
        // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
        for (let i: number = 0; i < questionDivContainers.length; i++) {
            const question: Question = {
                text: "",
                answers: [],
            };
    
            // získame znenie otázky a priradíme do vytvoreného objektu
            const questionInput: HTMLInputElement = <HTMLInputElement>questionDivContainers[i].querySelector("input[type='text']");
    
            question.text = questionInput.value;
    
            // všetky answers a k nim správne answers
            // správne answers zistíme vo for cykle nižšie
            const allAnswersInputs: NodeListOf<HTMLInputElement> = questionDivContainers[i].querySelectorAll(".answer input[type='text']");
            const correctAnswersInputs: NodeListOf<HTMLInputElement> = questionDivContainers[i].querySelectorAll(".answer input[type='checkbox']");
    
            for (let j: number = 0; j < allAnswersInputs.length; j++) {
                const answer: Answer = {
                    text: allAnswersInputs[j].value,
                    isCorrect: correctAnswersInputs[j].checked,
                };
                question.answers.push(answer);
            }
    
            questions.push(question);
        }
    
        return questions;
    }
}
