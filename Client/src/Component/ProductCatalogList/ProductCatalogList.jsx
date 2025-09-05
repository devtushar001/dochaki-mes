import React, { useContext, useEffect, useState } from "react";
import "./ProductCatalogList.css";
import { MesContext } from "../../Context/MesContextProvider";

const ProductCatalogList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token, readDate } = useContext(MesContext);

    // API fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:10019/api/product-catalog/get", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

                });
                const data = await res.json();
                console.log(data)
                if (res.ok) {
                    setProducts(data.data || []); // assuming backend sends { products: [...] }
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
        <div className="catalog-list">
            <h2>Product Catalog</h2>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">
                    {products.map((p) => (
                        <div className="product-card" key={p._id}>
                            {p.imageUrl && (
                                <img src={p.imageUrl} alt={p.productName} className="product-img" />
                            )}

                            <h3>
                                {p.brand} {p.productName}
                            </h3>

                            <p>
                                <strong>Product Id:</strong> {p.productId}
                            </p>

                            <p>
                                <strong>Color Options:</strong>{" "}
                                {p.colorOptions && p.colorOptions.length > 0 ? (
                                    p.colorOptions.map((color, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                background: "rgba(214, 214, 214, 0.71)",
                                                borderRadius: "10px",
                                                padding: "1px 6px",
                                                marginRight: "4px",
                                            }}
                                        >
                                            {color}
                                        </span>
                                    ))
                                ) : (
                                    "—"
                                )}
                            </p>

                            <p>
                                <strong>Category:</strong> {p.category}
                            </p>
                            <p>
                                <strong>Selling Price:</strong> ₹{p.sellingPrice}
                            </p>
                            <p>
                                <strong>Dealer Price:</strong> ₹{p.dealerPrice}
                            </p>
                            <p>
                                <strong>Amazon Price:</strong> ₹{p.amazonPrice}
                            </p>
                            <p>
                                <strong>Flipkart Price:</strong> ₹{p.flipkartPrice}
                            </p>
                            <p>
                                <strong>Meesho Price:</strong> ₹{p.meeshoPrice}
                            </p>

                            <p>
                                <strong>Stock:</strong> {p.quantityInStock}
                            </p>

                            <hr />
                            <div className="time" style={{ fontSize: "12px" }}>
                                {readDate(p.updatedAt)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProductCatalogList;
