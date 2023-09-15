import { Odpoved } from "./typescript_models/odpoved";
import { Otazka } from "./typescript_models/otazka";
import { Test } from "./typescript_models/test";

// Príklad vytvorenia testu
const testHere: Test = {
    id: 0,
    nazov: "MojTest",
    otazky: [
        {
            text: "Čo je hlavné mesto Slovenska?",
            odpovede: [
                { text: "Bratislava", jeSpravna: true },
                { text: "Praha", jeSpravna: false },
                { text: "Budapešť", jeSpravna: false },
                { text: "Varšava", jeSpravna: false },
            ],
        },
        {
            text: "Koľko je 2 + 2?",
            odpovede: [
                { text: "1", jeSpravna: false },
                { text: "3", jeSpravna: false },
                { text: "4", jeSpravna: true },
                { text: "5", jeSpravna: false },
            ],
        },
    ]
};

const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("testName");
testNameElement.textContent = testHere.nazov;

const questionsContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");

for (let i: number = 0; i < testHere.otazky.length; i++) {
    const questionDiv: HTMLDivElement = document.createElement("div");
    questionDiv.classList.add("question");

    const questionText: HTMLParagraphElement = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.textContent = `Otázka ${i + 1}: ${testHere.otazky[i].text}`;

    const answersDiv: HTMLDivElement = document.createElement("div");
    answersDiv.classList.add("answers");

    testHere.otazky[i].odpovede.forEach((odpoved: Odpoved) => {
        const answerDiv: HTMLDivElement = document.createElement("div");
        answerDiv.classList.add("answer");

        const answerText: HTMLParagraphElement = document.createElement("p");
        answerText.textContent = odpoved.text;

        if (odpoved.jeSpravna) {
            answerText.classList.add("correct-answer");
        } else {
            answerText.classList.add("incorrect-answer");
        }

        answerDiv.appendChild(answerText);
        answersDiv.appendChild(answerDiv);
    });

    questionDiv.appendChild(questionText);
    questionDiv.appendChild(answersDiv);
    questionsContainer.appendChild(questionDiv);
    
}
