import React, { useContext, useState } from "react";
import "./Navbar.css";
// import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { assets } from "../../Assets/Assets";
import { CiMenuFries } from "react-icons/ci";
import { Link } from "react-router-dom";
import { MdChecklist } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { BsFiletypeRaw } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import MesContextProvider, { MesContext } from "../../Context/MesContextProvider";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userName } = useContext(MesContext);
  const [sidebar, setSidebar] = useState("dashboard")


  return (
    <>
      <div className="upper">
        <div className="menu">
          <CiMenuKebab onClick={() => setMenuOpen(!menuOpen)} />
        </div>
        <div className="user-name">
          <p>{userName}</p>
        </div>
      </div>
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <Link className="not-style" to="/dashboard">
            <li
              id={sidebar === "dashboard" ? "isActive" : ""}
              onClick={() => setSidebar("dashboard")}
              className="sidebar-menu-list"
            >
              Dashboard
            </li>
          </Link>

          <Link className="not-style" to="/raw-material">
            <li
              id={sidebar === "raw-item" ? "isActive" : ""}
              onClick={() => setSidebar("raw-item")}
              className="sidebar-menu-list"
            >
              Raw Item
            </li>
          </Link>
          <Link className="not-style" to="/raw-material-update">
            <li
              id={sidebar === "raw-update-list" ? "isActive" : ""}
              onClick={() => setSidebar("raw-update-list")}
              className="sidebar-menu-list"
            >
              Raw Update List
            </li>
          </Link>

          <Link className="not-style" to="/stock-material">
            <li
              id={sidebar === "stock-item" ? "isActive" : ""}
              onClick={() => setSidebar("stock-item")}
              className="sidebar-menu-list"
            >
              Stock Item
            </li>
          </Link>

          <Link className="not-style" to="/stock-material-update">
            <li
              id={sidebar === "stock-update-list" ? "isActive" : ""}
              onClick={() => setSidebar("stock-update-list")}
              className="sidebar-menu-list"
            >
              Stock Update List
            </li>
          </Link>

          <Link className="not-style" to="/create-catalog">
            <li
              id={sidebar === "create-catalog" ? "isActive" : ""}
              onClick={() => setSidebar("create-catalog")}
              className="sidebar-menu-list"
            >
              Create catalog
            </li>
          </Link>
        </ul>
      </div>
      <nav className="navbar">
        <div className="check-list">
          <Link to="/check-list" className="not-style" ><MdChecklist /></Link>
        </div>
        <div className="manage-stock">
          <Link to="/stock-material" className="not-style" ><AiOutlineStock /></Link>
        </div>
        <div className="dochaki-home">
          <Link to="/" className="not-style" ><img src={assets.dochaki_logo} alt="" /></Link>
        </div>
        <div className="manage-raw">
          <Link to="/raw-material" className="not-style" ><BsFiletypeRaw /></Link>
        </div>
        <div className="your-profile">
          <Link to="/my-profile" className="not-style" > <CiUser /></Link>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
