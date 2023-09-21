import { deleteTest, getTestById, updateTest } from "../../typescript_scripts/dbService.js";
import { HelperClass } from '../../typescript_scripts/helpers.js';
const helperClass = new HelperClass();
const testUpdateQuestionsContainer = document.querySelector("div.test-update-questions");
const deleteTestBtn = document.querySelector("button.deleteTest");
const editTestBtn = document.querySelector("button.editTest");
const disableChangesBtn = document.querySelector("button.disableChanges");
const saveBtn = document.querySelector("#save");
const addQuestionButton = document.getElementById("add-question");
const testId = helperClass.getQuizIdFromURL();
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
            deleteTestBtn.addEventListener("click", () => {
                if (testId != null && confirm("Do you really want to delete this test?")) {
                    deleteTest(testId).then(() => {
                        alert("Test was deleted successfully");
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
                    const titleInput = document.getElementById("title");
                    test.title = titleInput.textContent;
                    test.questions = helperClass.getData("update");
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
                    updateTest(test.id, test).then(() => {
                        alert("Test was updated.");
                    });
                });
            });
            disableChangesBtn.addEventListener("click", () => {
                document.location.reload();
            });
            function renderQuestionElements(question, index) {
                // Vytvoríme kontajnerový div pre otázku
                const questionDivContainer = document.createElement("div");
                questionDivContainer.className = "question";
                // Vytvoríme label pre označenie otázky
                const questionLabel = document.createElement("label");
                questionLabel.textContent = `Question ${index + 1}:`;
                // Vytvoríme input pre text otázky
                const questionInput = document.createElement("input");
                questionInput.type = "text";
                questionInput.value = question.text;
                questionInput.placeholder = "Question";
                questionInput.spellcheck = false; // Vypnutie kontrolu pravopisu
                // Pridáme event listener na input, aby sme mohli aktualizovať text otázky v objekte otázky
                questionInput.addEventListener("input", (e) => {
                    question.text = e.target.value;
                });
                // Vytvoríme tlačidlo pre odstránenie otázky
                const buttonToDelete = document.createElement("button");
                buttonToDelete.textContent = "Delete";
                // Pridáme event listener na tlačidlo pre odstránenie otázky
                buttonToDelete.addEventListener("click", () => {
                    if (confirm("Do you really want to delete this question?")) {
                        // Získame kontajner otázok a odstránime aktuálnu otázku z neho
                        questionDivContainer.remove();
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
                    answerInput.spellcheck = false; // Vypnutie kontrolu pravopisu
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
                // Pridáme všetky vytvorené prvky do kontajnera pre otázky
                questionDivContainer.appendChild(questionLabel);
                questionDivContainer.appendChild(brElement);
                questionDivContainer.appendChild(questionInput);
                questionDivContainer.appendChild(hr);
                questionDivContainer.appendChild(answersDiv);
                questionDivContainer.appendChild(buttonToDelete);
                testUpdateQuestionsContainer.appendChild(questionDivContainer);
            }
            // Táto funkcia aktualizuje čísla otázok v zobrazení kvízových otázok.
            function updateQuestionNumbers() {
                // Získaj všetky kontajnery pre otázky v kvíze.
                const questionContainers = testUpdateQuestionsContainer.querySelectorAll('.question');
                // Prejdi všetky kontajnery pre otázky a aktualizuj ich čísla.
                for (let i = 0; i < questionContainers.length; i++) {
                    // Získaj referenciu na label element pre otázku.
                    const label = questionContainers[i].querySelector('label');
                    // Skontroluj, či bol label nájdený.
                    if (label) {
                        // Aktualizuj text labelu na základe aktuálnej pozície otázky.
                        label.textContent = `Question ${i + 1}:`;
                    }
                }
            }
        }
        else {
            window.location.href = "/admin/pages/allTests.html";
        }
    });
}
else {
    window.location.href = "/admin/pages/allTests.html";
}
