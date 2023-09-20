import { addTest } from "../../typescript_scripts/dbService.js";
import { HelperClass } from "../../typescript_scripts/helpers.js";
const helperClass = new HelperClass();
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
saveBtn.addEventListener("click", () => {
    // Získáme hodnotu názvu testu z inputu
    const testTitleInput = document.getElementById("title");
    test.title = testTitleInput.value;
    test.questions = helperClass.getData("create");
    const isAnyQuestionNameEmpty = test.questions.some((question) => question.answers.some((answer) => answer.text === ""));
    const isAnyAnswerMarked = test.questions.some((question) => question.answers.every((answer) => answer.isCorrect === false));
    if (test.title === "") {
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
    // Vytvoríme nový div element pre otázku
    const questionDiv = document.createElement("div");
    questionDiv.className = "question"; // Nastavíme triedu pre štýlovanie
    // Vytvoríme label pre označenie otázky
    const questionLabel = document.createElement("label");
    questionLabel.textContent = `Question ${index + 1}:`;
    // Vytvoríme input element pre text otázky
    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.value = question.text;
    questionInput.placeholder = "Question";
    questionInput.spellcheck = false;
    // Pridáme event listener na input, aby sme mohli aktualizovať text otázky v objekte otázky
    questionInput.addEventListener("input", (e) => {
        question.text = e.target.value;
    });
    // Vytvoríme tlačidlo pre odstránenie otázky
    const buttonToDeleteQuestion = document.createElement("button");
    buttonToDeleteQuestion.classList.add("deleteButton");
    buttonToDeleteQuestion.textContent = "Delete question";
    // Pridáme event listener, aby sme mohli otázku odstrániť
    buttonToDeleteQuestion.addEventListener("click", () => {
        if (confirm("Do you really want to delete this question?")) {
            questionDiv.remove();
            test.questions.splice(index, 1); // Odstránime otázku zo zoznamu otázok
            updateQuestionNumbers();
        }
    });
    // Vytvoríme div pre odpovede
    const answersDiv = document.createElement("div");
    // Pre každú otázku vytvoríme 4 možné odpovede
    for (let i = 0; i < 4; i++) {
        const answer = question.answers[i];
        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";
        // Vytvoríme input pre text odpovede
        const answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "Answer";
        answerInput.value = answer ? answer.text : "";
        answerInput.spellcheck = false;
        // Vytvoríme nový objekt pre odpoveď v každej iterácii
        const newAnswer = {
            text: "",
            isCorrect: false,
        };
        // Vytvoríme checkbox pre označenie správnej odpovede
        const correctAnswerInput = document.createElement("input");
        correctAnswerInput.type = "checkbox";
        correctAnswerInput.checked = answer ? answer.isCorrect : false;
        // Pridáme event listener na zmenu checkboxu pre označenie správnej odpovede
        correctAnswerInput.addEventListener("change", (e) => {
            newAnswer.isCorrect = e.target.checked;
        });
        // Vytvoríme label pre označenie správnej odpovede
        const correctAnswerLabel = document.createElement("label");
        correctAnswerLabel.textContent = "Correct answer";
        // Pridáme všetky vytvorené prvky do odpovede
        answerDiv.appendChild(answerInput);
        const correctAnswerDiv = document.createElement("div");
        correctAnswerDiv.classList.add("correctAnswerDiv");
        correctAnswerDiv.appendChild(correctAnswerLabel);
        correctAnswerDiv.appendChild(correctAnswerInput);
        answerDiv.appendChild(correctAnswerDiv);
        answersDiv.appendChild(answerDiv);
        // Pridáme novú odpoveď do zoznamu odpovedí pre otázku
        question.answers[i] = newAnswer;
    }
    // Vytvoríme prázdny riadok a horizontálnu čiaru pre oddelenie
    const brElement = document.createElement("br");
    const hr = document.createElement("hr");
    // Pridáme všetky vytvorené prvky do divu otázky
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(brElement);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(hr);
    questionDiv.appendChild(answersDiv);
    questionDiv.appendChild(buttonToDeleteQuestion);
    // Pridáme div otázky do kontajnera pre otázky
    questionContainerDiv.appendChild(questionDiv);
}
// Funkcia na aktualizáciu čísel otázok
function updateQuestionNumbers() {
    const questionContainers = questionContainerDiv.querySelectorAll('.question');
    for (let i = 0; i < questionContainers.length; i++) {
        const label = questionContainers[i].querySelector('label');
        if (label) {
            label.textContent = `Question ${i + 1}:`;
        }
    }
}
