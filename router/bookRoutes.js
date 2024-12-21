const express = require("express");
const router = express.Router();
const multer = require("multer");

const { getAllBooks, postBook } = require("../controller/bookController");

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
router.post("/post-book",upload.array('images'), authenticateToken, postBook);

module.exports = router;
