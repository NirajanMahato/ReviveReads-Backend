const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getAllBooks, postBook, getBookById, deleteBookId, updateBook } = require("../controller/bookController");

const { authenticateToken } = require("./userAuth");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "product_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/get-all-books", getAllBooks);
router.get("/get-book-by-id/:bookId", getBookById);
router.post("/post-book", upload.array('images'), authenticateToken, postBook);
router.delete("/delete-book/:bookId", authenticateToken, deleteBookId);
router.patch("/update-book/:bookId", upload.array('images'), authenticateToken, updateBook);

module.exports = router;
