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
function renderOtazka(otazka, index) {
    const otazkaDiv = document.createElement("div");
    otazkaDiv.className = "otazka";
    const otazkaLabel = document.createElement("label");
    otazkaLabel.textContent = `Otázka ${index + 1}:`;
    const otazkaInput = document.createElement("input");
    otazkaInput.type = "text";
    otazkaInput.value = otazka.text;
    otazkaInput.addEventListener("input", (e) => {
        otazka.text = e.target.value;
    });
    const odpovedeDiv = document.createElement("div");
    for (let i = 0; i < 4; i++) {
        const odpoved = otazka.odpovede[i];
        const odpovedDiv = document.createElement("div");
        odpovedDiv.className = "odpoved";
        const odpovedInput = document.createElement("input");
        odpovedInput.type = "text";
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
        spravnaOdpovedLabel.textContent = "Správna odpoveď";
        odpovedDiv.appendChild(odpovedInput);
        odpovedDiv.appendChild(spravnaOdpovedLabel);
        odpovedDiv.appendChild(spravnaOdpovedInput);
        odpovedeDiv.appendChild(odpovedDiv);
        otazka.odpovede[currentI] = novaOdpoved;
    }
    otazkaDiv.appendChild(otazkaLabel);
    otazkaDiv.appendChild(otazkaInput);
    otazkaDiv.appendChild(odpovedeDiv);
    const hr = document.createElement("hr");
    otazkaDiv.appendChild(hr);
    otazkyContainer.appendChild(otazkaDiv);
}
saveBtn.addEventListener("click", () => {
    // Získáme hodnotu názvu testu z inputu
    const nazovInput = document.getElementById("nazov");
    test.nazov = nazovInput.value;
    // Získáme seznam všech otázek
    const otazkyDivs = document.querySelectorAll(".otazka");
    // Vytvorme pole pre otázky
    const otazky = [];
    // pre každú otázku ako DIV vyrobíme skript na vytiahnutie odpovedí označených či už správne alebo nesprávne
    for (let i = 0; i < otazkyDivs.length; i++) {
        const otazka = {
            text: "",
            odpovede: [],
        };
        // získame znenie otázky a priradíme do vytvoreného objektu
        const otazkaInput = otazkyDivs[i].querySelector("input[type='text']");
        otazka.text = otazkaInput.value;
        // všetky odpovede a k nim správne odpovede
        // správne odpovede zistíme vo for cykle nižšie
        const odpovedeInputs = otazkyDivs[i].querySelectorAll(".odpoved input[type='text']");
        const spravneInputs = otazkyDivs[i].querySelectorAll(".odpoved input[type='checkbox']");
        for (let j = 0; j < odpovedeInputs.length; j++) {
            const odpoved = {
                text: odpovedeInputs[j].value,
                jeSpravna: spravneInputs[j].checked,
            };
            otazka.odpovede.push(odpoved);
        }
        otazky.push(otazka);
    }
    test.otazky = otazky;
    console.log(test);
});
export {};
