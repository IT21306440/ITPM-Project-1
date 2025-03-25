import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ To navigate to report page

const AdminPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  // ✅ Fetch All Feedback (Admin Only)
  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Error fetching feedback.");
    }
  };

  // ✅ Handle Delete Feedback
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update UI after deletion
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
    } catch (err) {
      setError("Error deleting feedback.");
    }
  };

  return (
    <div className="container mt-4">
      {/* ✅ Background Card for better UI */}
      <div className="card p-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Admin - Manage Feedback</h2>
          <Link to="/report" className="btn btn-primary">
            📊 View Reports
          </Link>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
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
                    No feedback available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;