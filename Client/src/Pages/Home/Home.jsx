import React from "react";
import './Home.css';
import { Link } from 'react-router-dom';
import { assets } from "../../Assets/Assets";

const Home = () => {
    return (
        <>
            <div className="home-container">
                <div className="heading">
                    <h2>Welcome to Dochaki MES </h2>
                    <span>(Manufacturing Exicution System)</span>
                </div>
                <img src={assets.dochaki_logo} alt="" />
                <p>Your one-stop solution for managing raw materials and stock efficiently.</p>
                <p>List your product and update these according changes.</p>
                <p>Also track your inventory in real-time and streamline your operations with ease.</p>
                <p>Experience seamless inventory management with Dochaki MES.</p>
                <div className="home-buttons">
                    Manage your inventory with ease:
                    <div className="button-group">
                        <Link to="/raw-material" className="home-button">Manage Raw Materials</Link>
                        <Link to="/stock-material" className="home-button">Manage Stock Materials</Link>
                    </div>
                </div>
                <div className="developer">
                    <p>Developed by: Tushar Chaudhary</p>
                    <p>Contact: +91 999-325-3767</p>
                </div>
            </div>
        </>
    )
}

export default Home;