import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-light-transparent.png";
import "./Navbar.css";

const AuthModal = ({ mode, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (mode === "login") {
      if (username === "admin" && password === "1234") {
        setMessage(`Welcome back, ${username}!`);
      } else {
        setError("Invalid username or password");
      }
    } else {
      if (!email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }
      setMessage("Account created! You can log in now.");
    }
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
          <button aria-label="Close" className="icon-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {mode === "signup" && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-btn">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        <button className="text-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="ShortCut logo" className="brand-logo" />
        </div>
        <div className="nav-middle">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-right">
          <button className="toggle" aria-label="Toggle theme"></button>
          <button className="notify" aria-label="Notifications"></button>
          <button className="ghost" onClick={() => setActiveModal("login")}>Login</button>
          <button className="ghost" onClick={() => setActiveModal("signup")}>Sign Up</button>
        </div>
      </nav>

      {activeModal && (
        <AuthModal mode={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default Navbar;
