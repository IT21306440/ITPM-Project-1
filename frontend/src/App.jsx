import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import AdminPage from "./pages/AdminPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">Feedback System</a>
            <div className="navbar-nav">
              <a className="nav-link" href="/register">Register</a>
              <a className="nav-link" href="/login">Login</a>
              <a className="nav-link" href="/admin">Admin</a>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/feedback" element={<FeedbackList />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
