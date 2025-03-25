const express = require("express");
const protect = require("../middleware/authMiddleware"); // Correct import
const {
  submitFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", getAllFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
