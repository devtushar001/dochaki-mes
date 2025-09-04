import { CatalogModel } from "../Models/CatalogModel.js";
import validator from "validator";

export const AddCatalogController = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user;
        const userData = await UserModel.findById(userId);

        const {
            productId,
            productName,
            imageUrl,
            description,
            manufacturingCost,
            dealerPrice,
            sellingPrice,
            amazonPrice,
            flipkartPrice,
            meeshoPrice,
            quantityInStock,
            minOrderQuantity,
            category,
            brand,
            sku,
            barcode,
            dimensions,
            weight,
            colorOptions,
            materialType,
        } = req.body;

        // Sanitize string inputs to prevent XSS
        productId = sanitizeHtml(productId || "").trim();
        productName = sanitizeHtml(productName || "").trim();
        description = sanitizeHtml(description || "").trim();
        category = sanitizeHtml(category || "").trim();
        brand = sanitizeHtml(brand || "").trim();
        sku = sanitizeHtml(sku || "").trim();
        barcode = sanitizeHtml(barcode || "").trim();
        materialType = sanitizeHtml(materialType || "").trim();


        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (!userData.isVerified || !userData.access) {
            return res.status(403).json({
                success: false,
                message: "You have no access for these routes."
            });
        }

        // Validation checks
        if (!productId || !productName || !category) {
            return res.status(400).json({
                success: false,
                message: "Product ID, Name and Category are required.",
            });
        }

        if (imageUrl && !validator.isURL(imageUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image URL format.",
            });
        }

        if (manufacturingCost < 0 || dealerPrice < 0 || sellingPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Prices cannot be negative.",
            });
        }

        if (quantityInStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock quantity cannot be negative.",
            });
        }

        // Create new product
        const newProduct = await CatalogModel.create({
            productId,
            productName,
            imageUrl,
            description,
            manufacturingCost,
            dealerPrice,
            sellingPrice,
            amazonPrice,
            flipkartPrice,
            meeshoPrice,
            quantityInStock,
            minOrderQuantity,
            category,
            brand,
            sku,
            barcode,
            dimensions,
            weight,
            colorOptions,
            materialType,
            createdBy: req.user ? req.user._id : null, // Agar login user system hai
        });

        return res.status(201).json({
            success: true,
            message: "Product added to catalog successfully!",
            data: newProduct,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `${error.name}: ${error.message}`,
        });
    }
};


export const FetchCatalogController = async (req, res) => {
    try {
        // Query params se filter (optional)
        let { productId, category } = req.query;

        // sanitize inputs
        productId = sanitizeHtml(productId || "").trim();
        category = sanitizeHtml(category || "").trim();

        let query = {};

        if (productId) {
            query.productId = productId;
        }

        if (category) {
            query.category = category;
        }

        // MongoDB se fetch
        const products = await CatalogModel.find(query).lean();

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in catalog",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.name}: ${error.message}`,
        });
    }
};