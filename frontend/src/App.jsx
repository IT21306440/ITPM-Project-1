import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import AdminPage from "./pages/AdminPage";
import UserFeedback from "./pages/UserFeedback";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ReportPage from "./pages/ReportPage"; // ✅ Import Report Page

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isUser = isLoggedIn && !isAdmin;
  const navigate = useNavigate();

  // ✅ Check User Authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      // ✅ Ensure localStorage user data exists before parsing
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setIsAdmin(user?.isAdmin || false);
      }
    }
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <>
      {/* ✅ Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" >Feedback System</Link>
          <div className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <Link className="nav-link" to="/register">Register</Link>
                <Link className="nav-link" to="/login">Login</Link>
              </>
            ) : (
              <>
                {isUser &&<Link className="nav-link" to="/my-feedback">My Feedback</Link>}
                {isAdmin && <Link className="nav-link" to="/admin">Admin Panel</Link>}
                {isAdmin && <Link className="nav-link" to="/report">View Reports</Link>} {/* ✅ New Report Page */}
                <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feedbackform" element={<FeedbackForm />} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/my-feedback" element={<UserFeedback />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/report" element={<ReportPage />} /> {/* ✅ New Route for Reports */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

// ✅ Wrap App Inside Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;