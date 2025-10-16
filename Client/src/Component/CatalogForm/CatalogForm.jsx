import React, { useEffect, useState } from "react";
import "./CatalogForm.css";
import ImageUploader from "../ImageUploader/ImageUploader";

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

  const [productImage, setProductImage] = useState({
    type: "single",
    selection: false,
    image: null,
  });

  useEffect(() => {
    console.log(productImage);
  }, [productImage])

  const [errors, setErrors] = useState({});

  // Update imageUrl when productImage changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, imageUrl: productImage.image || "" }));
  }, [productImage.image]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.productCode.trim()) newErrors.productCode = "Product code is required";
    if (!formData.productName.trim()) newErrors.productName = "Product name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.weight < 0) newErrors.weight = "Weight cannot be negative";
    if (formData.tradePrice < 0) newErrors.tradePrice = "Trade Price cannot be negative";
    if (formData.mrp < 0) newErrors.mrp = "MRP cannot be negative";
    if (formData.gstPercent < 0 || formData.gstPercent > 100) newErrors.gstPercent = "GST must be 0-100";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
            {errors.productCode && <span className="error">{errors.productCode}</span>}
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
            {errors.productName && <span className="error">{errors.productName}</span>}
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
            {errors.category && <span className="error">{errors.category}</span>}
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
            <input type="text" name="material" value={formData.material} onChange={handleChange} />
          </label>

          <label>
            Finish:
            <input type="text" name="finish" value={formData.finish} onChange={handleChange} />
          </label>

          <label>
            Dimensions:
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} />
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
            {errors.weight && <span className="error">{errors.weight}</span>}
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
            {errors.tradePrice && <span className="error">{errors.tradePrice}</span>}
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
            {errors.gstPercent && <span className="error">{errors.gstPercent}</span>}
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
            {errors.mrp && <span className="error">{errors.mrp}</span>}
          </label>

          <label>
            Stock Status:
            <select name="stockStatus" value={formData.stockStatus} onChange={handleChange}>
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
            {productImage.selection && (
              <ImageUploader object={productImage} imageSelector={setProductImage} />
            )}



            {formData.imageUrl && (
              <img style={{ width: "210px" }} src={formData.imageUrl} alt="Preview" className="image-preview" />
            )}
          </label>
          <button
            type="button"
            onClick={() => setProductImage((prev) => ({ ...prev, selection: true }))}
          >
            Choose Image
          </button>
          <label className="span-two">
            Remarks:
            <textarea name="remarks" rows="2" value={formData.remarks} onChange={handleChange} />
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
