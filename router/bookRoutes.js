const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getAllBooks, postBook, getBookById, updateBook, getBookByUser, deleteBookById } = require("../controller/bookController");

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
router.get("/get-book-by-user", getBookByUser);
router.post("/post-book", upload.array('images'), authenticateToken, postBook);
router.delete("/delete-book", authenticateToken, deleteBookById);
router.patch("/update-book/:bookId", upload.array('images'), authenticateToken, updateBook);

module.exports = router;
