const express = require("express");
const router = express.Router();

const { adminSummary } = require("../controller/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.get("/summary", verifyAdmin, adminSummary);

module.exports = router;
