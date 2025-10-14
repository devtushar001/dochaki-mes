import React, { useState } from "react";
import "./CatalogForm.css";

const CatalogForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    category: "",
    compatibleModel: "",
    description: "",
    material: "",
    finish: "",
    dimensions: "",
    weight: "",
    tradePrice: "",
    gstPercent: 18,
    mrp: "",
    stockStatus: "In Stock",
    listingPlatforms: "",
    imageUrl: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      listingPlatforms: formData.listingPlatforms
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };
    onSubmit && onSubmit(data);
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <label>
            Product Code:
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Compatible Model:
            <input
              type="text"
              name="compatibleModel"
              value={formData.compatibleModel}
              onChange={handleChange}
            />
          </label>

          <label className="span-two">
            Description:
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Material:
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
            />
          </label>

          <label>
            Finish:
            <input
              type="text"
              name="finish"
              value={formData.finish}
              onChange={handleChange}
            />
          </label>

          <label>
            Dimensions:
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
            />
          </label>

          <label>
            Weight (kg):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Trade Price (₹):
            <input
              type="number"
              name="tradePrice"
              value={formData.tradePrice}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            GST (%):
            <input
              type="number"
              name="gstPercent"
              value={formData.gstPercent}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </label>

          <label>
            MRP (₹):
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Stock Status:
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Made to Order">Made to Order</option>
            </select>
          </label>

          <label>
            Listing Platforms (comma separated):
            <input
              type="text"
              name="listingPlatforms"
              value={formData.listingPlatforms}
              onChange={handleChange}
              placeholder="Amazon, Flipkart"
            />
          </label>

          <label className="span-two">
            Image URL:
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </label>

          <label className="span-two">
            Remarks:
            <textarea
              name="remarks"
              rows="2"
              value={formData.remarks}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default CatalogForm;
