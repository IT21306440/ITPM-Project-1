const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", protect, admin, getAllFeedback);
router.get("/user", protect, getUserFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, admin, deleteFeedback); // ✅ Ensure admin middleware

module.exports = router;
