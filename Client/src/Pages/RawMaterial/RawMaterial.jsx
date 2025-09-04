import React, { useContext, useEffect, useState } from "react";
import "./RawMaterial.css";
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
    saleType: "dealership",
    message: "",
    quantity: 0,
  });

  const [productEdit, setProductEdit] = useState({
    productId: "",
    action: false,
  });

  // Fetch All Products
  const fetchProduct = async () => {
    if (!token) return setLoginSignup(true);

    try {
      const res = await fetch(
        `${backend_url}/api/raw-material/get?query=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch raw materials");

      const data = await res.json();
      if (data.success) setRawMaterials(data.data);
    } catch (error) {
      toast.error(`${error.name}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [backend_url, searchQuery]);

  // Create Raw Product
  const createRawProduct = async () => {
    if (!token) return setLoginSignup(true);

    try {
      const res = await fetch(`${backend_url}/api/raw-material/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rawData),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();

      if (data.success) {
        setRawMaterials((prev) => [...prev, data.data]);
        toast.success("Product created successfully");

        // Reset form
        setRawData({
          materialName: "",
          imageUrl: "",
          description: "",
          quantity: 0,
          color: "",
          productId: "",
        });
        setProductImage({ type: "single", selection: false, image: null });
      }
    } catch (error) {
      toast.error(`${error.name}: ${error.message}`);
    }
  };

  // Delete Product
  const deleteRawProduct = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this product?`)) return;

    if (!token) return setLoginSignup(true);

    try {
      const res = await fetch(`${backend_url}/api/raw-material/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProduct();
      } else {
        toast.error(data.message);
      }
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRawData((prev) => ({ ...prev, [name]: value }));
  };

  // Update Quantity (In/Out)
  const updateRawMaterial = async () => {
    if (!token) return setLoginSignup(true);

    try {
      const res = await fetch(`${backend_url}/api/update-raw/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update raw material");

      const result = await res.json();

      if (result.success) {
        toast.success("Raw material updated successfully!");
        fetchProduct();
        setData((prev) => ({ ...prev, changeType: "in", quantity: 0, message: "" }));
        setInOut(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`${error.name}: ${error.message}`);
    }
  };

  // Update Product Details
  const updateRawProductsData = async (id) => {
    if (!id) return alert("Product ID not provided");
    if (!token) return setLoginSignup(true);

    try {
      const res = await fetch(`${backend_url}/api/raw-material/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, ...rawData }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        fetchProduct();
        setProductEdit({ productId: "", action: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`${error.name}: ${error.message}`);
    }
  };

  return (
    <>
      <div className="updated-stock-material">
        {/* Search + Add Button */}
        <div className="updated-controll-form-btn">
          <input
            className="search-bar"
            style={{ paddingLeft: "12px" }}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search item"
          />
          <button onClick={() => setAddNew(!addNew)}>
            {!addNew ? "Add New Product" : "Close"}
          </button>
        </div>

        {/* Add New Form */}
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
                <button
                  onClick={() => setProductImage((prev) => ({ ...prev, selection: true }))}
                >
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
                placeholder="Description / Keywords"
              />

              <input
                value={rawData.productId}
                onChange={handleChange}
                name="productId"
                style={{ height: "35px" }}
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

        {/* Table View */}
        {!addNew && (
          rawMaterials.length === 0 ? (
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
                      onClick={() =>
                        setProductEdit({ action: true, productId: material._id })
                      }
                      src={assets.edit_icon}
                      alt="edit"
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* In/Out Update Modal */}
      {inOut && (
        <div className="edit-in-out">
          <div className="container">
            <div className="header">
              <h2>Raw Update</h2>
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
                    <p>{item.materialName}</p>
                    <p>Current Qty: {item.quantity}</p>
                    <p>Product Id: {item.productId}</p>
                  </div>
                </div>
              ))}

            <div className="input-system">
              <select
                onChange={(e) => setData((prev) => ({ ...prev, changeType: e.target.value }))}
                value={data.changeType}
              >
                <option value="in">In</option>
                <option value="out">Out</option>
              </select>

              <select
                onChange={(e) => setData((prev) => ({ ...prev, saleType: e.target.value }))}
                value={data.saleType}
              >
                <option value="dealership">Website</option>
                <option value="amazon">Amazon</option>
                <option value="flipkart">Flipkart</option>
                <option value="dmototech">Direct Sale</option>
                <option value="offline">Return</option>
                <option value="raw">New Material</option>
              </select>

              <input
                onChange={(e) => setData((prev) => ({ ...prev, message: e.target.value }))}
                value={data.message}
                type="text"
                placeholder="Remark"
              />

              <input
                onChange={(e) =>
                  setData((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                }
                value={data.quantity}
                type="number"
                placeholder="Quantity"
              />
            </div>
            <button onClick={updateRawMaterial}>Submit</button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {productEdit.action && (
        <div className="edit-window">
          {rawMaterials
            .filter((item) => item._id === productEdit.productId)
            .map((item) => (
              <div key={item._id} className="editing-box-container">
                <div
                  onClick={() => setProductEdit({ ...productEdit, action: false })}
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
                    onChange={(e) =>
                      setRawData((prev) => ({ ...prev, color: e.target.value }))
                    }
                    value={rawData.color || item.color}
                    type="text"
                    placeholder="Color"
                  />

                  <span>Description</span>
                  <textarea
                    style={{ fontFamily: "Arial" }}
                    onChange={(e) =>
                      setRawData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    value={rawData.description || item.description}
                    placeholder="Description"
                  />
                </div>

                <button
                  className="btn-submit"
                  onClick={() => updateRawProductsData(item._id)}
                >
                  Save Changes
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default UpdatedRawMaterial;
