import { Answer } from "../typescript_models/answer";
import { Question } from "../typescript_models/question";
import { Test } from "../typescript_models/test";
import { deleteTest, getTestById, updateTest } from "./dbService.js";
import { getData, getQuizIdFromURL } from "./helpers.js";

const deleteTestBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.deleteTest");
const editTestBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.editTest");
const disableChangesBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.disableChanges");
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#save");
const addQuestionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-question");
const testId: number | null = getQuizIdFromURL();

if (testId != null) {
    getTestById(testId).then((test: Test | null) => {
        if (test) {
            const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("title");
            testNameElement.textContent = test.title;

            const questionsContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");

            for (let i: number = 0; i < test.questions.length; i++) {
                const questionDiv: HTMLDivElement = document.createElement("div");
                questionDiv.classList.add("question");

                const questionText: HTMLParagraphElement = document.createElement("p");
                questionText.classList.add("question-text");
                questionText.textContent = `Question ${i + 1}: ${test.questions[i].text}`;

                const answersDiv: HTMLDivElement = document.createElement("div");
                answersDiv.classList.add("answers");

                test.questions[i].answers.forEach((answer: Answer) => {
                    const answerDiv: HTMLDivElement = document.createElement("div");
                    answerDiv.classList.add("answer");

                    const answerText: HTMLParagraphElement = document.createElement("p");
                    answerText.textContent = answer.text;

                    if (answer.isCorrect) {
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
        } else {
            window.location.href = "/admin/pages/allTests.html";
        }
    });
}

deleteTestBtn.addEventListener("click", () => {
    if (testId != null && confirm("Naozaj chcete odstrániť tento test?")) {
        deleteTest(testId).then(() => {
            alert("Test bol úspešne zmazaný");
        });
    }
});

editTestBtn.addEventListener("click", () => {
    const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("title");
    testNameElement.contentEditable = "true";

    const questionsDivEl: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");
    questionsDivEl.style.display = "none";

    const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
    testUpdateQuestionsContainer.style.display = "block";

    editTestBtn.style.display = "none";
    disableChangesBtn.style.display = "inline-block";
    addQuestionButton.style.display = "inline-block";
    saveBtn.style.display = "inline-block";

    getTestById(testId!).then((test: Test | null) => {
        if (test) {
            for (let i: number = 0; i < test.questions.length; i++) {
                renderQuestionElements(test.questions[i], i);
            }

            addQuestionButton.addEventListener("click", () => {
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
            });

            saveBtn.addEventListener("click", () => {
                // Získáme hodnotu názvu testu zo spanu
                const nazovInput: HTMLSpanElement = <HTMLSpanElement>document.getElementById("title");
                test.title = nazovInput.textContent!;
                test.questions = getData();

                updateTest(test.id, test).then(() => {
                    alert("Test was added to database.");
                });
            });
        }
    });
});

disableChangesBtn.addEventListener("click", () => {
    const testTitleElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("title");
    testTitleElement.contentEditable = "false";

    const questionsDivEl: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");
    questionsDivEl.style.display = "block";
    editTestBtn.style.display = "inline-block";
    disableChangesBtn.style.display = "none";
    addQuestionButton.style.display = "none";
    saveBtn.style.display = "none";

    const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
    while (testUpdateQuestionsContainer.firstChild) {
        testUpdateQuestionsContainer.removeChild(testUpdateQuestionsContainer.firstChild);
    }

    testUpdateQuestionsContainer.style.display = "none";
});

function renderQuestionElements(question: Question, index: number): void {
    const questionDivContainer: HTMLDivElement = document.createElement("div");
    questionDivContainer.className = "question";

    const otazkaLabel: HTMLLabelElement = document.createElement("label");
    otazkaLabel.textContent = `Question ${index + 1}:`;

    const buttonToDelete: HTMLButtonElement = document.createElement("button");
    buttonToDelete.textContent = "Delete";

    buttonToDelete.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
            testUpdateQuestionsContainer.removeChild(testUpdateQuestionsContainer.children[index]);
        }
    });

    const questionInput: HTMLInputElement = document.createElement("input");
    questionInput.type = "text";
    questionInput.value = question.text;
    questionInput.placeholder = "Question";
    questionInput.addEventListener("input", (e: Event) => {
        question.text = (e.target as HTMLInputElement).value;
    });

    const answersDiv: HTMLDivElement = document.createElement("div");

    // každá otázka má presne 4 answers
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

    questionDivContainer.appendChild(otazkaLabel);
    questionDivContainer.appendChild(brElement);
    questionDivContainer.appendChild(questionInput);
    questionDivContainer.appendChild(hr);
    questionDivContainer.appendChild(answersDiv);
    questionDivContainer.appendChild(buttonToDelete);

    const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
    testUpdateQuestionsContainer.appendChild(questionDivContainer);
}