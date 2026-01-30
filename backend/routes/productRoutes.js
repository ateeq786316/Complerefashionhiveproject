import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductsByBrand,
  getProductById,
  getFeaturedProducts,
} from "../controllers/productController.js";

// GET /api/products/featured - Get featured products (must be before /:id)
router.get("/featured", getFeaturedProducts);

// GET /api/products/brand/:brandName - Get products from specific brand
router.get("/brand/:brandName", getProductsByBrand);

// GET /api/products - Get all products from all collections
router.get("/", getAllProducts);

// GET /api/products/:id - Get single product by ObjectId
router.get("/:id", getProductById);

export default router;
