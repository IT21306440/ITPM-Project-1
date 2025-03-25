import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Error fetching feedback", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/feedback/${id}`,
        { comment: updatedComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingFeedback(null);
      fetchFeedback();
    } catch (err) {
      console.error("Error updating feedback", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Submitted Feedback</h2>
      {feedbacks.map((feedback) => (
        <div key={feedback._id} className="card mt-3 p-3">
          <p><strong>Rating:</strong> {feedback.rating}</p>
          {editingFeedback === feedback._id ? (
            <>
              <textarea
                className="form-control"
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
              />
              <button className="btn btn-success mt-2" onClick={() => handleEdit(feedback._id)}>
                Save
              </button>
            </>
          ) : (
            <>
              <p><strong>Comment:</strong> {feedback.comment}</p>
              <button className="btn btn-warning" onClick={() => setEditingFeedback(feedback._id)}>
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
