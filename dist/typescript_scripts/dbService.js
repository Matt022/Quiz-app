const apiUrl = 'http://localhost:3000/blogs'; // Změňte URL na adresu vašeho JSON Serveru
// CREATE - Pridávanie filmov
export async function addPost(blog) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
    });
}
// READ - Získání všech filmů
export async function getAllBlogs() {
    const response = await fetch(apiUrl);
    if (response.ok) {
        const Blogs = await response.json();
        return Blogs;
    }
    else {
        return [];
    }
}
// READ - Získání filmu podle ID
export async function getBlogById(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
        const Blog = await response.json();
        return Blog;
    }
    else {
        return null;
    }
}
// UPDATE - Aktualizace filmu podle ID
export async function updateBlog(id, updatedBlog) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
    });
}
// DELETE - Odstranění filmu podle ID
export async function deleteBlog(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
}
