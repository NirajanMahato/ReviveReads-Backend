const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  signUp,
  signIn,
  getUserInfo,
  deleteById,
  updateData,
} = require("../controller/userController");
const { authenticateToken } = require("./userAuth");
const multer = require("multer");

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
router.get("/get-all-users", getAllUsers);
router.get("/get-user-info", authenticateToken, getUserInfo);
router.delete("/:id", deleteById);
router.patch("/", upload.single("avatar"), authenticateToken, updateData);

module.exports = router;
