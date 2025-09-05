import mongoose from "mongoose";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
import UserModel from './UserModel.js';
const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;
    return sanitizeHtml(value, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {},
    }).trim();
};

const productCatalogSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            set: sanitizeInput,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
            set: sanitizeInput,
        },
        imageUrl: {
            type: String,
            default: "https://surl.li/raobve",
            validate: {
                validator: (v) => validator.isURL(v),
                message: "Invalid image URL",
            },
        },
        description: {
            type: String,
            set: sanitizeInput,
        },

        // Costing & Pricing
        manufacturingCost: {
            type: Number,
            required: true,
            min: [0, "Manufacturing cost cannot be negative"],
        },
        dealerPrice: {
            type: Number,
            required: true,
            min: [0, "Dealer price cannot be negative"],
        },
        sellingPrice: {
            type: Number,
            required: true,
            min: [0, "Selling price cannot be negative"],
        },
        amazonPrice: {
            type: Number,
            min: [0, "Amazon price cannot be negative"],
        },
        flipkartPrice: {
            type: Number,
            min: [0, "Flipkart price cannot be negative"],
        },
        meeshoPrice: {
            type: Number,
            min: [0, "Meesho price cannot be negative"],
        },

        // Inventory
        quantityInStock: {
            type: Number,
            default: 0,
            min: [0, "Stock cannot be negative"],
        },
        minOrderQuantity: {
            type: Number,
            default: 1,
            min: [1, "Min order must be at least 1"],
        },

        // Category & Branding
        category: {
            type: String,
            required: true,
            trim: true,
            set: sanitizeInput,
        },
        brand: {
            type: String,
            trim: true,
            set: sanitizeInput,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
            set: sanitizeInput,
        },
        barcode: {
            type: String,
            unique: true,
            sparse: true,
            set: sanitizeInput,
        },

        // Extra fields
        dimensions: {
            length: { type: Number, min: 0 },
            width: { type: Number, min: 0 },
            height: { type: Number, min: 0 },
        },
        weight: {
            type: Number,
            min: [0, "Weight cannot be negative"],
        },
        colorOptions: {
            type: [String],
            set: (arr) => arr.map(sanitizeInput),
        },
        materialType: {
            type: String,
            set: sanitizeInput,
        },

        // Flags
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },

        // Tracking
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    },
    { timestamps: true }
);

export const CatalogModel =
    mongoose.models.ProductCatalog ||
    mongoose.model("ProductCatalog", productCatalogSchema);
