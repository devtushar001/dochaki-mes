import React from "react";
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div className="home-container">
                <div className="boxes">
                    <div className="today-updated-raw-material">
                        Today updated raw items
                    </div>
                    <div className="today-updated-stock-material">
                        Today updated stock items
                    </div>
                    <div className="checkout-low-raw-items">
                        Checkout low raw items
                    </div>
                    <div className="checkout-low-stock-items">
                        Checkout low stock items
                    </div>
                    <div className="today-added-items">
                        Listed new item
                    </div>
                </div>
                <div className="buttons">
                    <Link to="/raw-material"><button className="raw">Raw</button></Link>
                    <Link to="/stock-material"><button className="stock">Stock</button></Link>
                </div>
            </div>
        </>
    )
}

export default Home;