import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedback();
    } catch (err) {
      console.error("Error deleting feedback", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin - Manage Feedback</h2>
      {feedbacks.map((feedback) => (
        <div key={feedback._id} className="card mt-3 p-3">
          <p><strong>Rating:</strong> {feedback.rating}</p>
          <p><strong>Comment:</strong> {feedback.comment}</p>
          <button className="btn btn-danger" onClick={() => handleDelete(feedback._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
