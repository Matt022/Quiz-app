const apiUrl = 'http://localhost:3000/tests'; // Zmeňte URL na adresu vášho JSON Serveru
// POST - pridanie testu
export async function addTest(test) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
    });
}
// GET - získanie všetkých testov
export async function getAllTests() {
    const response = await fetch(apiUrl);
    if (response.ok) {
        const tests = await response.json();
        return tests;
    }
    else {
        return [];
    }
}
// GET - získanie špecifického testu
export async function getTestById(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
        const test = await response.json();
        return test;
    }
    else {
        return null;
    }
}
// UPDATE - Aktualizácia testu podľa ID
export async function updateTest(id, updatedTest) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTest),
    });
}
// DELETE - Odstránenie testu podľa ID
export async function deleteTest(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
}
