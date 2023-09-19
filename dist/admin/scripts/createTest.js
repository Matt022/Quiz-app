import { addTest } from "../../typescript_scripts/dbService.js";
import { getData } from "../../typescript_scripts/helpers.js";
const test = {
    id: 0,
    nazov: "",
    otazky: [],
};
const otazkyContainer = document.getElementById("otazky-container");
const saveBtn = document.querySelector("#save");
const addQuestionButton = document.getElementById("add-question");
addQuestionButton.addEventListener("click", () => {
    addOtazka();
});
function addOtazka() {
    const otazka = {
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
addOtazka();
function renderOtazka(otazka, index) {
    const otazkaDiv = document.createElement("div");
    otazkaDiv.className = "otazka";
    const otazkaLabel = document.createElement("label");
    otazkaLabel.textContent = `Otázka ${index + 1}:`;
    const otazkaInput = document.createElement("input");
    otazkaInput.type = "text";
    otazkaInput.value = otazka.text;
    otazkaInput.placeholder = "Znenie otázky";
    otazkaInput.addEventListener("input", (e) => {
        otazka.text = e.target.value;
    });
    const odpovedeDiv = document.createElement("div");
    // každá otázka má 4 odpovede
    for (let i = 0; i < 4; i++) {
        const odpoved = otazka.odpovede[i];
        const odpovedDiv = document.createElement("div");
        odpovedDiv.className = "odpoved";
        const odpovedInput = document.createElement("input");
        odpovedInput.type = "text";
        odpovedInput.placeholder = "Odpoved";
        odpovedInput.value = odpoved ? odpoved.text : "";
        // Vytvorme nový objekt odpovede v každej iterácii
        const novaOdpoved = {
            text: "",
            jeSpravna: false,
        };
        const spravnaOdpovedInput = document.createElement("input");
        spravnaOdpovedInput.type = "checkbox";
        spravnaOdpovedInput.checked = odpoved ? odpoved.jeSpravna : false;
        // Vytvorme dočasnú premennú pre aktuálnu hodnotu i
        const currentI = i;
        spravnaOdpovedInput.addEventListener("change", (e) => {
            novaOdpoved.jeSpravna = e.target.checked;
        });
        const spravnaOdpovedLabel = document.createElement("label");
        spravnaOdpovedLabel.textContent = "Correct answer";
        odpovedDiv.appendChild(odpovedInput);
        const spravnaOdpovedDiv = document.createElement("div");
        spravnaOdpovedDiv.classList.add("spravnaOdpovedDiv");
        spravnaOdpovedDiv.appendChild(spravnaOdpovedLabel);
        spravnaOdpovedDiv.appendChild(spravnaOdpovedInput);
        odpovedDiv.appendChild(spravnaOdpovedDiv);
        odpovedeDiv.appendChild(odpovedDiv);
        otazka.odpovede[currentI] = novaOdpoved;
    }
    const brElement = document.createElement("br");
    const hr = document.createElement("hr");
    otazkaDiv.appendChild(otazkaLabel);
    otazkaDiv.appendChild(brElement);
    otazkaDiv.appendChild(otazkaInput);
    otazkaDiv.appendChild(hr);
    otazkaDiv.appendChild(odpovedeDiv);
    otazkyContainer.appendChild(otazkaDiv);
}
saveBtn.addEventListener("click", () => {
    // Získáme hodnotu názvu testu z inputu
    const nazovInput = document.getElementById("nazov");
    test.nazov = nazovInput.value;
    test.otazky = getData();
    addTest(test).then(() => {
        alert("Test was added to database.");
    });
});
