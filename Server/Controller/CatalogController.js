import { CatalogModel } from "../Models/CatalogModel.js";
import validator from "validator";
import UserModel from "../Models/UserModel.js";
import sanitizeHtml from "sanitize-html";

export const AddCatalogController = async (req, res) => {
    try {
        console.log("Incoming Data:", req.body);

        //  Step 1: Authenticate User
        const userId = req.user?.id || req.user?._id || req.user;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!userData.isVerified || !userData.access) {
            return res.status(403).json({
                success: false,
                message: "You have no access for this route.",
            });
        }

        //  Step 2: Extract fields from request body
        let {
            productCode,
            productName,
            category,
            compatibleModel,
            description,
            material,
            finish,
            dimensions,
            weight,
            tradePrice,
            gstPercent,
            mrp,
            stockStatus,
            listingPlatforms,
            imageUrl,
            dateAdded,
            remarks,
        } = req.body;

        //  Step 3: Validate required fields
        if (!productCode || !productName || !category) {
            return res.status(400).json({
                success: false,
                message: "Product Code, Name, and Category are required.",
            });
        }

        //  Step 4: Validate data types and values
        if (imageUrl && !validator.isURL(imageUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image URL format.",
            });
        }

        if (tradePrice < 0 || mrp < 0) {
            return res.status(400).json({
                success: false,
                message: "Price values cannot be negative.",
            });
        }

        if (weight < 0) {
            return res.status(400).json({
                success: false,
                message: "Weight cannot be negative.",
            });
        }

        if (gstPercent < 0 || gstPercent > 100) {
            return res.status(400).json({
                success: false,
                message: "GST percentage must be between 0 and 100.",
            });
        }

        //  Step 5: Prevent duplicate productCode
        const existingProduct = await CatalogModel.findOne({ productCode });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product with this code already exists.",
            });
        }

        //  Step 6: Format listing platforms (comma-separated → array)
        if (typeof listingPlatforms === "string") {
            listingPlatforms = listingPlatforms
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean);
        }

        //  Step 7: Create new product
        const newProduct = await CatalogModel.create({
            productCode,
            productName,
            category,
            compatibleModel,
            description,
            material,
            finish,
            dimensions,
            weight,
            tradePrice,
            gstPercent,
            mrp,
            stockStatus,
            listingPlatforms,
            imageUrl,
            dateAdded: dateAdded || new Date(),
            remarks,
            createdBy: userId,
        });

        //  Step 8: Send response
        return res.status(201).json({
            success: true,
            message: "Product added to catalog successfully!",
            data: newProduct,
        });

    } catch (error) {
        console.error("AddCatalogController Error:", error);
        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
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