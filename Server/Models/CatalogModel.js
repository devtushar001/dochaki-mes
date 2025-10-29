import mongoose from "mongoose";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
import UserModel from "./UserModel.js"; // optional import if used for relation

// Sanitize string inputs to prevent HTML/script injection
const sanitizeInput = (value) => {
    if (typeof value !== "string") return value;
    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();
};

const CatalogSchema = new mongoose.Schema(
    {
        productCode: {
            type: String,
            required: [true, "Product code is required"],
            unique: true,
            trim: true,
            set: sanitizeInput,
        },
        productName: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            set: sanitizeInput,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            set: sanitizeInput,
        },
        compatibleModel: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        description: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        material: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        finish: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        dimensions: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        weight: {
            type: Number,
            default: 0,
            min: [0, "Weight cannot be negative"],
        },
        tradePrice: {
            type: Number,
            required: [true, "Trade price is required"],
            min: [0, "Trade price cannot be negative"],
        },
        gstPercent: {
            type: Number,
            default: 18,
            min: [0, "GST cannot be negative"],
            max: [100, "GST cannot exceed 100%"],
        },
        mrp: {
            type: Number,
            required: [true, "MRP is required"],
            min: [0, "MRP cannot be negative"],
        },
        stockStatus: {
            type: String,
            enum: ["In Stock", "Out of Stock", "Made to Order"],
            default: "In Stock",
        },
        listingPlatforms: {
            type: [String],
            default: [],
            validate: {
                validator: (arr) => Array.isArray(arr),
                message: "Listing platforms must be an array of strings",
            },
        },
        imageUrl: {
            type: String,
            default: "",
            trim: true,
            validate: {
                validator: (v) => !v || validator.isURL(v),
                message: "Invalid image URL",
            },
        },
        dateAdded: {
            type: Date,
            default: Date.now,
        },
        remarks: {
            type: String,
            default: "",
            set: sanitizeInput,
        },
        // Optional: link to the user who created it (if you use authentication)
        createdBy: {
            type: {
                String
            },
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// 🔹 Optional: Pre-save validation — ensure MRP ≥ Trade Price
CatalogSchema.pre("save", function (next) {
    if (this.mrp < this.tradePrice) {
        return next(new Error("MRP cannot be less than trade price"));
    }
    next();
});

export const CatalogModel = mongoose.models.Product || mongoose.model("Product", CatalogSchema);