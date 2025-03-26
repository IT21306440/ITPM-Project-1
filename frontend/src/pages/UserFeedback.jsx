import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import FeedbackForm from "../components/FeedbackForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Modal } from "bootstrap";

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleShowModal = () => {
    const modal = new Modal(document.getElementById("feedbackModal"));
    modal.show();
  };

  const handleFeedbackSuccess = async () => {
    await fetchUserFeedback(); // Ensure the latest data is fetched
    const modal = Modal.getInstance(document.getElementById("feedbackModal"));
    if (modal) modal.hide();
  };

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark">User Feedback</h2>
        <button className="btn btn-success" onClick={handleShowModal}>
          + Add Feedback
        </button>
      </div>

      <div className="modal fade" id="feedbackModal" tabIndex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="feedbackModalLabel">Submit Feedback</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <FeedbackForm onSuccess={handleFeedbackSuccess} />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

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
                <td colSpan="3" className="text-center">No feedback available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserFeedback;
