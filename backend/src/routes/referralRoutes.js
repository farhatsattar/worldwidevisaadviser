const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  createReferral,
  getReferrals,
  getReferralStats,
} = require("../controllers/referralController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, asyncHandler(createReferral));
router.get("/stats", protect, asyncHandler(getReferralStats));
router.get("/", protect, asyncHandler(getReferrals));

module.exports = router;
