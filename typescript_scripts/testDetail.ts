import { Odpoved } from "../typescript_models/odpoved";
import { Test } from "../typescript_models/test";
import { deleteTest, getTestById } from "./dbService.js";
import { getQuizIdFromURL } from "./helpers.js";

const deleteTestBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.deleteTest");
const editTestBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.editTest");
const disableChangesBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button.disableChanges");

const testId: number | null = getQuizIdFromURL();
if (testId != null) {
    getTestById(testId).then((test: Test | null) => {
        if (test) {
            const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("testName");
            testNameElement.textContent = test.nazov;

            const questionsContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");

            for (let i: number = 0; i < test.otazky.length; i++) {
                const questionDiv: HTMLDivElement = document.createElement("div");
                questionDiv.classList.add("question");
                
                const questionText: HTMLParagraphElement = document.createElement("p");
                questionText.classList.add("question-text");
                questionText.textContent = `Question ${i + 1}: ${test.otazky[i].text}`;
                
                const answersDiv: HTMLDivElement = document.createElement("div");
                answersDiv.classList.add("answers");
                
                test.otazky[i].odpovede.forEach((odpoved: Odpoved) => {
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
    const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("testName");
    testNameElement.contentEditable = "true";
    
    const questionsDivEl: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");
    questionsDivEl.style.display = "none";
    editTestBtn.style.display = "none";
    disableChangesBtn.style.display = "inline-block";
});

disableChangesBtn.addEventListener("click", () => {
    const testNameElement: HTMLSpanElement = <HTMLSpanElement>document.getElementById("testName");
    testNameElement.contentEditable = "false";

    const questionsDivEl: HTMLDivElement = <HTMLDivElement>document.getElementById("questions");
    questionsDivEl.style.display = "block";
    editTestBtn.style.display = "inline-block";
    disableChangesBtn.style.display = "none";
});