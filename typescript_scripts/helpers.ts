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