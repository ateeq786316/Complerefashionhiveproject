import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import idmVTONRoutes from "./routes/idmVTONRoutes.js"; // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/products", productRoutes);
    app.use("/api/brands", brandRoutes);
    app.use("/api/idm-vton", idmVTONRoutes);

    app.get("/api/health", (req, res) => {
      res.json({
        status: "OK",
        message: "FashionHiveAI API is running",
        database: "brands",
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    app.listen(PORT, () => {
      console.log(`?? FashionHiveAI Server running on port ${PORT}`);
      console.log(`?? API available at http://localhost:${PORT}/api`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  GET /api/health - Health check`);
      console.log(`  GET /api/brands - List all brand collections`);
      console.log(`  GET /api/brands/categories - List all categories`);
      console.log(`  GET /api/products - Get all products`);
      console.log(
        `  GET /api/products/brand/:brandName - Get products by brand`
      );
      console.log(`  GET /api/products/:id - Get product by ObjectId`);
      console.log(`  POST /api/idm-vton/process - Virtual try-on processing`);
      console.log(`  GET /api/idm-vton/status - Check try-on service status`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
