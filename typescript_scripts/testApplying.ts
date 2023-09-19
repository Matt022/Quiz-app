// Importujeme potrebné moduly
import { getTestById } from "./dbService.js";
import { Test } from "../typescript_models/test.js";
import { CorrectAnswer } from '../typescript_models/correctAnswer';
import { getQuizIdFromURL } from "./helpers.js";
import { Answer } from "../typescript_models/answer.js";

// Získame ID testu z URL
const quizId: number | null = getQuizIdFromURL();

if (quizId != null) {
    // Načítame test s ID pomocou funkcie getTestById
    getTestById(quizId).then((test: Test | null) => {
        let saveCorrectAnswers: CorrectAnswer[] = [];

        // Funkcia na generovanie otázok a odpovedí z JSON
        function generateQuestionsAndAnswers(): void {
            // Získame odkaz na HTML formulár s id "test-form"
            const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;

            // Skontrolujeme, či sme načítali platný test
            if (test) {
                // Zachytenie ID spanu na vloženie názvu testu
                const testDetailName: HTMLSpanElement = <HTMLSpanElement>document.getElementById("testDetail");
                testDetailName.textContent = test.title;
                const correctAnswersInTest: CorrectAnswer[] = []; // Pole pre uchovávanie informácií o správnych odpovediach v teste

                // Prejdeme všetky otázky v teste
                for (let i: number = 0; i < test.questions.length; i++) {
                    // Vytvoríme kontajner pre otázku
                    const questionContainer: HTMLDivElement = document.createElement('div');
                    questionContainer.classList.add('question-container');

                    // Vytvoríme značku pre otázku
                    // vkladá sa tu názov otázky aj s iteračným číslom (1, 2, 3,...) - záleží podľa počtu otázok v teste
                    const questionText: HTMLLabelElement = document.createElement('label');
                    questionText.textContent = `${i + 1}. ${test.questions[i].text}`;

                    questionContainer.appendChild(questionText);

                    const correctAnswersForQuestion: CorrectAnswer[] = []; // Pole pre uchovávanie správnych odpovedí pre túto otázku

                    // -- kód pre inicializovanie a inkrementovanie správnych odpovedí
                    // kód slúži na to, aby sme uživateľovi neskôr dali vedieť, či je jedna správna odpoveď alebo viac ako jedna správna odpoveď 
                    let spravneOdpovedeCounter: number = 0;

                    test.questions[i].answers.forEach((answer: Answer) => {
                        if (answer.isCorrect) {
                            spravneOdpovedeCounter++;
                        }
                    });

                    // --

                    // Prejdeme všetky answers na otázku
                    for (let j: number = 0; j < test.questions[i].answers.length; j++) {
                        // Vytvoríme značku pre odpoveď a checkbox
                        const answerLabel: HTMLLabelElement = document.createElement('label');
                        const checkboxInput: HTMLInputElement = document.createElement('input');

                        // --
                        if (spravneOdpovedeCounter > 1) {
                            checkboxInput.type = 'checkbox';
                        } else {
                            checkboxInput.type = 'radio';
                        }

                        checkboxInput.name = `question-${i}`; // Jedinečný názov pre každú otázku
                        checkboxInput.value = j.toString(); // Použijeme hodnotu indexu answers ako hodnotu

                        // Ak je odpoveď správna, pridajte ju do poľa správnych odpovedí pre túto otázku
                        if (test.questions[i].answers[j].isCorrect) {
                            const correctAnsw: CorrectAnswer = {
                                question: i,
                                answer: j
                            };
                            correctAnswersForQuestion.push(correctAnsw);
                        }

                        answerLabel.appendChild(checkboxInput);
                        answerLabel.appendChild(document.createTextNode(test.questions[i].answers[j].text));

                        questionContainer.appendChild(answerLabel);
                    }

                    // Uložíme pole správnych odpovedí pre túto otázku do globálneho poľa
                    correctAnswersInTest.push(...correctAnswersForQuestion);

                    form.appendChild(questionContainer);
                }

                // Uložíme pole správnych odpovedí ako pole hodnôt na hodnotenie do funkcie, kde vykonávame hodnotenie
                saveCorrectAnswers = correctAnswersInTest;
            } else {
                // Presmerujeme na hlavnú stránku, ak test neexistuje
                window.location.href = "../index.html";
            }
        }

        // Spustíme generovanie otázok pre test s ID v URL-ke
        generateQuestionsAndAnswers();

        // Funkcia na výpočet percentuálneho hodnotenia a zobrazenie alertu
        function calculateAndShowResult(): void {
            const form: HTMLFormElement = document.getElementById('test-form') as HTMLFormElement;
            const totalQuestions: number = test!.questions.length; // Počet otázok v teste
            let correctAnswers: number = 0;

            // Získame pole správnych odpovedí zo dátového súboru
            const correctAnswersArray: CorrectAnswer[] = saveCorrectAnswers;

            // Prejdeme všetky otázky a zkontrolujeme správne answers
            // Cyklus prechádza všetky otázky v teste. totalQuestions je počet otázok v teste.
            for (let i: number = 0; i < totalQuestions; i++) {
                /* Pomocou tejto časti kódu získavame zoznam označených odpovedí pre aktuálnu otázku. 
                Používame querySelectorAll na nájdenie všetkých zaškrtnutých (checked) inputov s názvom question-i, 
                kde i je index aktuálnej otázky. */
                const selectedAnswers: NodeListOf<HTMLInputElement> = form.querySelectorAll(`input[name="question-${i}"]:checked`);

                /* 
                    Tu sa vytvára pole correctAnswersForQuestion, ktoré obsahuje len správne answers pre aktuálnu otázku. 
                    Používame metódu filter na filtrovanie prvkov z poľa correctAnswersArray, kde answer.question === i znamená, 
                    že vyberáme iba tie správne answers, ktoré patria k aktuálnej otázke i.
                */
                const correctAnswersForQuestion: CorrectAnswer[] = correctAnswersArray.filter((answer: CorrectAnswer) => answer.question === i);

                // Získame počet označených správnych odpovedí
                /*
                    Tu sa počíta, koľko označených odpovedí pre aktuálnu otázku je správnych. 
                    Používame Array.from(selectedAnswers) na prevod NodeList označených odpovedí na pole, a potom aplikujeme filter na vyfiltrovanie tých, ktoré sú správne. 
                    Pomocou some kontrolujeme, či aktuálna označená odpoveď (selectedAnswer.value) sa zhoduje s nejakou správnou odpoveďou pre túto otázku (correctAnswersForQuestion).
                */
                const selectedCorrectAnswers: number = Array.from(selectedAnswers)
                    .filter(selectedAnswer => correctAnswersForQuestion.some(correctAnswer => correctAnswer.answer === parseInt(selectedAnswer.value))).length;

                // Ak boli všetky správne answers označené a neboli označené nadbytočné answers, pridáme bod
                /* Tu sa kontroluje, či počet označených správnych odpovedí pre aktuálnu otázku sa zhoduje s celkovým počtom správnych odpovedí pre túto otázku (correctAnswersForQuestion.length) 
                a či počet označených odpovedí sa zhoduje s celkovým počtom odpovedí pre túto otázku (selectedAnswers.length). 
                Ak áno, znamená to, že všetky správne answers boli označené, a preto sa pridá bod k počtu správnych odpovedí (correctAnswers). */

                if (selectedCorrectAnswers === correctAnswersForQuestion.length && selectedAnswers.length === correctAnswersForQuestion.length) {
                    correctAnswers++;
                }
            }

            // Vypočítame percentuálne hodnotenie a zobrazíme ho v upozornení
            const scorePercentage: number = (correctAnswers / totalQuestions) * 100;
            alert(`Váš výsledok je ${scorePercentage.toFixed(2)}%`);
            // resetujeme formulár
            form.reset();
        }

        // Pridáme funkciu pre odoslanie testu na tlačítko
        const submitButton: HTMLButtonElement = document.getElementById('submit-button') as HTMLButtonElement;
        submitButton.addEventListener('click', calculateAndShowResult);
    });
} else {
    // Presmerujeme na hlavnú stránku, ak chýba ID testu v URL-ke
    window.location.href = "../index.html";
}