import { addTest } from "../../typescript_scripts/dbService.js";
import { getData } from "../../typescript_scripts/helpers.js";
const test = {
    id: 0,
    title: "",
    questions: [],
};
const questionContainerDiv = document.getElementById("questions-container");
const saveBtn = document.querySelector("#save");
const addQuestionButton = document.getElementById("add-question");
addQuestionButton.addEventListener("click", () => {
    addQuestion();
});
function addQuestion() {
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
}
addQuestion();
function renderQuestionElements(question, index) {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    const questionLabel = document.createElement("label");
    questionLabel.textContent = `Question ${index + 1}:`;
    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.value = question.text;
    questionInput.placeholder = "Question wording";
    questionInput.addEventListener("input", (e) => {
        question.text = e.target.value;
    });
    const buttonToDeleteQuestion = document.createElement("button");
    buttonToDeleteQuestion.classList.add("deleteButton");
    buttonToDeleteQuestion.textContent = "Delete question";
    buttonToDeleteQuestion.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            const questionContainer = document.querySelector("div#questions-container");
            questionContainer.removeChild(questionDiv);
            test.questions.splice(index);
        }
    });
    const answersDiv = document.createElement("div");
    // každá otázka má 4 odpovede
    for (let i = 0; i < 4; i++) {
        const answer = question.answers[i];
        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";
        const answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "Answer";
        answerInput.value = answer ? answer.text : "";
        // Vytvorme nový objekt answers v každej iterácii
        const newAnswer = {
            text: "",
            isCorrect: false,
        };
        const spravnaOdpovedInput = document.createElement("input");
        spravnaOdpovedInput.type = "checkbox";
        spravnaOdpovedInput.checked = answer ? answer.isCorrect : false;
        spravnaOdpovedInput.addEventListener("change", (e) => {
            newAnswer.isCorrect = e.target.checked;
        });
        const correctAnswerLabel = document.createElement("label");
        correctAnswerLabel.textContent = "Correct answer";
        answerDiv.appendChild(answerInput);
        const correctAnswerDiv = document.createElement("div");
        correctAnswerDiv.classList.add("correctAnswerDiv");
        correctAnswerDiv.appendChild(correctAnswerLabel);
        correctAnswerDiv.appendChild(spravnaOdpovedInput);
        answerDiv.appendChild(correctAnswerDiv);
        answersDiv.appendChild(answerDiv);
        question.answers[i] = newAnswer;
    }
    const brElement = document.createElement("br");
    const hr = document.createElement("hr");
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
    const nazovInput = document.getElementById("title");
    test.title = nazovInput.value;
    test.questions = getData();
    const isAnyQuestionNameEmpty = test.questions.some((question) => question.answers.some((answer) => answer.text === ""));
    if (isAnyQuestionNameEmpty) {
        alert("Vyplňte všetky otázky");
        return;
    }
    addTest(test).then(() => {
        alert("Test was added to database.");
    });
});
