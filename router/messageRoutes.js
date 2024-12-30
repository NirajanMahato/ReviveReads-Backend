const express = require("express");
const { authenticateToken } = require("./userAuth");
const router = express.Router();

const { sendMessage, getMessages } = require("../controller/messageController");

router.get("/:id", authenticateToken, getMessages);
router.post("/send/:id",authenticateToken, sendMessage);

module.exports = router;
