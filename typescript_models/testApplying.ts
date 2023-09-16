import { getTestById } from "../typescript_scripts/dbService.js";
import { Test } from "./test";

getTestById(0).then((test: Test | null) => {
    // Funkcia na generovanie otázok a odpovedí z JSON
    function generateQuestionsAndAnswers(): void {
        const testHere: Test | null = test;
        const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;

        if (testHere) {
            const correctAnswers = []; // Pole pre uchovávanie informácií o správnych odpovediach

            for (let i: number = 0; i < testHere.otazky.length; i++) {
                const questionContainer: HTMLDivElement = document.createElement('div');
                questionContainer.classList.add('question-container');

                const questionText: HTMLLabelElement = document.createElement('label');
                questionText.textContent = `${i + 1}. ${testHere.otazky[i].text}`;

                questionContainer.appendChild(questionText);

                for (let j: number = 0; j < testHere.otazky[i].odpovede.length; j++) {
                    const answerLabel: HTMLLabelElement = document.createElement('label');
                    const radioInput: HTMLInputElement = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = `question-${i + 1}`; // Jedinečný názov pre každú otázku
                    radioInput.value = j.toString(); // Použijeme hodnotu indexu odpovede ako hodnotu

                    // Ak je odpoveď správna, pridajte ju do poľa správnych odpovedí
                    if (testHere.otazky[i].odpovede[j].jeSpravna) {
                        correctAnswers.push({ question: i, answer: j });
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

    // Spustite generovanie otázok pre test s ID 0
    generateQuestionsAndAnswers();

    // Funkcia na výpočet percentuálneho hodnotenia a zobrazenie alertu
    function calculateAndShowResult(): void {
        const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;
        const totalQuestions: number = test!.otazky.length; // Počet otázok v teste
        let correctAnswers: number = 0;

        // Získame pole správnych odpovedí zo dátového súboru
        const correctAnswersArray = JSON.parse(form.dataset.correctAnswers || '[]');

        for (let i: number = 0; i < totalQuestions; i++) {
            const selectedAnswer: HTMLInputElement = <HTMLInputElement>form.querySelector(`input[name="question-${i}"]:checked`);
            if (selectedAnswer && correctAnswersArray.some((answer: any) => answer.question === i && answer.answer === parseInt(selectedAnswer.value))) {
                correctAnswers++;
            }
        }

        const scorePercentage: number = (correctAnswers / totalQuestions) * 100;
        alert(`Váš výsledok je ${scorePercentage.toFixed(2)}%`);
    }

    // Pridajte funkciu pre odoslanie testu na tlačítko
    const submitButton: HTMLButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
    submitButton.addEventListener('click', calculateAndShowResult);
});
