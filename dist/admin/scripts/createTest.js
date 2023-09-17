const test = {
    id: 1,
    nazov: "",
    otazky: [],
};
const otazkyContainer = document.getElementById("otazky-container");
const saveBtn = document.querySelector("#save");
const addQuestionButton = document.getElementById("add-question");
addQuestionButton?.addEventListener("click", () => {
    addOtazka();
});
function addOtazka() {
    const otazka = {
        text: "",
        odpovede: [{ text: "", jeSpravna: false }],
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
        const spravnaInput = document.createElement("input");
        spravnaInput.type = "checkbox";
        spravnaInput.checked = odpoved ? odpoved.jeSpravna : false;
        // Vytvorme dočasnú premennú pre aktuálnu hodnotu i
        const currentI = i;
        spravnaInput.addEventListener("change", (e) => {
            novaOdpoved.jeSpravna = e.target.checked;
        });
        const spravnaLabel = document.createElement("label");
        spravnaLabel.textContent = "Správna odpoveď";
        odpovedDiv.appendChild(odpovedInput);
        odpovedDiv.appendChild(spravnaLabel);
        odpovedDiv.appendChild(spravnaInput);
        odpovedeDiv.appendChild(odpovedDiv);
        otazka.odpovede[currentI] = novaOdpoved;
    }
    otazkaDiv.appendChild(otazkaLabel);
    otazkaDiv.appendChild(otazkaInput);
    otazkaDiv.appendChild(odpovedeDiv);
    const hr = document.createElement("hr");
    otazkaDiv.appendChild(hr);
    otazkyContainer?.appendChild(otazkaDiv);
}
saveBtn?.addEventListener("click", () => {
});
export {};
