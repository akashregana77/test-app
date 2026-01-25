import React from "react";
import logo from "../assets/logo-light-transparent.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
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
        <button className="toggle"></button>
        <button className="notify"></button>
        <Link to="/login">Login</Link>
        <Link to="/signup">SignUp</Link>
      </div>
    </nav>
  );
};

export default Navbar;
