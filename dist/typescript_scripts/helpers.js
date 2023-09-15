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
