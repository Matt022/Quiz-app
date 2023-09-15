import { Test } from "../typescript_models/test";

const apiUrl: string = 'http://localhost:3000/blogs'; // Změňte URL na adresu vašeho JSON Serveru

// CREATE - Pridávanie filmov
export async function addPost(blog: Test): Promise<void> {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
    });
}

// READ - Získání všech filmů
export async function getAllBlogs(): Promise<Test[]> {
    const response: Response = await fetch(apiUrl);
    if (response.ok) {
        const Blogs: Test[] = await response.json();
        return Blogs;
    } else {
        return [];
    }
}

// READ - Získání filmu podle ID
export async function getBlogById(id: number): Promise<Test | null> {
    const response: Response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
        const Blog: Test = await response.json();
        return Blog;
    } else {
        return null;
    }
}

// UPDATE - Aktualizace filmu podle ID
export async function updateBlog(id: number, updatedBlog: Test): Promise<void> {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
    });
}

// DELETE - Odstranění filmu podle ID
export async function deleteBlog(id: number): Promise<void> {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
}