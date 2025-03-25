import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import FeedbackForm from "../components/FeedbackForm";
// import "../pages/UserFeedback.css";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchUserFeedback();
  }, []);

  const fetchUserFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/feedback/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Error fetching feedback");
    }
  };

  const handleEdit = async (id) => {
    setError("");
    setSuccess("");

    if (!updatedComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/feedback/${id}`,
        { comment: updatedComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingFeedback(null);
      setUpdatedComment("");
      setSuccess("Feedback updated successfully!");
      fetchUserFeedback();
    } catch (err) {
      setError("Error updating feedback.");
    }
  };

  return (
    <div className="container-fluid mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => setShowFeedbackForm(false)}
            >
              &times;
            </button>
            <FeedbackForm 
              onSuccess={() => {
                setShowFeedbackForm(false);
                fetchUserFeedback();
              }}
            />
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">User Feedback</h2>
        <button 
          className="btn btn-success"
          onClick={() => setShowFeedbackForm(true)}
        >
          + Add Feedback
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      {/* ✅ Full-Width Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.rating}</td>
                  <td>
                    {editingFeedback === feedback._id ? (
                      <textarea
                        className="form-control"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                      />
                    ) : (
                      feedback.comment
                    )}
                  </td>
                  <td className="text-center">
                    {editingFeedback === feedback._id ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleEdit(feedback._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setEditingFeedback(feedback._id);
                          setUpdatedComment(feedback.comment);
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No feedback available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserFeedback;
