export class HelperClass {
    // Funkcia pre získanie ID z URL
    getQuizIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const quizIdString = urlParams.get("id");
        if (quizIdString) {
            const quizId = parseInt(quizIdString, 10);
            if (!isNaN(quizId)) {
                return quizId;
            }
        }
        return null;
    }
    getData(createOrUpdate) {
        // Získáme zoznam všetkých otázok
        let questionDivContainers;
        if (createOrUpdate === "update") {
            questionDivContainers = document.querySelectorAll("div.test-update-questions div.question");
        }
        else {
            questionDivContainers = document.querySelectorAll("div.question");
        }
        // Vytvorme pole pre otázky
        const questions = [];
        // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
        for (let i = 0; i < questionDivContainers.length; i++) {
            const question = {
                text: "",
                answers: [],
            };
            // získame znenie otázky a priradíme do vytvoreného objektu
            const questionInput = questionDivContainers[i].querySelector("input[type='text']");
            question.text = questionInput.value;
            // všetky answers a k nim správne answers
            // správne answers zistíme vo for cykle nižšie
            const allAnswersInputs = questionDivContainers[i].querySelectorAll(".answer input[type='text']");
            const correctAnswersInputs = questionDivContainers[i].querySelectorAll(".answer input[type='checkbox']");
            for (let j = 0; j < allAnswersInputs.length; j++) {
                const answer = {
                    text: allAnswersInputs[j].value,
                    isCorrect: correctAnswersInputs[j].checked,
                };
                question.answers.push(answer);
            }
            questions.push(question);
        }
        return questions;
    }
}
