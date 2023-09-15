import { Test } from "../typescript_models/test";

const apiUrl: string = 'http://localhost:3000/tests'; // Zmeňte URL na adresu vášho JSON Serveru

// POST - pridanie testu
export async function addTest(test: Test): Promise<void> {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
    });
}

// GET - získanie všetkých testov
export async function getAllTests(): Promise<Test[]> {
    const response: Response = await fetch(apiUrl);
    if (response.ok) {
        const tests: Test[] = await response.json();
        return tests;
    } else {
        return [];
    }
}

// GET - získanie špecifického testu
export async function getTestById(id: number): Promise<Test | null> {
    const response: Response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
        const test: Test = await response.json();
        return test;
    } else {
        return null;
    }
}

// UPDATE - Aktualizácia testu podľa ID
export async function updateTest(id: number, updatedTest: Test): Promise<void> {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTest),
    });
}

// DELETE - Odstránenie testu podľa ID
export async function deleteTest(id: number): Promise<void> {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
}