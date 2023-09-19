import { deleteTest, getTestById, updateTest } from "./dbService.js";
import { getData, getQuizIdFromURL } from "./helpers.js";
const deleteTestBtn = document.querySelector("button.deleteTest");
const editTestBtn = document.querySelector("button.editTest");
const disableChangesBtn = document.querySelector("button.disableChanges");
const saveBtn = document.querySelector("#save");
const addQuestionButton = document.getElementById("add-question");
const testId = getQuizIdFromURL();
if (testId != null) {
    getTestById(testId).then((test) => {
        if (test) {
            const testNameElement = document.getElementById("title");
            testNameElement.textContent = test.title;
            const questionsContainer = document.getElementById("questions");
            for (let i = 0; i < test.questions.length; i++) {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                const questionText = document.createElement("p");
                questionText.classList.add("question-text");
                questionText.textContent = `Question ${i + 1}: ${test.questions[i].text}`;
                const answersDiv = document.createElement("div");
                answersDiv.classList.add("answers");
                test.questions[i].answers.forEach((answer) => {
                    const answerDiv = document.createElement("div");
                    answerDiv.classList.add("answer");
                    const answerText = document.createElement("p");
                    answerText.textContent = answer.text;
                    if (answer.isCorrect) {
                        answerText.classList.add("correct-answer");
                    }
                    else {
                        answerText.classList.add("incorrect-answer");
                    }
                    answerDiv.appendChild(answerText);
                    answersDiv.appendChild(answerDiv);
                });
                questionDiv.appendChild(questionText);
                questionDiv.appendChild(answersDiv);
                questionsContainer.appendChild(questionDiv);
            }
        }
        else {
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
    const testNameElement = document.getElementById("title");
    testNameElement.contentEditable = "true";
    const questionsDivEl = document.getElementById("questions");
    questionsDivEl.style.display = "none";
    const testUpdateQuestionsContainer = document.querySelector("div.test-update-questions");
    testUpdateQuestionsContainer.style.display = "block";
    editTestBtn.style.display = "none";
    disableChangesBtn.style.display = "inline-block";
    addQuestionButton.style.display = "inline-block";
    saveBtn.style.display = "inline-block";
    getTestById(testId).then((test) => {
        if (test) {
            for (let i = 0; i < test.questions.length; i++) {
                renderQuestionElements(test.questions[i], i);
            }
            addQuestionButton.addEventListener("click", () => {
                const question = {
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
                const nazovInput = document.getElementById("title");
                test.title = nazovInput.textContent;
                test.questions = getData();
                updateTest(test.id, test).then(() => {
                    alert("Test was added to database.");
                });
            });
        }
    });
});
disableChangesBtn.addEventListener("click", () => {
    const testNameElement = document.getElementById("title");
    testNameElement.contentEditable = "false";
    const questionsDivEl = document.getElementById("questions");
    questionsDivEl.style.display = "block";
    editTestBtn.style.display = "inline-block";
    disableChangesBtn.style.display = "none";
    addQuestionButton.style.display = "none";
    saveBtn.style.display = "none";
    const testUpdateQuestionsContainer = document.querySelector("div.test-update-questions");
    while (testUpdateQuestionsContainer.firstChild) {
        testUpdateQuestionsContainer.removeChild(testUpdateQuestionsContainer.firstChild);
    }
    testUpdateQuestionsContainer.style.display = "none";
});
function renderQuestionElements(question, index) {
    const otazkaDiv = document.createElement("div");
    otazkaDiv.className = "question";
    const otazkaLabel = document.createElement("label");
    otazkaLabel.textContent = `Question ${index + 1}:`;
    const buttonToDelete = document.createElement("button");
    buttonToDelete.textContent = "Delete";
    buttonToDelete.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            const testUpdateQuestionsContainer = document.querySelector("div.test-update-questions");
            testUpdateQuestionsContainer.removeChild(testUpdateQuestionsContainer.children[index]);
        }
    });
    const otazkaInput = document.createElement("input");
    otazkaInput.type = "text";
    otazkaInput.value = question.text;
    otazkaInput.placeholder = "Znenie otázky";
    otazkaInput.addEventListener("input", (e) => {
        question.text = e.target.value;
    });
    const odpovedeDiv = document.createElement("div");
    // každá otázka má presne 4 answers
    for (let i = 0; i < 4; i++) {
        const answer = question.answers[i];
        const odpovedDiv = document.createElement("div");
        odpovedDiv.className = "answer";
        const odpovedInput = document.createElement("input");
        odpovedInput.type = "text";
        odpovedInput.placeholder = "Odpoved";
        odpovedInput.value = answer ? answer.text : "";
        // Vytvorme nový objekt answers v každej iterácii
        const novaOdpoved = {
            text: "",
            isCorrect: false,
        };
        const spravnaOdpovedInput = document.createElement("input");
        spravnaOdpovedInput.type = "checkbox";
        spravnaOdpovedInput.checked = answer ? answer.isCorrect : false;
        spravnaOdpovedInput.addEventListener("change", (e) => {
            novaOdpoved.isCorrect = e.target.checked;
        });
        const spravnaOdpovedLabel = document.createElement("label");
        spravnaOdpovedLabel.textContent = "Correct answer";
        odpovedDiv.appendChild(odpovedInput);
        const correctAnswerDiv = document.createElement("div");
        correctAnswerDiv.classList.add("correctAnswerDiv");
        correctAnswerDiv.appendChild(spravnaOdpovedLabel);
        correctAnswerDiv.appendChild(spravnaOdpovedInput);
        odpovedDiv.appendChild(correctAnswerDiv);
        odpovedeDiv.appendChild(odpovedDiv);
        question.answers[i] = novaOdpoved;
    }
    const brElement = document.createElement("br");
    const hr = document.createElement("hr");
    otazkaDiv.appendChild(otazkaLabel);
    otazkaDiv.appendChild(brElement);
    otazkaDiv.appendChild(otazkaInput);
    otazkaDiv.appendChild(hr);
    otazkaDiv.appendChild(odpovedeDiv);
    otazkaDiv.appendChild(buttonToDelete);
    const testUpdateQuestionsContainer = document.querySelector("div.test-update-questions");
    testUpdateQuestionsContainer.appendChild(otazkaDiv);
}
