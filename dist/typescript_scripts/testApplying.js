// Importujeme potrebné moduly
import { getTestById } from "./dbService.js";
import { getQuizIdFromURL } from "./helpers.js";
const quizId = getQuizIdFromURL();
if (quizId != null) {
    // Načítame test s ID pomocou funkcie getTestById
    getTestById(quizId).then((test) => {
        let saveCorrectAnswers = [];
        // Funkcia na generovanie otázok a odpovedí z JSON
        function generateQuestionsAndAnswers() {
            // Uložíme načítaný test do premennej testHere
            const testHere = test;
            // Získame odkaz na HTML formulár s id "test-form"
            const form = document.getElementById('test-form');
            // Skontrolujeme, či sme načítali platný test
            if (testHere) {
                const correctAnswers = []; // Pole pre uchovávanie informácií o správnych odpovediach
                // Prejdeme všetky otázky v teste
                for (let i = 0; i < testHere.otazky.length; i++) {
                    // Vytvoríme kontajner pre otázku
                    const questionContainer = document.createElement('div');
                    questionContainer.classList.add('question-container');
                    // Vytvoríme značku pre otázku
                    const questionText = document.createElement('label');
                    questionText.textContent = `${i + 1}. ${testHere.otazky[i].text}`;
                    questionContainer.appendChild(questionText);
                    const correctAnswersForQuestion = []; // Pole pre uchovávanie správnych odpovedí pre túto otázku
                    let spravneOdpovedeCounter = 0;
                    testHere.otazky[i].odpovede.forEach((odpoved) => {
                        if (odpoved.jeSpravna) {
                            spravneOdpovedeCounter++;
                        }
                    });
                    // Prejdeme všetky odpovede na otázku
                    for (let j = 0; j < testHere.otazky[i].odpovede.length; j++) {
                        // Vytvoríme značku pre odpoveď a checkbox
                        const answerLabel = document.createElement('label');
                        const checkboxInput = document.createElement('input');
                        if (spravneOdpovedeCounter > 1) {
                            checkboxInput.type = 'checkbox';
                        }
                        else {
                            checkboxInput.type = 'radio';
                        }
                        checkboxInput.name = `question-${i}`; // Jedinečný názov pre každú otázku
                        checkboxInput.value = j.toString(); // Použijeme hodnotu indexu odpovede ako hodnotu
                        // Ak je odpoveď správna, pridajte ju do poľa správnych odpovedí pre túto otázku
                        if (testHere.otazky[i].odpovede[j].jeSpravna) {
                            const correctAnsw = {
                                question: i,
                                answer: j
                            };
                            correctAnswersForQuestion.push(correctAnsw);
                        }
                        answerLabel.appendChild(checkboxInput);
                        answerLabel.appendChild(document.createTextNode(testHere.otazky[i].odpovede[j].text));
                        questionContainer.appendChild(answerLabel);
                    }
                    // Uložíme pole správnych odpovedí pre túto otázku do globálneho poľa
                    correctAnswers.push(...correctAnswersForQuestion);
                    form.appendChild(questionContainer);
                }
                // Uložíme pole správnych odpovedí ako pole hodnôt
                saveCorrectAnswers = correctAnswers;
            }
            else {
                window.location.href = "../index.html";
            }
        }
        // Spustíme generovanie otázok pre test s ID v URL-ke
        generateQuestionsAndAnswers();
        // Funkcia na výpočet percentuálneho hodnotenia a zobrazenie alertu
        function calculateAndShowResult() {
            const form = document.getElementById('test-form');
            const totalQuestions = test.otazky.length; // Počet otázok v teste
            let correctAnswers = 0;
            // Získame pole správnych odpovedí zo dátového súboru
            const correctAnswersArray = saveCorrectAnswers;
            // Prejdeme všetky otázky a zkontrolujeme správne odpovede
            for (let i = 0; i < totalQuestions; i++) {
                const selectedAnswers = form.querySelectorAll(`input[name="question-${i}"]:checked`);
                const correctAnswersForQuestion = correctAnswersArray.filter((answer) => answer.question === i);
                // Získame počet označených správnych odpovedí
                const selectedCorrectAnswers = Array.from(selectedAnswers)
                    .filter(selectedAnswer => correctAnswersForQuestion.some(correctAnswer => correctAnswer.answer === parseInt(selectedAnswer.value))).length;
                // Ak boli všetky správne odpovede označené a neboli označené nadbytočné odpovede, pridáme bod
                if (selectedCorrectAnswers === correctAnswersForQuestion.length && selectedAnswers.length === correctAnswersForQuestion.length) {
                    correctAnswers++;
                }
            }
            // Vypočítame percentuálne hodnotenie a zobrazíme ho v upozornení
            const scorePercentage = (correctAnswers / totalQuestions) * 100;
            alert(`Váš výsledok je ${scorePercentage.toFixed(2)}%`);
            form.reset();
        }
        // Pridáme funkciu pre odoslanie testu na tlačítko
        const submitButton = document.getElementById('submit-button');
        submitButton.addEventListener('click', calculateAndShowResult);
    });
}
else {
    window.location.href = "../index.html";
}
