import { Odpoved } from "../../typescript_models/odpoved";
import { Otazka } from "../../typescript_models/otazka";
import { Test } from '../../typescript_models/test';
import { addTest } from "../../typescript_scripts/dbService.js";

const test: Test = {
    id: 0,
    nazov: "",
    otazky: [],
};

const otazkyContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("otazky-container");
const saveBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector("#save");
const addQuestionButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-question");
addQuestionButton.addEventListener("click", () => {
    addOtazka();
});

function addOtazka(): void {
    const otazka: Otazka = {
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
}

addOtazka()

function renderOtazka(otazka: Otazka, index: number): void {
    const otazkaDiv: HTMLDivElement = document.createElement("div");
    otazkaDiv.className = "otazka";

    const otazkaLabel: HTMLLabelElement = document.createElement("label");
    otazkaLabel.textContent = `Otázka ${index + 1}:`;

    const otazkaInput: HTMLInputElement = document.createElement("input");
    otazkaInput.type = "text";
    otazkaInput.value = otazka.text;
    otazkaInput.placeholder = "Znenie otázky"
    otazkaInput.addEventListener("input", (e: Event) => {
        otazka.text = (e.target as HTMLInputElement).value;
    });

    const odpovedeDiv: HTMLDivElement = document.createElement("div");

    for (let i: number = 0; i < 4; i++) {
        const odpoved: Odpoved = otazka.odpovede[i];
        const odpovedDiv = document.createElement("div");
        odpovedDiv.className = "odpoved";

        const odpovedInput: HTMLInputElement = document.createElement("input");
        odpovedInput.type = "text";
        odpovedInput.placeholder = "Odpoved"
        odpovedInput.value = odpoved ? odpoved.text : "";

        // Vytvorme nový objekt odpovede v každej iterácii
        const novaOdpoved: Odpoved = {
            text: "",
            jeSpravna: false,
        };

        const spravnaOdpovedInput: HTMLInputElement = document.createElement("input");
        spravnaOdpovedInput.type = "checkbox";
        spravnaOdpovedInput.checked = odpoved ? odpoved.jeSpravna : false;

        // Vytvorme dočasnú premennú pre aktuálnu hodnotu i
        const currentI: number = i;

        spravnaOdpovedInput.addEventListener("change", (e: Event) => {
            novaOdpoved.jeSpravna = (e.target as HTMLInputElement).checked;
        });

        const spravnaOdpovedLabel: HTMLLabelElement = document.createElement("label");
        spravnaOdpovedLabel.textContent = "Correct answer";

        odpovedDiv.appendChild(odpovedInput);
        
        const spravnaOdpovedDiv: HTMLDivElement = document.createElement("div");
        spravnaOdpovedDiv.classList.add("spravnaOdpovedDiv");
        spravnaOdpovedDiv.appendChild(spravnaOdpovedLabel);
        spravnaOdpovedDiv.appendChild(spravnaOdpovedInput);
        odpovedDiv.appendChild(spravnaOdpovedDiv);

        odpovedeDiv.appendChild(odpovedDiv);
        otazka.odpovede[currentI] = novaOdpoved;
    }

    const brElement: HTMLBRElement = document.createElement("br")
    const hr: HTMLHRElement = document.createElement("hr");

    otazkaDiv.appendChild(otazkaLabel);
    otazkaDiv.appendChild(brElement);
    otazkaDiv.appendChild(otazkaInput);
    otazkaDiv.appendChild(hr);
    otazkaDiv.appendChild(odpovedeDiv);

    otazkyContainer.appendChild(otazkaDiv);
}

saveBtn.addEventListener("click", () => {
    // Získáme hodnotu názvu testu z inputu
    const nazovInput: HTMLInputElement = <HTMLInputElement>document.getElementById("nazov");
    test.nazov = nazovInput.value;

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

        let spravneOdpovedeCounter: number = 0;
        
        for (let j: number = 0; j < odpovedeInputs.length; j++) {
            if (spravneInputs[j].checked) {
                spravneOdpovedeCounter++;
            }
            const odpoved: Odpoved = {
                text: odpovedeInputs[j].value,
                jeSpravna: spravneInputs[j].checked,
            };
            otazka.odpovede.push(odpoved);
        }

        otazky.push(otazka);
    }

    test.otazky = otazky;

    console.log(test);
    addTest(test).then(() => {
        alert("Test was added to database.");
    });
});