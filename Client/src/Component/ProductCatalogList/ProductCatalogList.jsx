import React, { useContext, useEffect, useState } from "react";
import "./ProductCatalogList.css";
import { MesContext } from "../../Context/MesContextProvider";

const ProductCatalogList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token, readDate, backend_url } = useContext(MesContext);


    // API fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${backend_url}/api/product-catalog/get`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

                });
                const data = await res.json();
                if (res.ok) {
                    setProducts(data.data || []); 
                } else {
                    setError(data.message || "Failed to fetch products");
                }
            } catch (err) {

                setError("Server not reachable");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="catalog-l">
            <div className="catalog-container">
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product) => (
                        <div className="product-card" key={product._id}>
                            <div className="image">
                                <img src={product.imageUrl} alt={product.productName} className="product-image" />
                            </div>
                            <div className="product-details">
                                <h3>{product.productName}</h3>
                                <p><strong>Product ID:</strong> {product.productCode}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Compatible Model:</strong> {product.compatibleModel}</p>
                                <p><strong>Selling Platforms:</strong> {product.listingPlatforms.join(", ")}</p>
                                <p><strong>Created:</strong> {readDate(product.createdAt)}</p>
                                <p><strong>Updated:</strong> {readDate(product.updatedAt)}</p>
                                <p><strong>Created By:</strong>{product.createdBy} </p>
                                <p><strong>Remark:</strong>{product.remarks} </p>
                                {product.material}
                                {product.finish}
                                {product.dimensions}
                                <br />
                                {product.weight}
                                <br />
                                {product.tradePrice}
                                <br />

                                {product.mrp}
                                <br />
                                {product.stockStatus}
                                <p>{product.description}</p>
                            </div>
                            <div className="action">
                                <button>+</button>
                                <button>-</button>
                                <button>✎</button>
                                <button>🗑️</button>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductCatalogList;
