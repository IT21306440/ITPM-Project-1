import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="container mt-4">
      <h2>My Feedback</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Rating</th>
            <th>Comment</th>
            <th>Action</th>
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
                <td>
                  {editingFeedback === feedback._id ? (
                    <button className="btn btn-success" onClick={() => handleEdit(feedback._id)}>
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
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No feedback available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserFeedback;
