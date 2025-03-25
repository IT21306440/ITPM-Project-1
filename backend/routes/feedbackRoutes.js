const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  generateReport, // ✅ New function added
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", protect, admin, getAllFeedback);
router.get("/user", protect, getUserFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, admin, deleteFeedback);
router.get("/report", protect, admin, generateReport); // ✅ New Route for Report

module.exports = router;