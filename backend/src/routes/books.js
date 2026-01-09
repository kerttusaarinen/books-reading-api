const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

router.get("/", bookController.getBooks);

router.post("/", bookController.postBooks);

router.get("/:id", bookController.getBookById);
router.put("/:id", bookController.putBook);
router.delete("/:id", bookController.deleteBook);

 
module.exports = router;
