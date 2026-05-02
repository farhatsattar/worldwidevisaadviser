const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, asyncHandler(getDashboard));

module.exports = router;
