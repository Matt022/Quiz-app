import { Odpoved } from '../typescript_models/odpoved';
import { Otazka } from "../typescript_models/otazka";
import { Test } from "../typescript_models/test";

// Funkcia pre získanie ID z URL
export function getQuizIdFromURL(): number | null {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const quizIdString: string | null = urlParams.get("id");

    if (quizIdString) {
        const quizId: number = parseInt(quizIdString, 10);
        if (!isNaN(quizId)) {
            return quizId;
        }
    }

    return null;
}

export function getData(): Otazka[] {
    // Získáme seznam všech otázek
    const otazkyDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll(".otazka");

    // Vytvorme pole pre otázky
    const otazky: Otazka[] = [];

    // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
    for (let i: number = 0; i < otazkyDivs.length; i++) {
        const otazka: Otazka = {
            text: "",
            odpovede: [],
        };

        // získame znenie otázky a priradíme do vytvoreného objektu
        const otazkaInput: HTMLInputElement = <HTMLInputElement>otazkyDivs[i].querySelector("input[type='text']");
        otazka.text = otazkaInput.value;

        // všetky odpovede a k nim správne odpovede
        // správne odpovede zistíme vo for cykle nižšie
        const odpovedeInputs: NodeListOf<HTMLInputElement> = otazkyDivs[i].querySelectorAll(".odpoved input[type='text']");
        const spravneInputs: NodeListOf<HTMLInputElement> = otazkyDivs[i].querySelectorAll(".odpoved input[type='checkbox']");

        for (let j: number = 0; j < odpovedeInputs.length; j++) {
            const odpoved: Odpoved = {
                text: odpovedeInputs[j].value,
                jeSpravna: spravneInputs[j].checked,
            };
            otazka.odpovede.push(odpoved);
        }

        otazky.push(otazka);
    }

    return otazky;
}