const express = require("express");
const router = express.Router();
const { getAllUsers, signUp, signIn } = require("../controller/userController");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-all-users", getAllUsers);

module.exports = router;
