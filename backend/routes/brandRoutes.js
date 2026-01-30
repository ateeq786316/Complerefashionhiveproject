import express from "express";
const router = express.Router();
import {
  getAllBrands,
  getBrandByName,
  getAllCategories,
} from "../controllers/productController.js";

// GET /api/brands - Get all brands
router.get("/", getAllBrands);

// GET /api/brands/categories - Get all categories (must be before /:brandName)
router.get("/categories", getAllCategories);

// GET /api/brands/:brandName - Get single brand
router.get("/:brandName", getBrandByName);

export default router;
