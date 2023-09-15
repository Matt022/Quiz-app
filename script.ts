import { Test } from "./typescript_models/test";

// Príklad vytvorenia testu
const testHere: Test = {
    nazov: "MojTest",
    otazky: [
        {
            text: "Čo je hlavné mesto Slovenska?",
            odpovede: [
                { text: "Bratislava", jeSpravna: true },
                { text: "Praha", jeSpravna: false },
                { text: "Budapešť", jeSpravna: false },
                { text: "Varšava", jeSpravna: false },
            ],
        },
        {
            text: "Koľko je 2 + 2?",
            odpovede: [
                { text: "1", jeSpravna: false },
                { text: "3", jeSpravna: false },
                { text: "4", jeSpravna: true },
                { text: "5", jeSpravna: false },
            ],
        },
        // Ďalšie otázky...
    ],
};

// Príklad, ako získať otázky pre test a ich odpovede
const prvaOtazka = testHere.otazky[0];
console.log("Otázka:", prvaOtazka.text);
console.log("Odpovede:");
prvaOtazka.odpovede.forEach((odpoved, index) => {
    console.log(`${String.fromCharCode(65 + index)}. ${odpoved.text} (Správna: ${odpoved.jeSpravna ? "Áno" : "Nie"})`);
});