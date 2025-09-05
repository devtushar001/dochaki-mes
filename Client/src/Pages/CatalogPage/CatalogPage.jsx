// CatalogPage.jsx
import React, { useContext, useState } from "react";
// import CatalogForm from "../Forms/CatalogForm/CatalogForm"; 
import CatalogForm from "../../Component/CatalogForm/CatalogForm"; // Correct import path for CatalogForm
import "./CatalogPage.css";
import { MesContext } from "../../Context/MesContextProvider";
import ProductCatalogList from "../../Component/ProductCatalogList/ProductCatalogList";


const CatalogPage = () => {
    const { token, backend_url } = useContext(MesContext);
    const [tabs, setTabs] = useState("catalog")
    // Ye function form ka payload lega
    const handleFormSubmit = async (data) => {
        console.log(data);
        try {
            const res = await fetch(`${backend_url}/api/product-catalog/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
                <button onClick={() => setTabs("catalog")}>Catalog List</button>
                <button onClick={() => setTabs("add-catalog")}>Add New Item</button>
            </div>
            {tabs == "catalog" ? <ProductCatalogList /> : <CatalogForm onSubmit={handleFormSubmit} />}
        </div>
    );
};

export default CatalogPage;
