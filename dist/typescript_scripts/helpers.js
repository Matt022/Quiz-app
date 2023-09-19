// Funkcia pre získanie ID z URL
export function getQuizIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizIdString = urlParams.get("id");
    if (quizIdString) {
        const quizId = parseInt(quizIdString, 10);
        if (!isNaN(quizId)) {
            return quizId;
        }
    }
    return null;
}
export function getData() {
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
    return otazky;
}
