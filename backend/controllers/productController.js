import { ObjectId } from "mongodb";
import { getBrandCollections, getCollection } from "../config/db.js";

/**
 * @desc    Get all products from ALL brand collections
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sort = "price-desc",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const brandCollections = await getBrandCollections();

    if (brandCollections.length === 0) {
      return res.json({
        success: true,
        count: 0,
        total: 0,
        page: pageNum,
        pages: 0,
        hasMore: false,
        data: [],
      });
    }

    let collectionsToQuery = brandCollections;

    // If brand filter is specified, only query that collection
    if (brand) {
      const matchedBrand = brandCollections.find(
        (name) => name.toLowerCase() === brand.toLowerCase()
      );
      if (matchedBrand) {
        collectionsToQuery = [matchedBrand];
      } else {
        return res.json({
          success: true,
          count: 0,
          total: 0,
          page: pageNum,
          pages: 0,
          hasMore: false,
          data: [],
        });
      }
    }

    // Build query filter
    let query = {};

    // Category filter
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Price filter - extract numeric value from price string like "Rs.3,990"
    // This will be done after fetching since price is stored as string

    // Fetch products from selected collections
    let allProducts = [];

    for (const brandName of collectionsToQuery) {
      const collection = getCollection(brandName);
      const products = await collection.find(query).toArray();

      // Add brandCollection field for reference
      const productsWithBrand = products.map((product) => ({
        ...product,
        brandCollection: brandName,
        // Parse price for filtering/sorting
        numericPrice: parsePrice(product.price),
      }));

      allProducts = allProducts.concat(productsWithBrand);
    }

    // Apply price filters
    if (minPrice) {
      const min = parseFloat(minPrice);
      allProducts = allProducts.filter((p) => p.numericPrice >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      allProducts = allProducts.filter((p) => p.numericPrice <= max);
    }

    // Sort products
    switch (sort) {
      case "price-asc":
        allProducts.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "price-desc":
        allProducts.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "name-asc":
        allProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        allProducts.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default: // newest - by _id descending
        allProducts.sort((a, b) => {
          const aId = a._id.toString();
          const bId = b._id.toString();
          return bId.localeCompare(aId);
        });
    }

    const totalCount = allProducts.length;
    const paginatedProducts = allProducts.slice(skip, skip + limitNum);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      count: paginatedProducts.length,
      total: totalCount,
      page: pageNum,
      pages: totalPages,
      hasMore: pageNum < totalPages,
      data: paginatedProducts,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get products from a specific brand collection
 * @route   GET /api/products/brand/:brandName
 * @access  Public
 */
const getProductsByBrand = async (req, res) => {
  try {
    const { brandName } = req.params;
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sort = "price-desc",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const brandCollections = await getBrandCollections();

    // Find matching collection
    let collectionName = brandCollections.find((name) => name === brandName);
    if (!collectionName) {
      collectionName = brandCollections.find(
        (name) => name.toLowerCase() === brandName.toLowerCase()
      );
    }

    if (!collectionName) {
      return res.status(404).json({
        success: false,
        message: `Brand '${brandName}' not found`,
        availableBrands: brandCollections,
      });
    }

    const collection = getCollection(collectionName);

    // Build query
    let query = {};
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Fetch all matching products
    let products = await collection.find(query).toArray();

    // Add brandCollection and numeric price
    products = products.map((product) => ({
      ...product,
      brandCollection: collectionName,
      numericPrice: parsePrice(product.price),
    }));

    // Apply price filters
    if (minPrice) {
      products = products.filter((p) => p.numericPrice >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.numericPrice <= parseFloat(maxPrice));
    }

    // Sort
    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case "price-desc":
        products.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case "name-asc":
        products.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        products.sort((a, b) =>
          b._id.toString().localeCompare(a._id.toString())
        );
    }

    const total = products.length;
    const paginatedProducts = products.slice(skip, skip + limitNum);
    const totalPages = Math.ceil(total / limitNum);

    // Get categories for this brand
    const allProducts = await collection.find({}).toArray();
    const categories = [
      ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ];

    res.json({
      success: true,
      brand: {
        name: collectionName,
        slug: collectionName.toLowerCase(),
        productCount: allProducts.length,
        categories,
      },
      count: paginatedProducts.length,
      total,
      page: pageNum,
      pages: totalPages,
      hasMore: pageNum < totalPages,
      data: paginatedProducts,
    });
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single product by ObjectId
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const objectId = new ObjectId(id);
    const brandCollections = await getBrandCollections();

    for (const brandName of brandCollections) {
      const collection = getCollection(brandName);
      const product = await collection.findOne({ _id: objectId });

      if (product) {
        return res.json({
          success: true,
          data: {
            ...product,
            brandCollection: brandName,
            numericPrice: parsePrice(product.price),
          },
        });
      }
    }

    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all available brands (collection names)
 * @route   GET /api/brands
 * @access  Public
 */
const getAllBrands = async (req, res) => {
  try {
    const brandCollections = await getBrandCollections();

    const brandsWithDetails = await Promise.all(
      brandCollections.map(async (brandName) => {
        const collection = getCollection(brandName);
        const count = await collection.countDocuments();
        const categories = await collection.distinct("category");

        // Get a sample product for cover image
        const sampleProduct = await collection.findOne({});
        const coverImage = sampleProduct?.image_urls?.[0] || null;

        return {
          _id: brandName,
          name: brandName,
          slug: brandName.toLowerCase(),
          productCount: count,
          categories: categories.filter(Boolean),
          coverImage,
          description: `Explore ${brandName}'s latest collection`,
        };
      })
    );

    res.json({
      success: true,
      count: brandsWithDetails.length,
      data: brandsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching brands",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single brand details
 * @route   GET /api/brands/:brandName
 * @access  Public
 */
const getBrandByName = async (req, res) => {
  try {
    const { brandName } = req.params;
    const brandCollections = await getBrandCollections();

    let collectionName = brandCollections.find(
      (name) => name.toLowerCase() === brandName.toLowerCase()
    );

    if (!collectionName) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const collection = getCollection(collectionName);
    const count = await collection.countDocuments();
    const categories = await collection.distinct("category");
    const sampleProduct = await collection.findOne({});

    res.json({
      success: true,
      data: {
        _id: collectionName,
        name: collectionName,
        slug: collectionName.toLowerCase(),
        productCount: count,
        categories: categories.filter(Boolean),
        coverImage: sampleProduct?.image_urls?.[0] || null,
        description: `Explore ${collectionName}'s latest collection`,
      },
    });
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching brand",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all unique categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res) => {
  try {
    const brandCollections = await getBrandCollections();
    const allCategories = new Set();

    for (const brandName of brandCollections) {
      const collection = getCollection(brandName);
      const categories = await collection.distinct("category");
      categories.forEach((cat) => {
        if (cat) allCategories.add(cat);
      });
    }

    res.json({
      success: true,
      count: allCategories.size,
      data: Array.from(allCategories).sort(),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

/**
 * @desc    Get featured products (random selection from each brand)
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const limitNum = parseInt(limit);

    const brandCollections = await getBrandCollections();
    let featuredProducts = [];

    // Get 2 products from each brand
    const perBrand = Math.ceil(limitNum / brandCollections.length);

    for (const brandName of brandCollections) {
      const collection = getCollection(brandName);
      const products = await collection
        .aggregate([{ $sample: { size: perBrand } }])
        .toArray();

      const productsWithBrand = products.map((product) => ({
        ...product,
        brandCollection: brandName,
        numericPrice: parsePrice(product.price),
      }));

      featuredProducts = featuredProducts.concat(productsWithBrand);
    }

    // Shuffle and limit
    featuredProducts = featuredProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, limitNum);

    res.json({
      success: true,
      count: featuredProducts.length,
      data: featuredProducts,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: error.message,
    });
  }
};

// Helper function to parse price string like "Rs.3,990" to number
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  if (typeof priceStr === "number") return priceStr;

  // Remove currency symbols, commas, and extract number
  const numStr = priceStr.toString().replace(/[^0-9.]/g, "");
  return parseFloat(numStr) || 0;
}

export {
  getAllProducts,
  getProductsByBrand,
  getProductById,
  getAllBrands,
  getBrandByName,
  getAllCategories,
  getFeaturedProducts,
};
