const db = require("../db/database");


exports.getBooks = (req, res) => {
  const sql = "SELECT * FROM books";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};


exports.postBooks = (req, res) => {
  const { title, author, status } = req.body;

  if (!title || !author || !status) {
    return res.status(400).json({
      error: "title, author and status are required"
    });
  }

  const allowedStatuses = ["to_read", "reading", "finished"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${allowedStatuses.join(", ")}`
    });
  }

  const sql = `
    INSERT INTO books (title, author, status)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [title, author, status], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      title,
      author,
      status
    });
  });
};

exports.getBookById = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id must be an integer" });
  }

  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "book not found" });
    res.json(row);
  });
};

exports.putBook = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id must be an integer" });
  }

  const { title, author, status } = req.body;

  const allowedStatuses = ["to_read", "reading", "finished"];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${allowedStatuses.join(", ")}`
    });
  }

  db.get("SELECT * FROM books WHERE id = ?", [id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: "book not found" });

    const nextTitle = title ?? existing.title;
    const nextAuthor = author ?? existing.author;
    const nextStatus = status ?? existing.status;

    if (!nextTitle || !nextAuthor || !nextStatus) {
      return res.status(400).json({ error: "title, author and status are required" });
    }

    db.run(
      "UPDATE books SET title = ?, author = ?, status = ? WHERE id = ?",
      [nextTitle, nextAuthor, nextStatus, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({
          id,
          title: nextTitle,
          author: nextAuthor,
          status: nextStatus
        });
      }
    );
  });
};

exports.deleteBook = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id must be an integer" });
  }

  db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "book not found" });

    res.status(204).send();
  });
};