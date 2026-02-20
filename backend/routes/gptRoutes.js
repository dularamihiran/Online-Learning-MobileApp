const express = require("express");
const { getCourseSuggestions } = require("../controllers/gptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ask", protect, getCourseSuggestions);

module.exports = router;
