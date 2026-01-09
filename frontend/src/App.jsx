import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function App() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("to_read");
  const [saving, setSaving] = useState(false);

  const loadBooks = () => {
    setError("");
    fetch(`${API_URL}/books`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setBooks)
      .catch((e) => setError(String(e.message || e)));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, status }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error ? data.error : `HTTP ${res.status}`;
        throw new Error(msg);
      }

      setBooks((prev) => [data, ...prev]);

      setTitle("");
      setAuthor("");
      setStatus("to_read");
    } catch (e2) {
      setError(String(e2.message || e2));
    } finally {
      setSaving(false);
    }
  };

  async function updateBookStatus(id, newStatus) {
  await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  await loadBooks();
}

async function deleteBook(id) {
  await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });

  await loadBooks();
}
  return (
    <div style={{ padding: 16, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1>Reading list</h1>

      <h2>Add a book</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>

        <label>
          Author
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="to_read">to_read</option>
            <option value="reading">reading</option>
            <option value="finished">finished</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{ padding: 10, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving..." : "Add book"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      <h2>Books</h2>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id} style={{ marginBottom: 8 }}>
              <strong>{book.title}</strong> — {book.author} ({book.status})

              <select
                value={book.status}
                onChange={(e) => updateBookStatus(book.id, e.target.value)}
                style={{ marginLeft: 12 }}
              >
                <option value="to_read">to_read</option>
                <option value="reading">reading</option>
                <option value="finished">finished</option>
              </select>

              <button
                onClick={() => deleteBook(book.id)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    
    </div>
  );
}


