import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-light-transparent.png";
import "./Navbar.css";

const AuthModal = ({ initialMode, onClose }) => {
  const [mode, setMode] = useState(initialMode || "login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMode(initialMode || "login");
  }, [initialMode]);

  useEffect(() => {
    setError("");
    setMessage("");
  }, [mode]);

  const ribbonCopy = useMemo(
    () =>
      mode === "login"
        ? { title: "Welcome back", caption: "Sign in to pick up where you left off." }
        : { title: "Create account", caption: "Join ShortCut to sync notes, diaries, and stories." },
    [mode]
  );

  const handleSubmit = (e, submitMode) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (submitMode === "login") {
      if (loginUsername === "admin" && loginPassword === "1234") {
        setMessage(`Welcome back, ${loginUsername || "creator"}!`);
      } else {
        setError("Invalid username or password");
      }
      return;
    }

    if (!signupName.trim()) {
      setError("Please add your name");
      return;
    }
    if (!signupEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (signupPassword.length < 6) {
      setError("Use at least 6 characters");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match");
      return;
    }
    setMessage("Account created! You can log in now.");
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true">
      <div className={`auth-modal ${mode}-active`}>
        <div className="auth-top">
          <div className="auth-copy">
            <p className="pill">{mode === "login" ? "Access" : "New"}</p>
            <h2>{ribbonCopy.title}</h2>
            <p className="muted">{ribbonCopy.caption}</p>
          </div>
          <button aria-label="Close" className="icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="auth-body">
          <div className="auth-visual">
            <div className="glow" aria-hidden="true" />
            <div className="stat-card">
              <p className="label">Active writers</p>
              <h3>12.4k</h3>
              <p className="muted">and counting</p>
            </div>
            <div className="stat-card accent">
              <p className="label">Streak guard</p>
              <h3>99.9%</h3>
              <p className="muted">sync reliability</p>
            </div>
            <p className="footnote">Built for focus. No distractions.</p>
          </div>

          <div className="auth-panel">
            <div className="tab-row">
              <button
                className={mode === "login" ? "tab active" : "tab"}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={mode === "signup" ? "tab active" : "tab"}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <div
              className="form-track"
              style={{ transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)" }}
            >
              <form className="auth-form" onSubmit={(e) => handleSubmit(e, "login")}>
                <div className={`field ${loginUsername ? "filled" : ""}`}>
                  <input
                    type="text"
                    placeholder=" "
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                  <label>Username</label>
                </div>
                <div className={`field ${loginPassword ? "filled" : ""}`}>
                  <input
                    type="password"
                    placeholder=" "
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>
                <div className="row">
                  <label className="checkbox">
                    <input type="checkbox" defaultChecked />
                    <span>Keep me signed in</span>
                  </label>
                  <button type="button" className="link-btn">Forgot?</button>
                </div>
                <button type="submit" className="primary-btn">Sign in</button>
                <button type="button" className="ghost-btn" onClick={() => setMode("signup")}>
                  Need an account? Slide to sign up →
                </button>
              </form>

              <form className="auth-form" onSubmit={(e) => handleSubmit(e, "signup")}>
                <div className={`field ${signupName ? "filled" : ""}`}>
                  <input
                    type="text"
                    placeholder=" "
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                  <label>Full name</label>
                </div>
                <div className={`field ${signupEmail ? "filled" : ""}`}>
                  <input
                    type="email"
                    placeholder=" "
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <label>Email</label>
                </div>
                <div className="dual">
                  <div className={`field ${signupPassword ? "filled" : ""}`}>
                    <input
                      type="password"
                      placeholder=" "
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <label>Password</label>
                  </div>
                  <div className={`field ${signupConfirm ? "filled" : ""}`}>
                    <input
                      type="password"
                      placeholder=" "
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      required
                    />
                    <label>Confirm</label>
                  </div>
                </div>
                <div className="row">
                  <label className="checkbox">
                    <input type="checkbox" />
                    <span>Send me product updates</span>
                  </label>
                </div>
                <button type="submit" className="primary-btn">Create account</button>
                <button type="button" className="ghost-btn" onClick={() => setMode("login")}>
                  Already registered? Slide to login →
                </button>
              </form>
            </div>

            {(error || message) && (
              <div className={`inline-alert ${error ? "error" : "success"}`}>
                {error || message}
              </div>
            )}
          </div>
        </div>
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
        <AuthModal initialMode={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default Navbar;
