import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMinus,
  HiPlus,
  HiCheck,
  HiHeart,
  HiShare,
  HiCamera,
} from "react-icons/hi";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import {
  pageTransition,
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "../utils/animations";
import { ProductDetailsSkeleton } from "../components/ui/Skeleton";
import IDMVTONTryOn from "../components/ui/IDMVTONTryOn";
import SizeChartModal, { SizeChartButton } from "../components/ui/SizeChart";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [formError, setFormError] = useState("");
  const [showIDMVTON, setShowIDMVTON] = useState(false);
  const [selectedColor, setSelectedColor] = useState({
    id: "default",
    name: "Default",
  });
  const [showSizeChart, setShowSizeChart] = useState(false);

  const { addToCart } = useCart();

  // Available sizes based on category
  const getSizesForCategory = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("kid")) {
      return ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
    }
    if (cat.includes("unstitched")) {
      return ["Standard"];
    }
    return ["XS", "S", "M", "L", "XL", "XXL"];
  };

  useEffect(() => {
    fetchProduct();
    setSelectedSize("");
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);
    setFormError("");
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getOne(productId);
      setProduct(response.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setFormError("Please select a size");
      return;
    }

    const result = addToCart(product, quantity, selectedSize, "");
    if (result.success) {
      setAddedToCart(true);
      setFormError("");
      setTimeout(() => setAddedToCart(false), 3000);
    } else {
      setFormError(result.message);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return price;
  };

  // Get images array
  const getImages = () => {
    if (product?.image_urls?.length) return product.image_urls;
    if (product?.images?.length) return product.images;
    return [];
  };

  if (loading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-20"
      >
        <ProductDetailsSkeleton />
      </motion.div>
    );
  }

  if (error || !product) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen pt-20 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Product not found"}</p>
          <Link
            to="/products"
            className="px-6 py-2 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </motion.div>
    );
  }

  const images = getImages();
  const sizes = getSizesForCategory(product.category);
  const brandName = product.brandCollection || product.brand;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-luxury-400 flex-wrap">
            <li>
              <Link to="/" className="hover:text-gold-400 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to="/products"
                className="hover:text-gold-400 transition-colors"
              >
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                to={`/brands/${brandName}`}
                className="hover:text-gold-400 transition-colors capitalize"
              >
                {brandName}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-luxury-800">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Category Badge */}
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-luxury-950 text-xs font-semibold rounded-full capitalize">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.slice(0, 5).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-gold-500"
                          : "border-transparent hover:border-luxury-600"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Brand */}
            <motion.div variants={staggerItem}>
              <Link
                to={`/brands/${brandName}`}
                className="text-sm text-gold-400 font-medium uppercase tracking-wider hover:text-gold-300 transition-colors"
              >
                {brandName}
              </Link>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={staggerItem}
              className="text-2xl md:text-3xl font-serif font-bold text-white"
            >
              {product.name}
            </motion.h1>

            {/* Price */}
            <motion.div variants={staggerItem}>
              <span className="text-2xl md:text-3xl font-bold text-gold-400">
                {formatPrice(product.price)}
              </span>
            </motion.div>

            {/* Category */}
            {product.category && (
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-luxury-400">Category:</span>
                <span className="text-sm text-white capitalize">
                  {product.category}
                </span>
              </motion.div>
            )}

            {/* Details */}
            {product.details && product.details.length > 0 && (
              <motion.div variants={staggerItem}>
                <h3 className="text-sm font-medium text-white mb-2">
                  Product Details
                </h3>
                <ul className="text-sm text-luxury-300 space-y-1">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gold-500 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Size Selection */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white">
                  Size <span className="text-red-400">*</span>
                  {selectedSize && (
                    <span className="text-luxury-400 ml-2">
                      ({selectedSize})
                    </span>
                  )}
                </p>
                <SizeChartButton
                  category={product.category}
                  onClick={() => setShowSizeChart(true)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setFormError("");
                    }}
                    className={`min-w-[3rem] px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                      selectedSize === size
                        ? "bg-gold-500 text-luxury-950 border-gold-500"
                        : "bg-luxury-800 text-white border-luxury-700 hover:border-gold-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div variants={staggerItem}>
              <p className="text-sm font-medium text-white mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-luxury-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-luxury-400 hover:text-white transition-colors"
                  >
                    <HiMinus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-luxury-400 hover:text-white transition-colors"
                  >
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            {formError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {formError}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex-1 py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-gold-500 text-luxury-950 hover:bg-gold-400"
                }`}
              >
                {addedToCart ? (
                  <>
                    <HiCheck className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-luxury-800 text-white rounded-lg hover:bg-luxury-700 transition-colors"
              >
                <HiHeart className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-luxury-800 text-white rounded-lg hover:bg-luxury-700 transition-colors"
              >
                <HiShare className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* ADVANCED Virtual Try-On Button */}
            <motion.div variants={staggerItem}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowIDMVTON(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <HiCamera className="w-5 h-5" />
                🚀 Advanced Virtual Try-On
              </motion.button>
            </motion.div>

            {/* Product URL */}
            {product.product_url && (
              <motion.div
                variants={staggerItem}
                className="pt-4 border-t border-luxury-800"
              >
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  View on Official Website →
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ADVANCED IDM-VTON Try-On Modal */}
      {showIDMVTON && (
        <IDMVTONTryOn
          product={product}
          selectedColor={selectedColor}
          onClose={() => setShowIDMVTON(false)}
        />
      )}

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        category={product?.category}
      />
    </motion.div>
  );
};

export default ProductDetailsPage;
