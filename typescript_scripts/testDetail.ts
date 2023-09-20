import { Answer } from "../typescript_models/answer";
import { Question } from "../typescript_models/question";
import { Test } from "../typescript_models/test";
import { deleteTest, getTestById, updateTest } from "./dbService.js";
import { getData, getQuizIdFromURL } from "./helpers.js";

const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
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
            alert("Test was deleted successfully");
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
                const titleInput: HTMLSpanElement = <HTMLSpanElement>document.getElementById("title");
                test.title = titleInput.textContent!;
                test.questions = getData("update");

                updateTest(test.id, test).then(() => {
                    alert("Test was updated.");
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
    // Vytvoríme kontajnerový div pre otázku
    const questionDivContainer: HTMLDivElement = document.createElement("div");
    questionDivContainer.className = "question";

    // Vytvoríme label pre označenie otázky
    const questionLabel: HTMLLabelElement = document.createElement("label");
    questionLabel.textContent = `Question ${index + 1}:`;

    // Vytvoríme tlačidlo pre odstránenie otázky
    const buttonToDelete: HTMLButtonElement = document.createElement("button");
    buttonToDelete.textContent = "Delete";

    // Pridáme event listener na tlačidlo pre odstránenie otázky
    buttonToDelete.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            // Získame kontajner otázok a odstránime aktuálnu otázku z neho
            const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
            testUpdateQuestionsContainer.removeChild(testUpdateQuestionsContainer.children[index]);
        }
    });

    // Vytvoríme input pre text otázky
    const questionInput: HTMLInputElement = document.createElement("input");
    questionInput.type = "text";
    questionInput.value = question.text;
    questionInput.placeholder = "Question";
    questionInput.spellcheck = false; // Vypnutie kontrolu pravopisu

    // Pridáme event listener na input, aby sme mohli aktualizovať text otázky v objekte otázky
    questionInput.addEventListener("input", (e: Event) => {
        question.text = (e.target as HTMLInputElement).value;
    });

    // Vytvoríme div pre odpovede
    const answersDiv: HTMLDivElement = document.createElement("div");

    // Pre každú otázku vytvoríme 4 možné odpovede
    for (let i: number = 0; i < 4; i++) {
        const answer: Answer = question.answers[i];
        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";

        // Vytvoríme input pre text odpovede
        const answerInput: HTMLInputElement = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "Answer";
        answerInput.value = answer ? answer.text : "";
        answerInput.spellcheck = false; // Vypnutie kontrolu pravopisu

        // Vytvoríme nový objekt pre odpoveď v každej iterácii
        const newAnswer: Answer = {
            text: "",
            isCorrect: false,
        };

        // Vytvoríme checkbox pre označenie správnej odpovede
        const correctAnswerInput: HTMLInputElement = document.createElement("input");
        correctAnswerInput.type = "checkbox";
        correctAnswerInput.checked = answer ? answer.isCorrect : false;

        // Pridáme event listener na zmenu checkboxu pre označenie správnej odpovede
        correctAnswerInput.addEventListener("change", (e: Event) => {
            newAnswer.isCorrect = (e.target as HTMLInputElement).checked;
        });

        // Vytvoríme label pre označenie správnej odpovede
        const correctAnswerLabel: HTMLLabelElement = document.createElement("label");
        correctAnswerLabel.textContent = "Correct answer";

        // Pridáme všetky vytvorené prvky do odpovede
        answerDiv.appendChild(answerInput);

        const correctAnswerDiv: HTMLDivElement = document.createElement("div");
        correctAnswerDiv.classList.add("correctAnswerDiv");
        correctAnswerDiv.appendChild(correctAnswerLabel);
        correctAnswerDiv.appendChild(correctAnswerInput);
        answerDiv.appendChild(correctAnswerDiv);

        answersDiv.appendChild(answerDiv);

        // Pridáme novú odpoveď do zoznamu odpovedí pre otázku
        question.answers[i] = newAnswer;
    }

    // Vytvoríme prázdny riadok a horizontálnu čiaru pre oddelenie
    const brElement: HTMLBRElement = document.createElement("br");
    const hr: HTMLHRElement = document.createElement("hr");

    // Pridáme všetky vytvorené prvky do kontajnera pre otázky
    const testUpdateQuestionsContainer: HTMLDivElement = <HTMLDivElement>document.querySelector("div.test-update-questions");
    questionDivContainer.appendChild(questionLabel);
    questionDivContainer.appendChild(brElement);
    questionDivContainer.appendChild(questionInput);
    questionDivContainer.appendChild(hr);
    questionDivContainer.appendChild(answersDiv);
    questionDivContainer.appendChild(buttonToDelete);
    testUpdateQuestionsContainer.appendChild(questionDivContainer);
}
