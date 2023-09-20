import { Answer } from "../../typescript_models/answer";
import { Question } from "../../typescript_models/question";
import { Test } from '../../typescript_models/test';
import { addTest } from "../../typescript_scripts/dbService.js";
import { getData } from "../../typescript_scripts/helpers.js";

const test: Test = {
    id: 0,
    title: "",
    questions: [],
};

const questionContainerDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("questions-container");
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#save");
const addQuestionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-question");
addQuestionButton.addEventListener("click", () => {
    addQuestion();
});

function addQuestion(): void {
    const question: Question = {
        text: "",
        answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ],
    };

    test.questions.push(question);
    renderQuestionElements(question, test.questions.length - 1);
}

addQuestion();

function renderQuestionElements(question: Question, index: number): void {
    const questionDiv: HTMLDivElement = document.createElement("div");
    questionDiv.className = "question";

    const questionLabel: HTMLLabelElement = document.createElement("label");
    questionLabel.textContent = `Question ${index + 1}:`;

    const questionInput: HTMLInputElement = document.createElement("input");
    questionInput.type = "text";
    questionInput.value = question.text;
    questionInput.placeholder = "Question";
    questionInput.addEventListener("input", (e: Event) => {
        question.text = (e.target as HTMLInputElement).value;
    });

    const buttonToDeleteQuestion: HTMLButtonElement = document.createElement("button");
    buttonToDeleteQuestion.classList.add("deleteButton");
    buttonToDeleteQuestion.textContent = "Delete question";
    buttonToDeleteQuestion.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            const questionContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div#questions-container");
            questionContainer.removeChild(questionDiv);
            test.questions.splice(index);
        }
    });

    const answersDiv: HTMLDivElement = document.createElement("div");

    // každá otázka má 4 odpovede
    for (let i: number = 0; i < 4; i++) {
        const answer: Answer = question.answers[i];
        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";

        const answerInput: HTMLInputElement = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "Answer";
        answerInput.value = answer ? answer.text : "";

        // Vytvorme nový objekt answers v každej iterácii
        const newAnswer: Answer = {
            text: "",
            isCorrect: false,
        };

        const correctAnswerInput: HTMLInputElement = document.createElement("input");
        correctAnswerInput.type = "checkbox";
        correctAnswerInput.checked = answer ? answer.isCorrect : false;

        correctAnswerInput.addEventListener("change", (e: Event) => {
            newAnswer.isCorrect = (e.target as HTMLInputElement).checked;
        });

        const correctAnswerLabel: HTMLLabelElement = document.createElement("label");
        correctAnswerLabel.textContent = "Correct answer";

        answerDiv.appendChild(answerInput);

        const correctAnswerDiv: HTMLDivElement = document.createElement("div");
        correctAnswerDiv.classList.add("correctAnswerDiv");
        correctAnswerDiv.appendChild(correctAnswerLabel);
        correctAnswerDiv.appendChild(correctAnswerInput);
        answerDiv.appendChild(correctAnswerDiv);

        answersDiv.appendChild(answerDiv);
        question.answers[i] = newAnswer;
    }

    const brElement: HTMLBRElement = document.createElement("br");
    const hr: HTMLHRElement = document.createElement("hr");

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(brElement);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(hr);
    questionDiv.appendChild(answersDiv);
    questionDiv.appendChild(buttonToDeleteQuestion);


    questionContainerDiv.appendChild(questionDiv);
}

saveBtn.addEventListener("click", () => {
    // Získáme hodnotu názvu testu z inputu
    const testTitleInput: HTMLInputElement = <HTMLInputElement>document.getElementById("title");
    test.title = testTitleInput.value;

    test.questions = getData("create");

    const isAnyQuestionNameEmpty: boolean = test.questions.some((question: Question) =>
        question.answers.some((answer: Answer) => answer.text === "")
    );

    const isAnyAnswerMarked: boolean = test.questions.some((question: Question) =>
        question.answers.every((answer: Answer) => answer.isCorrect === false)
    );

    if (test.title === ""){
        alert("Test needs to have a title");
        return;
    }

    if (isAnyQuestionNameEmpty) {
        alert("Complete all questions");
        return;
    }

    if (isAnyAnswerMarked) {
        alert("Mark at least one correct answer");
        return;
    }

    addTest(test).then(() => {
        alert("Test was added to database.");
    });
});
