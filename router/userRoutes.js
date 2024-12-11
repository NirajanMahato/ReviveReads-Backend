const express = require("express");
const router = express.Router();
const { getAllUsers, signUp, signIn, getUserInfo, deleteById, updateData } = require("../controller/userController");
const { authenticateToken } = require('./userAuth');

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/get-all-users", getAllUsers);
router.get('/get-user-info', authenticateToken, getUserInfo);
router.delete('/:id', deleteById);
router.patch('/:id', authenticateToken, updateData);

module.exports = router;
