import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Error fetching feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedback();
    } catch (err) {
      setError("Error deleting feedback");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin - Manage Feedback</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>User Email</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr key={feedback._id}>
                <td>{feedback.user?.email || "Unknown"}</td>
                <td>{feedback.rating}</td>
                <td>{feedback.comment}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(feedback._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No feedback available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
