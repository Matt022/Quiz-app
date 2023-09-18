import { deleteTest, getTestById } from "./dbService.js";
import { getQuizIdFromURL } from "./helpers.js";
const deleteTestBtn = document.querySelector("button.deleteTest");
const testId = getQuizIdFromURL();
if (testId != null) {
    getTestById(testId).then((test) => {
        if (test) {
            const testNameElement = document.getElementById("testName");
            testNameElement.textContent = test.nazov;
            const questionsContainer = document.getElementById("questions");
            for (let i = 0; i < test.otazky.length; i++) {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");
                const questionText = document.createElement("p");
                questionText.classList.add("question-text");
                questionText.textContent = `Question ${i + 1}.: ${test.otazky[i].text}`;
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
