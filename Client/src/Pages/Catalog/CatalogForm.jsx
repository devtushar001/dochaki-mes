import React, { useMemo, useState } from "react";
import "./CatalogForm.css";

const defaultData = {
   productId: "",
   productName: "",
   imageUrl: "",
   description: "",
   manufacturingCost: "",
   dealerPrice: "",
   sellingPrice: "",
   amazonPrice: "",
   flipkartPrice: "",
   meeshoPrice: "",
   quantityInStock: "",
   minOrderQuantity: "",
   category: "",
   brand: "",
   sku: "",
   barcode: "",
   dimensions: "",
   weight: "",
   colorOptions: "",
   materialType: "",
   isActive: true,
   isFeatured: false,
   createdBy: "",
};

const CatalogForm = ({ initialData = {}, onSubmit }) => {
   const [form, setForm] = useState({ ...defaultData, ...initialData });
   const [touched, setTouched] = useState({});

   const errors = useMemo(() => {
      const e = {};
      if (!form.productId.trim()) e.productId = "Required";
      if (!form.productName.trim()) e.productName = "Required";
      if (!form.sellingPrice || Number(form.sellingPrice) <= 0) e.sellingPrice = "Enter a valid price";
      if (!form.quantityInStock || Number(form.quantityInStock) < 0) e.quantityInStock = "Enter a valid quantity";
      if (form.imageUrl && !/^https?:\/\/.+/i.test(form.imageUrl)) e.imageUrl = "Must be a valid URL (http/https)";
      return e;
   }, [form]);

   const isInvalid = (name) => touched[name] && errors[name];

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleNumber = (e) => {
      const { name, value } = e.target;
      if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
         setForm((prev) => ({ ...prev, [name]: value }));
      }
   };

   const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

   const submit = (e) => {
      e.preventDefault();
      setTouched(Object.keys(form).reduce((acc, k) => ((acc[k] = true), acc), {}));
      if (Object.keys(errors).length === 0) {
         const payload = {
            ...form,
            manufacturingCost: Number(form.manufacturingCost || 0),
            dealerPrice: Number(form.dealerPrice || 0),
            sellingPrice: Number(form.sellingPrice || 0),
            amazonPrice: Number(form.amazonPrice || 0),
            flipkartPrice: Number(form.flipkartPrice || 0),
            meeshoPrice: Number(form.meeshoPrice || 0),
            quantityInStock: Number(form.quantityInStock || 0),
            minOrderQuantity: Number(form.minOrderQuantity || 0),
            weight: Number(form.weight || 0),
            colorOptions: form.colorOptions
               ? form.colorOptions.split(",").map((c) => c.trim()).filter(Boolean)
               : [],
         };
         onSubmit ? onSubmit(payload) : console.log("Submit payload:", payload);
      }
   };

   return (
      <form className="catalog-form" onSubmit={submit} noValidate>
         <header className="cf-head">
            <h2>Product Catalog</h2>
            <div className="cf-actions">
               <button type="submit" className="cf-btn primary">Save</button>
               <button type="reset" className="cf-btn" onClick={() => setForm(defaultData)}>Reset</button>
            </div>
         </header>

         {/* Sections */}
         {/* ---- Basic Info ---- */}
         <section className="cf-section">
            <h3>Basic Info</h3>
            <div className="cf-grid">
               <div className={`cf-field ${isInvalid("productId") ? "error" : ""}`}>
                  <label>Product ID *</label>
                  <input
                     name="productId"
                     value={form.productId}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="e.g., P-000123"
                  />
                  {isInvalid("productId") && <small>{errors.productId}</small>}
               </div>

               <div className={`cf-field ${isInvalid("productName") ? "error" : ""}`}>
                  <label>Product Name *</label>
                  <input
                     name="productName"
                     value={form.productName}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="e.g., Premium Helmet"
                  />
                  {isInvalid("productName") && <small>{errors.productName}</small>}
               </div>

               <div className={`cf-field url ${isInvalid("imageUrl") ? "error" : ""}`}>
                  <label>Image URL</label>
                  <input
                     name="imageUrl"
                     value={form.imageUrl}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="https://..."
                  />
                  {isInvalid("imageUrl") && <small>{errors.imageUrl}</small>}
               </div>

               <div className="cf-field">
                  <label>Brand</label>
                  <input
                     name="brand"
                     value={form.brand}
                     onChange={handleChange}
                     placeholder="e.g., DoChaki"
                  />
               </div>

               <div className="cf-field">
                  <label>Category</label>
                  <input
                     name="category"
                     value={form.category}
                     onChange={handleChange}
                     placeholder="e.g., Accessories"
                  />
               </div>

               <div className="cf-field">
                  <label>Created By</label>
                  <input
                     name="createdBy"
                     value={form.createdBy}
                     onChange={handleChange}
                     placeholder="e.g., admin@company.com"
                  />
               </div>

               <div className="cf-field full">
                  <label>Description</label>
                  <textarea
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                     rows={3}
                     placeholder="Short description / specs"
                  />
               </div>
            </div>

            {form.imageUrl ? (
               <div className="cf-image-preview">
                  <img src={form.imageUrl} alt="preview" onError={(e) => (e.currentTarget.style.display = "none")} />
               </div>
            ) : null}
         </section>

         {/* ---- Pricing ---- */}
         <section className="cf-section">
            <h3>Pricing</h3>
            <div className="cf-grid">
               <div className="cf-field">
                  <label>Manufacturing Cost</label>
                  <input name="manufacturingCost" value={form.manufacturingCost} onChange={handleNumber} inputMode="decimal" placeholder="0.00" />
               </div>
               <div className="cf-field">
                  <label>Dealer Price</label>
                  <input name="dealerPrice" value={form.dealerPrice} onChange={handleNumber} inputMode="decimal" placeholder="0.00" />
               </div>
               <div className={`cf-field ${isInvalid("sellingPrice") ? "error" : ""}`}>
                  <label>Selling Price *</label>
                  <input name="sellingPrice" value={form.sellingPrice} onChange={handleNumber} onBlur={handleBlur} inputMode="decimal" placeholder="0.00" />
                  {isInvalid("sellingPrice") && <small>{errors.sellingPrice}</small>}
               </div>
               <div className="cf-field">
                  <label>Amazon Price</label>
                  <input name="amazonPrice" value={form.amazonPrice} onChange={handleNumber} inputMode="decimal" placeholder="0.00" />
               </div>
               <div className="cf-field">
                  <label>Flipkart Price</label>
                  <input name="flipkartPrice" value={form.flipkartPrice} onChange={handleNumber} inputMode="decimal" placeholder="0.00" />
               </div>
               <div className="cf-field">
                  <label>Meesho Price</label>
                  <input name="meeshoPrice" value={form.meeshoPrice} onChange={handleNumber} inputMode="decimal" placeholder="0.00" />
               </div>
            </div>
         </section>

         {/* ---- Inventory ---- */}
         <section className="cf-section">
            <h3>Inventory</h3>
            <div className="cf-grid">
               <div className={`cf-field ${isInvalid("quantityInStock") ? "error" : ""}`}>
                  <label>Quantity in Stock *</label>
                  <input name="quantityInStock" value={form.quantityInStock} onChange={handleNumber} onBlur={handleBlur} inputMode="numeric" placeholder="0" />
                  {isInvalid("quantityInStock") && <small>{errors.quantityInStock}</small>}
               </div>
               <div className="cf-field">
                  <label>Min Order Quantity</label>
                  <input name="minOrderQuantity" value={form.minOrderQuantity} onChange={handleNumber} inputMode="numeric" placeholder="1" />
               </div>
               <div className="cf-field">
                  <label>SKU</label>
                  <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g., DK-HELM-XL-BLK" />
               </div>
               <div className="cf-field">
                  <label>Barcode</label>
                  <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="EAN/UPC" />
               </div>
            </div>
         </section>

         {/* ---- Attributes ---- */}
         <section className="cf-section">
            <h3>Attributes</h3>
            <div className="cf-grid">
               <div className="cf-field">
                  <label>Dimensions</label>
                  <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g., 30 x 20 x 15 cm" />
               </div>
               <div className="cf-field">
                  <label>Weight (kg)</label>
                  <input name="weight" value={form.weight} onChange={handleNumber} inputMode="decimal" placeholder="0.0" />
               </div>
               <div className="cf-field">
                  <label>Color Options (comma separated)</label>
                  <input name="colorOptions" value={form.colorOptions} onChange={handleChange} placeholder="Red, Blue, Black" />
               </div>
               <div className="cf-field">
                  <label>Material Type</label>
                  <input name="materialType" value={form.materialType} onChange={handleChange} placeholder="e.g., ABS, Leather" />
               </div>
               <div className="cf-field switches">
                  <label className="cf-switch">
                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                     <span>Active</span>
                  </label>
                  <label className="cf-switch">
                     <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                     <span>Featured</span>
                  </label>
               </div>
            </div>
         </section>
      </form>
   );
};

export default CatalogForm;
