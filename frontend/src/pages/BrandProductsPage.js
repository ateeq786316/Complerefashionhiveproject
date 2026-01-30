import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiAdjustments, HiX, HiChevronDown } from "react-icons/hi";
import { productAPI } from "../services/api";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../utils/animations";
import ProductCard from "../components/ui/ProductCard";
import QuickViewModal from "../components/ui/QuickViewModal";
import { ProductsGridSkeleton, TextSkeleton } from "../components/ui/Skeleton";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const BrandProductsPage = () => {
  const { brandSlug } = useParams();
  const [brandInfo, setBrandInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("price-desc");

  const sortOptions = [
    { value: "price-desc", label: "Price: High to Low" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "newest", label: "Newest" },
    { value: "name-asc", label: "Name: A-Z" },
  ];

  // Fetch products
  const fetchProducts = useCallback(
    async (pageNum = 1, reset = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const response = await productAPI.getByBrand(brandSlug, {
          page: pageNum,
          limit: 12,
          category: category || undefined,
          sort: sortBy,
        });

        setBrandInfo(response.brand);
        const newProducts = response.data || [];
        setProducts(reset ? newProducts : [...products, ...newProducts]);
        setHasMore(response.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [brandSlug, category, sortBy]
  );

  // Initial fetch
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, true);
  }, [brandSlug, category, sortBy]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 500;

    if (scrollPosition >= threshold) {
      fetchProducts(page + 1);
    }
  }, [loadingMore, hasMore, page, fetchProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const clearFilters = () => {
    setCategory("");
    setSortBy("price-desc");
  };

  const hasActiveFilters = category || sortBy !== "price-desc";

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20"
    >
      {/* Brand Hero */}
      <section className="py-16 bg-gradient-luxury border-b border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && !brandInfo ? (
            <div className="text-center space-y-4">
              <TextSkeleton width="200px" height="3rem" className="mx-auto" />
              <TextSkeleton width="400px" height="1rem" className="mx-auto" />
            </div>
          ) : brandInfo ? (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 capitalize">
                {brandInfo.name}
              </h1>
              <p className="text-luxury-300 max-w-2xl mx-auto mb-4">
                {brandInfo.description ||
                  `Explore ${brandInfo.name}'s latest collection`}
              </p>
              <p className="text-sm text-luxury-500">
                {brandInfo.productCount} Products Available
              </p>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-8 bg-luxury-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-luxury-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-luxury-800 rounded-lg text-sm text-white hover:bg-luxury-700 transition-colors"
              >
                <HiAdjustments className="w-4 h-4" />
                Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-luxury-400 hover:text-gold-400 transition-colors"
                >
                  <HiX className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-luxury-400">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && brandInfo?.categories?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 bg-luxury-900 rounded-xl border border-luxury-800"
            >
              <h3 className="text-sm font-medium text-white mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("")}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    !category
                      ? "bg-gold-500 text-luxury-950"
                      : "bg-luxury-800 text-white hover:bg-luxury-700"
                  }`}
                >
                  All
                </button>
                {brandInfo.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize ${
                      category === cat
                        ? "bg-gold-500 text-luxury-950"
                        : "bg-luxury-800 text-white hover:bg-luxury-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchProducts(1, true)}
                className="px-6 py-2 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading && products.length === 0 ? (
            <ProductsGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-luxury-400 text-lg">No products found.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Clear filters to see all products
                </button>
              )}
            </div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {products.map((product) => (
                  <motion.div key={product._id} variants={staggerItem}>
                    <ProductCard
                      product={product}
                      onQuickView={() => setQuickViewProduct(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Loading More */}
              {loadingMore && (
                <div className="mt-8">
                  <LoadingSpinner
                    size="small"
                    text="Loading more products..."
                  />
                </div>
              )}

              {/* No More Products */}
              {!hasMore && products.length > 0 && (
                <p className="text-center text-luxury-500 mt-8">
                  You've reached the end of the collection
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </motion.div>
  );
};

export default BrandProductsPage;
