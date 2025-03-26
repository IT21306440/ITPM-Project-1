import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeedbackForm = ({ onSuccess }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setLoading(false);

      // ✅ Call onSuccess to update UI without reload
      if (onSuccess) onSuccess();

      // ✅ Close modal & navigate to feedback page
      navigate("/my-feedback");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 rounded-lg" style={{ maxWidth: "500px", width: "100%" }}>
        {/* <h3 className="text-center text-primary mb-4">Submit Feedback</h3> */}
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Rating (1-5)</label>
            <input
              type="number"
              className="form-control border border-primary shadow-sm"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Comment</label>
            <textarea
              className="form-control border border-primary shadow-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 shadow-sm" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
