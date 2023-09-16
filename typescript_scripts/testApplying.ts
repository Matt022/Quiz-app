// Importujeme potrebné moduly
import { getTestById } from "./dbService.js";
import { Test } from "../typescript_models/test.js";
import { CorrectAnswer } from '../typescript_models/correctAnswer';

// Načítame test s ID 0 pomocou funkcie getTestById
getTestById(0).then((test: Test | null) => {
    // Funkcia na generovanie otázok a odpovedí z JSON
    function generateQuestionsAndAnswers(): void {
        // Uložíme načítaný test do premennej testHere
        const testHere: Test | null = test;
        // Získame odkaz na HTML formulár s id "test-form"
        const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;

        // Skontrolujeme, či sme načítali platný test
        if (testHere) {
            const correctAnswers: CorrectAnswer[] = []; // Pole pre uchovávanie informácií o správnych odpovediach

            // Prejdeme všetky otázky v teste
            for (let i: number = 0; i < testHere.otazky.length; i++) {
                // Vytvoríme kontajner pre otázku
                const questionContainer: HTMLDivElement = document.createElement('div');
                questionContainer.classList.add('question-container');

                // Vytvoríme značku pre otázku
                const questionText: HTMLLabelElement = document.createElement('label');
                questionText.textContent = `${i + 1}. ${testHere.otazky[i].text}`;

                questionContainer.appendChild(questionText);

                // Prejdeme všetky odpovede na otázku
                for (let j: number = 0; j < testHere.otazky[i].odpovede.length; j++) {
                    // Vytvoríme značku pre odpoveď a radio tlačidlo
                    const answerLabel: HTMLLabelElement = document.createElement('label');
                    const radioInput: HTMLInputElement = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = `question-${i}`; // Jedinečný názov pre každú otázku
                    radioInput.value = j.toString(); // Použijeme hodnotu indexu odpovede ako hodnotu

                    // Ak je odpoveď správna, pridajte ju do poľa správnych odpovedí
                    if (testHere.otazky[i].odpovede[j].jeSpravna) {
                        const correctAnsw: CorrectAnswer = {
                            question: i,
                            answer: j
                        };
                        correctAnswers.push(correctAnsw);
                    }

                    answerLabel.appendChild(radioInput);
                    answerLabel.appendChild(document.createTextNode(testHere.otazky[i].odpovede[j].text));

                    questionContainer.appendChild(answerLabel);
                }

                form.appendChild(questionContainer);
            }

            // Uložíme pole správnych odpovedí ako atribút dátového súboru
            form.dataset.correctAnswers = JSON.stringify(correctAnswers);
        }
    }

    // Spustíme generovanie otázok pre test s ID 0
    generateQuestionsAndAnswers();

    // Funkcia na výpočet percentuálneho hodnotenia a zobrazenie alertu
    function calculateAndShowResult(): void {
        const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;
        const totalQuestions: number = test!.otazky.length; // Počet otázok v teste
        let correctAnswers: number = 0;

        // Získame pole správnych odpovedí zo dátového súboru
        const correctAnswersArray = JSON.parse(form.dataset.correctAnswers || '[]');

        // Prejdeme všetky otázky a zkontrolujeme správne odpovede
        for (let i: number = 0; i < totalQuestions; i++) {
            const selectedAnswer: HTMLInputElement = <HTMLInputElement>form.querySelector(`input[name="question-${i}"]:checked`);
            if (selectedAnswer && correctAnswersArray.some((answer: any) => answer.question === i && answer.answer === parseInt(selectedAnswer.value))) {
                correctAnswers++;
            }
        }

        // Vypočítame percentuálne hodnotenie a zobrazíme ho v upozornení
        const scorePercentage: number = (correctAnswers / totalQuestions) * 100;
        alert(`Váš výsledok je ${scorePercentage.toFixed(2)}%`);
    }

    // Pridáme funkciu pre odoslanie testu na tlačítko
    const submitButton: HTMLButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
    submitButton.addEventListener('click', calculateAndShowResult);
});
