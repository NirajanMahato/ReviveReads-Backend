const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllUsers,
  signUp,
  signIn,
  deleteById,
  updateData,
  getUserById,
  addBookToFavorites,
  getFavouriteBook,
  removeBookFromFavorites,
  getUsersForSidebar,
  updateUserStatus,
} = require("../controller/userController");
const { authenticateToken } = require("../middleware/userAuth");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "product_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-all-users", authenticateToken, getAllUsers);
router.get("/get-user-by-id/:id", getUserById);
router.delete("/:id", deleteById);
router.post("/add-to-favorites", authenticateToken, addBookToFavorites);
router.delete("/remove-from-favorites/:bookId", authenticateToken, removeBookFromFavorites);
router.get("/get-favorites-books", authenticateToken, getFavouriteBook);
router.get("/get-users-for-sidebar", authenticateToken, getUsersForSidebar);
router.patch("/:id/status", updateUserStatus);
router.patch("/", upload.single("avatar"), authenticateToken, updateData);

module.exports = router;
