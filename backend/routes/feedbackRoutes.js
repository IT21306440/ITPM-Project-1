const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,  // ✅ New function for user feedback
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", getAllFeedback);
router.get("/user", protect, getUserFeedback);  // ✅ Route to fetch user feedback
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
