const Feedback = require("../models/Feedback");

// Submit Feedback (Only Registered Users)
const submitFeedback = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Feedback (Only Owner Can Edit Within 24 Hours)
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if feedback is within 24 hours
    const timeDiff = (new Date() - feedback.createdAt) / (1000 * 60 * 60);
    if (timeDiff > 24) {
      return res.status(403).json({ message: "Editing time expired" });
    }

    feedback.rating = req.body.rating || feedback.rating;
    feedback.comment = req.body.comment || feedback.comment;

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Feedback (Only Admin Can Delete)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Only admins can delete
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await feedback.remove();
    res.status(200).json({ message: "Feedback removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Ensure Proper Export
module.exports = { submitFeedback, getAllFeedback, updateFeedback, deleteFeedback };
