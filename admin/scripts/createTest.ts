import { Odpoved } from "../../typescript_models/odpoved";
import { Otazka } from "../../typescript_models/otazka";
import { Test } from '../../typescript_models/test';
import { addTest } from "../../typescript_scripts/dbService.js";
import { getData } from "../../typescript_scripts/helpers.js";

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

    // každá otázka má 4 odpovede
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
    
    test.otazky = getData();

    addTest(test).then(() => {
        alert("Test was added to database.");
    });
});
