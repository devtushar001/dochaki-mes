// CatalogPage.jsx
import React from "react";
// import CatalogForm from "../Forms/CatalogForm/CatalogForm"; 
import CatalogForm from "../Catalog/CatalogForm"; // Correct import path for CatalogForm
import "./CatalogPage.css";


const CatalogPage = () => {
    // Ye function form ka payload lega
    const handleFormSubmit = async (data) => {
        console.log(data);
        try {
            const res = await fetch("http://localhost:5000/api/catalog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                alert("Product saved successfully!");
                console.log("Saved product:", result.product);
            } else {
                alert("Failed to save product!");
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error while saving:", error);
            alert("Server error, please try again later.");
        }
    };

    return (
        <div className="catalog-page"> 
            <div className="controll-section">
                <button>Catalog</button>
                <button>Import</button>
                <button>Export</button>
                <button>Print</button>
            </div>
            <CatalogForm onSubmit={handleFormSubmit} />
        </div>
    );
};

export default CatalogPage;
