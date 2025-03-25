import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // ✅ Clear any previous errors
    setSuccess(""); // ✅ Clear success message before new submission
    setLoading(true);

    if (!rating || !comment) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to submit feedback.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/feedback",
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating("");
      setComment("");
      setSuccess("Feedback submitted successfully!");
      setLoading(false);
      onFeedbackSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
      setSuccess(""); // ✅ Ensure success message is cleared on error
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Submit Feedback</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating (1-5)</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
