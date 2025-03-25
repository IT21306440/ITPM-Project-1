const Feedback = require("../models/Feedback");

// ✅ Submit Feedback (Only Logged-in Users)
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

// ✅ Get All Feedback (Admin View)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Logged-in User's Feedback
const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Feedback (Only Owner Can Edit Within 24 Hours)
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

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

// ✅ Delete Feedback (Only Admin)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Ensure only admins can delete
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Feedback.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Feedback removed successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Generate Feedback Report (Admin Only)
const generateReport = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "email");
    if (feedbacks.length === 0) {
      return res.status(200).json({ message: "No feedback available for report." });
    }

    // ✅ Calculate Overall Average Rating
    const totalRatings = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRatings / feedbacks.length;

    // ✅ Extract Top Comments (Most Frequent)
    const commentCounts = {};
    feedbacks.forEach((feedback) => {
      const comment = feedback.comment.toLowerCase();
      commentCounts[comment] = (commentCounts[comment] || 0) + 1;
    });

    // Sort comments by frequency
    const topComments = Object.entries(commentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([comment]) => comment);

    // ✅ Suggest Improvements (Based on Low Ratings)
    const improvementSuggestions = feedbacks
      .filter((feedback) => feedback.rating < 3) // Low ratings (1-2)
      .map((feedback) => feedback.comment)
      .slice(0, 3); // Limit to 3 suggestions

    // ✅ Generate Summary for Each Attendee
    const attendeeSummary = {};
    feedbacks.forEach((feedback) => {
      const userEmail = feedback.user.email;

      if (!attendeeSummary[userEmail]) {
        attendeeSummary[userEmail] = {
          totalFeedback: 0,
          averageRating: 0,
          comments: [],
          improvementSuggestions: [],
        };
      }

      attendeeSummary[userEmail].totalFeedback += 1;
      attendeeSummary[userEmail].averageRating += feedback.rating;
      attendeeSummary[userEmail].comments.push(feedback.comment);

      if (feedback.rating < 3) {
        attendeeSummary[userEmail].improvementSuggestions.push(feedback.comment);
      }
    });

    // ✅ Finalize Attendee Averages
    Object.keys(attendeeSummary).forEach((email) => {
      attendeeSummary[email].averageRating = (
        attendeeSummary[email].averageRating / attendeeSummary[email].totalFeedback
      ).toFixed(2);
    });

    res.status(200).json({
      overallSummary: {
        averageRating: averageRating.toFixed(2),
        topComments,
        improvementSuggestions,
      },
      attendeeSummary,
    });
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ message: "Server error generating report" });
  }
};

// ✅ Export Functions
module.exports = {
  submitFeedback,
  getAllFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  generateReport, // ✅ New function added
};
