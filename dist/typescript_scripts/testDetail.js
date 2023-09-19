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
            const testNameElement = document.getElementById("nazov");
            testNameElement.textContent = test.nazov;
            const questionsContainer = document.getElementById("questions");
            for (let i = 0; i < test.otazky.length; i++) {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                const questionText = document.createElement("p");
                questionText.classList.add("question-text");
                questionText.textContent = `Question ${i + 1}: ${test.otazky[i].text}`;
                const answersDiv = document.createElement("div");
                answersDiv.classList.add("answers");
                test.otazky[i].odpovede.forEach((odpoved) => {
                    const answerDiv = document.createElement("div");
                    answerDiv.classList.add("answer");
                    const answerText = document.createElement("p");
                    answerText.textContent = odpoved.text;
                    if (odpoved.jeSpravna) {
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
    const testNameElement = document.getElementById("nazov");
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
            for (let i = 0; i < test.otazky.length; i++) {
                renderOtazka(test.otazky[i], i);
            }
            addQuestionButton.addEventListener("click", () => {
                const otazka = {
                    text: "",
                    odpovede: [
                        { text: "", jeSpravna: false },
                        { text: "", jeSpravna: false },
                        { text: "", jeSpravna: false },
                        { text: "", jeSpravna: false }
                    ],
                };
                test.otazky.push(otazka);
                renderOtazka(otazka, test.otazky.length - 1);
            });
            saveBtn.addEventListener("click", () => {
                // Získáme hodnotu názvu testu z inputu
                const nazovInput = document.getElementById("nazov");
                test.nazov = nazovInput.textContent;
                test.otazky = getData();
                updateTest(test.id, test).then(() => {
                    alert("Test was added to database.");
                });
            });
        }
    });
});
disableChangesBtn.addEventListener("click", () => {
    const testNameElement = document.getElementById("nazov");
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
function renderOtazka(otazka, index) {
    const otazkaDiv = document.createElement("div");
    otazkaDiv.className = "otazka";
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
    otazkaInput.value = otazka.text;
    otazkaInput.placeholder = "Znenie otázky";
    otazkaInput.addEventListener("input", (e) => {
        otazka.text = e.target.value;
    });
    const odpovedeDiv = document.createElement("div");
    // každá otázka má 4 odpovede
    for (let i = 0; i < 4; i++) {
        const odpoved = otazka.odpovede[i];
        const odpovedDiv = document.createElement("div");
        odpovedDiv.className = "odpoved";
        const odpovedInput = document.createElement("input");
        odpovedInput.type = "text";
        odpovedInput.placeholder = "Odpoved";
        odpovedInput.value = odpoved ? odpoved.text : "";
        // Vytvorme nový objekt odpovede v každej iterácii
        const novaOdpoved = {
            text: "",
            jeSpravna: false,
        };
        const spravnaOdpovedInput = document.createElement("input");
        spravnaOdpovedInput.type = "checkbox";
        spravnaOdpovedInput.checked = odpoved ? odpoved.jeSpravna : false;
        // Vytvorme dočasnú premennú pre aktuálnu hodnotu i
        const currentI = i;
        spravnaOdpovedInput.addEventListener("change", (e) => {
            novaOdpoved.jeSpravna = e.target.checked;
        });
        const spravnaOdpovedLabel = document.createElement("label");
        spravnaOdpovedLabel.textContent = "Correct answer";
        odpovedDiv.appendChild(odpovedInput);
        const spravnaOdpovedDiv = document.createElement("div");
        spravnaOdpovedDiv.classList.add("spravnaOdpovedDiv");
        spravnaOdpovedDiv.appendChild(spravnaOdpovedLabel);
        spravnaOdpovedDiv.appendChild(spravnaOdpovedInput);
        odpovedDiv.appendChild(spravnaOdpovedDiv);
        odpovedeDiv.appendChild(odpovedDiv);
        otazka.odpovede[currentI] = novaOdpoved;
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
