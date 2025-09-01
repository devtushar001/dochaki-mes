import React, { useState } from "react";
import "./Navbar.css";
// import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { assets } from "../../Assets/Assets";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";
import { MdChecklist } from "react-icons/md";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="navbar">

        <div className="check-list">
               <MdChecklist />

        </div>
        <div className="manage-stock">

        </div>
        <div className="dochaki-home">

        </div>
        <div className="manage-raw">

        </div>

        <div className="your-profile">

        </div>
        <div className="nav-logo">
          <Link to="/">
            <img src={assets.dochaki_logo} alt="" />
          </Link>
        </div>
        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/'><li>Home</li></Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/dashboard'><li>Dashboard</li></Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/stock-material'><li>Stock item</li></Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/raw-material'><li>Raw item</li></Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/stock-material-update'><li>Stock update</li></Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} className="no-style" to='/raw-material-update'><li>Raw update</li></Link>
          </ul>
        </div>
        <CiMenuFries className="menu_icon" onClick={() => setMenuOpen(!menuOpen)} style={{ height: "32px" }} src={assets.menu_icon} size={30} />
      </nav>
    </>
  );
};

export default Navbar;
