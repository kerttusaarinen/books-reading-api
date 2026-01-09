const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const bookRoutes = require("./routes/books");

app.get("/", (req, res) => {
  res.json({ message: "Books Reading API is running" });
});

app.use("/books", bookRoutes);

module.exports = app;
