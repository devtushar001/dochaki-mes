import React, { useContext, useEffect, useState } from "react";
import "./StockMaterial.css";
import ImageUploader from "../../Component/ImageUploader/ImageUploader";
import { MesContext } from "../../Context/MesContextProvider";
import { toast } from "react-toastify";
import { assets } from "../../Assets/Assets";

const UpdatedRawMaterial = () => {
    const [addNew, setAddNew] = useState(false);
    const [inOut, setInOut] = useState(false);
    const [productId, setProductId] = useState("");
    const { backend_url, rawMaterials, setRawMaterials, token, setLoginSignup } =
        useContext(MesContext);
    const [productImage, setProductImage] = useState({
        type: "single",
        selection: false,
        image: null,
    });
    const [rawData, setRawData] = useState({
        materialName: "",
        imageUrl: "",
        description: "",
        quantity: 0,
        color: "",
        productId: "",
    });
    const [searchQuery, setSearchQuery] = useState("All");

    const [data, setData] = useState({
        ProductId: "",
        changeType: "in",
        saleType: "default",
        message: "",
        quantity: 0,
    });

    const [productEdit, setProductEdit] = useState({ action: false, productId: "" });

    // Fetch products
    const fetchProduct = async () => {
        if (!token) return setLoginSignup(true);

        try {
            const res = await fetch(
                `${backend_url}/api/stock-material/get?query=${searchQuery}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch raw materials");

            const data = await res.json();
            if (!data.success) return toast.error(data.message);

            setRawMaterials(data.data);
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [backend_url, searchQuery]);

    // Create product
    const createRawProduct = async () => {
        if (!token) return setLoginSignup(true);

        try {
            const res = await fetch(`${backend_url}/api/stock-material/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(rawData),
            });

            if (!res.ok) throw new Error("Failed to create product");

            const data = await res.json();
            if (!data.success) return toast.error(data.message);

            setRawMaterials((prev) => [...prev, data.data]);

            // Reset form
            setRawData({ materialName: "", imageUrl: "", description: "", quantity: 0, color: "" });
            setProductImage({ type: "single", selection: false, image: null });
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    // Delete product
    const deleteRawProduct = async (id) => {
        const confirmed = window.confirm(`Delete product with ID: ${id}?`);
        if (!confirmed) return;

        if (!token) return setLoginSignup(true);

        try {
            const res = await fetch(`${backend_url}/api/stock-material/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete product");

            const data = await res.json();
            if (!data.success) return toast.error(data.message);

            fetchProduct();
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    // Sync image with rawData
    useEffect(() => {
        if (productImage.image) {
            setRawData((prev) => ({ ...prev, imageUrl: productImage.image }));
        }
    }, [productImage.image]);

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRawData((prev) => ({ ...prev, [name]: value }));
    };

    // Update stock quantity (in/out)
    const updateRawMaterial = async () => {
        if (!token) return setLoginSignup(true);

        try {
            const res = await fetch(`${backend_url}/api/stock-material-update/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Error updating stock");

            const result = await res.json();
            if (!result.success) return toast.error(result.message);

            fetchProduct();
            setData((prev) => ({ ...prev, changeType: "in" }));
            setInOut(false);
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    // Update stock item details
    const updateStockProductsData = async (id) => {
        if (!id) return alert("Product ID not provided");
        if (!token) return setLoginSignup(true);

        try {
            const res = await fetch(`${backend_url}/api/stock-material/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId: id, ...rawData }),
            });

            if (!res.ok) throw new Error("Failed to update product");

            const result = await res.json();
            if (!result.success) return toast.error(result.message);

            toast.success(result.message);
            fetchProduct();
            setProductEdit({ action: false, productId: "" });
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    return (
        <>
            <div className="updated-stock-material">
                {/* Search + Add */}
                <div className="updated-controll-form-btn">
                    <input
                        className="search-bar"
                        style={{ paddingLeft: "12px" }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Search item"
                    />
                    <button onClick={() => setAddNew(!addNew)}>
                        {addNew ? "Close" : "Add New Product"}
                    </button>
                </div>

                {/* Add new product form */}
                {addNew && (
                    <div className="updated-add-new-stock-material">
                        <div className="box">
                            <div className="image">
                                {productImage.image ? (
                                    <img style={{ width: "210px" }} src={productImage.image} alt="Product" />
                                ) : (
                                    <p>No image selected</p>
                                )}
                            </div>
                            <div className="updated-material-name">
                                <button onClick={() => setProductImage((prev) => ({ ...prev, selection: true }))}>
                                    Choose Image
                                </button>
                                <input
                                    value={rawData.materialName}
                                    onChange={handleChange}
                                    name="materialName"
                                    type="text"
                                    placeholder="Material name"
                                />
                            </div>

                            {productImage.selection && (
                                <ImageUploader object={productImage} imageSelector={setProductImage} />
                            )}

                            <textarea
                                value={rawData.description}
                                onChange={handleChange}
                                name="description"
                                placeholder="Description / keywords"
                            />
                            <input
                                value={rawData.productId}
                                style={{ height: "35px" }}
                                onChange={handleChange}
                                name="productId"
                                type="text"
                                placeholder="Enter product id or Create"
                            />

                            <div className="updated-material-info">
                                <input
                                    value={rawData.quantity}
                                    onChange={handleChange}
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                />
                                <input
                                    value={rawData.color}
                                    onChange={handleChange}
                                    type="text"
                                    name="color"
                                    placeholder="Color"
                                />
                            </div>

                            <button onClick={createRawProduct} className="updated-submit">
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* Product List */}
                {!addNew &&
                    (rawMaterials.length === 0 ? (
                        <p>No stock materials available. Please add one.</p>
                    ) : (
                        <div className="table-container">
                            {rawMaterials.map((material, index) => (
                                <div className="table-body" key={material._id}>
                                    <div className="serial-no">
                                        <span>S.N.</span>
                                        <span>{index + 1}</span>
                                    </div>
                                    <div className="name">
                                        <span>Item name</span>
                                        <span>{material.materialName}</span>
                                    </div>
                                    <div className="image">
                                        <span>Image</span>
                                        <span>
                                            <img
                                                src={material.imageUrl}
                                                alt="Material"
                                                className="updated-img-thumbnail"
                                            />
                                        </span>
                                    </div>
                                    <div className="product-id">
                                        <span>Product id</span>
                                        <span>
                                            {material.productId ? material.productId : "Id not mentioned."}
                                        </span>
                                    </div>
                                    <div className="description">
                                        <span>Description</span>
                                        <span>{material.description}</span>
                                    </div>
                                    <div className="quantity">
                                        <span>Quantity</span>
                                        <span>{material.quantity}</span>
                                    </div>
                                    <div className="color">
                                        <span>Color</span>
                                        <span>{material.color}</span>
                                    </div>
                                    <div className="action">
                                        <span>Action</span>
                                        <span className="btn">
                                            <button
                                                onClick={() => {
                                                    setInOut(true);
                                                    setProductId(material._id);
                                                    setData((prev) => ({ ...prev, ProductId: material._id }));
                                                }}
                                                className="updated-btn updated-btn-primary"
                                            >
                                                In Out
                                            </button>
                                            <button
                                                onClick={() => deleteRawProduct(material._id)}
                                                className="updated-btn updated-btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </span>
                                    </div>
                                    <div className="update-product">
                                        <img
                                            onClick={() => setProductEdit({ action: true, productId: material._id })}
                                            src={assets.edit_icon}
                                            alt="edit"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>

            {/* In/Out Modal */}
            {inOut && (
                <div className="edit-in-out">
                    <div className="container">
                        <div className="header">
                            <h2>Stock Update!!!</h2>
                            <span className="close" onClick={() => setInOut(false)}>
                                Close
                            </span>
                        </div>
                        {rawMaterials
                            .filter((item) => item._id === productId)
                            .map((item) => (
                                <div key={item._id} className="product-details">
                                    <img style={{ maxWidth: "110px" }} src={item.imageUrl} alt="" />
                                    <div className="info">
                                        <p>{item.materialName},</p>
                                        <p>Current-Qty: {item.quantity}</p>
                                        <p>Product Id: {item.productId}</p>
                                    </div>
                                </div>
                            ))}

                        <div className="input-system">
                            <select
                                onChange={(e) => setData((prev) => ({ ...prev, changeType: e.target.value }))}
                            >
                                <option value="in">in</option>
                                <option value="out">out</option>
                            </select>
                            <select
                                onChange={(e) => setData((prev) => ({ ...prev, saleType: e.target.value }))}
                            >
                                <option value="dealership">Website</option>
                                <option value="amazon">Amazon</option>
                                <option value="flipkart">Dealership</option>
                                <option value="dmototech">Direct Sale</option>
                                <option value="offline">Return</option>
                                <option value="raw">New Material</option>
                            </select>
                            <input
                                onChange={(e) => setData((prev) => ({ ...prev, message: e.target.value }))}
                                type="text"
                                placeholder="Remark"
                            />
                            <input
                                onChange={(e) => setData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                type="number"
                                placeholder="Quantity"
                            />
                        </div>
                        <button onClick={updateRawMaterial}>Submit</button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {productEdit.action && (
                <div className="edit-window">
                    {rawMaterials
                        .filter((item) => item._id === productEdit.productId)
                        .map((item) => (
                            <div key={item._id} className="editing-box-container">
                                <div
                                    onClick={() => setProductEdit({ action: false, productId: "" })}
                                    className="close"
                                >
                                    X
                                </div>
                                <div className="div">
                                    <span>Product Image</span>
                                    <img src={item.imageUrl} alt="Product" />

                                    <span>Material Name</span>
                                    <input
                                        onChange={(e) =>
                                            setRawData((prev) => ({ ...prev, materialName: e.target.value }))
                                        }
                                        value={rawData.materialName || item.materialName}
                                        type="text"
                                        placeholder="Material name"
                                    />

                                    <span>Color</span>
                                    <input
                                        onChange={(e) => setRawData((prev) => ({ ...prev, color: e.target.value }))}
                                        value={rawData.color || item.color}
                                        type="text"
                                        placeholder="Color"
                                    />

                                    <span>Description</span>
                                    <textarea
                                        style={{ fontFamily: "Arial" }}
                                        onChange={(e) => setRawData((prev) => ({ ...prev, description: e.target.value }))}
                                        value={rawData.description || item.description}
                                        placeholder="Description"
                                    />
                                </div>
                                <button className="btn-submit" onClick={() => updateStockProductsData(item._id)}>
                                    Edit Stock Item
                                </button>
                            </div>
                        ))}
                </div>
            )}
        </>
    );
};

export default UpdatedRawMaterial;
