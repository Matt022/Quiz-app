// Funkcia pre získanie ID z URL
export function getQuizIdFromURL() {
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
export function getData() {
    // Získáme seznam všech otázek
    const otazkyDivs = document.querySelectorAll(".question");
    // Vytvorme pole pre otázky
    const questions = [];
    // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
    for (let i = 0; i < otazkyDivs.length; i++) {
        const question = {
            text: "",
            answers: [],
        };
        // získame znenie otázky a priradíme do vytvoreného objektu
        const otazkaInput = otazkyDivs[i].querySelector("input[type='text']");
        question.text = otazkaInput.value;
        // všetky answers a k nim správne answers
        // správne answers zistíme vo for cykle nižšie
        const odpovedeInputs = otazkyDivs[i].querySelectorAll(".answer input[type='text']");
        const spravneInputs = otazkyDivs[i].querySelectorAll(".answer input[type='checkbox']");
        for (let j = 0; j < odpovedeInputs.length; j++) {
            const answer = {
                text: odpovedeInputs[j].value,
                isCorrect: spravneInputs[j].checked,
            };
            question.answers.push(answer);
        }
        questions.push(question);
    }
    return questions;
}
