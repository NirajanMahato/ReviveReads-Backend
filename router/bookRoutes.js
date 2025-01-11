const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getAllBooks,
  postBook,
  getBookById,
  updateBook,
  getBookByUser,
  deleteBookById,
  updateBookApprovalStatus,
  getApprovedBooks,
  getApprovedBookByUser,
  markAsSold,
} = require("../controller/bookController");

const { authenticateToken } = require("../middleware/userAuth");
const { verifyAdmin } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "product_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/get-all-books", verifyAdmin, getAllBooks);
router.get("/get-approved-books", getApprovedBooks);
router.get("/get-book-by-id/:bookId", getBookById);
router.get("/get-book-by-user", getBookByUser);
router.get("/get-approved-by-user", getApprovedBookByUser);
router.post("/post-book", upload.array("images"), authenticateToken, postBook);
router.delete("/delete-book", authenticateToken, deleteBookById);
router.patch(
  "/update-book/:bookId",
  upload.array("images"),
  authenticateToken,
  updateBook
);
router.patch("/approve-book/:bookId", verifyAdmin, updateBookApprovalStatus);
router.patch("/mark-as-sold/:bookId", authenticateToken, markAsSold);

module.exports = router;
