import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiAdjustments, HiX, HiChevronDown, HiSearch } from "react-icons/hi";
import { productAPI, brandAPI } from "../services/api";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../utils/animations";
import ProductCard from "../components/ui/ProductCard";
import QuickViewModal from "../components/ui/QuickViewModal";
import { ProductsGridSkeleton } from "../components/ui/Skeleton";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter values
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "price-desc"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const sortOptions = [
    { value: "price-desc", label: "Price: High to Low" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "newest", label: "Newest" },
    { value: "name-asc", label: "Name: A-Z" },
  ];

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, true);
    updateSearchParams();
  }, [
    selectedBrand,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    searchQuery,
  ]);

  const fetchFilterOptions = async () => {
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        brandAPI.getAll(),
        brandAPI.getCategories(),
      ]);
      setBrands(brandsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchProducts = async (pageNum = 1, reset = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        page: pageNum,
        limit: 12,
        sort: sortBy,
      };

      if (selectedBrand) params.brand = selectedBrand;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (searchQuery) params.search = searchQuery;

      const response = await productAPI.getAll(params);
      const newProducts = response.data || [];

      setProducts(reset ? newProducts : [...products, ...newProducts]);
      setHasMore(response.hasMore);
      setTotal(response.total);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy !== "price-desc") params.set("sort", sortBy);
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 500;

    if (scrollPosition >= threshold) {
      fetchProducts(page + 1);
    }
  }, [loadingMore, hasMore, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("price-desc");
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedBrand || selectedCategory || minPrice || maxPrice || searchQuery;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20"
    >
      {/* Header */}
      <section className="py-12 bg-gradient-luxury border-b border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              All <span className="text-gradient-gold">Products</span>
            </h1>
            <p className="text-luxury-400">
              {total > 0 ? `${total} products found` : "Explore our collection"}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-luxury-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8 pb-6 border-b border-luxury-800">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-luxury-800 rounded-lg text-sm text-white hover:bg-luxury-700 transition-colors"
              >
                <HiAdjustments className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-gold-500 rounded-full" />
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-luxury-400 hover:text-gold-400 transition-colors"
                >
                  <HiX className="w-4 h-4" />
                  Clear
                </button>
              )}

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500"
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
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-luxury-900 rounded-xl border border-luxury-800 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Brand Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option
                          key={brand._id || brand.name}
                          value={brand.slug || brand.name}
                        >
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-2">
                      Price Range (Rs.)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                      />
                      <span className="text-luxury-500">-</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 bg-luxury-800 border border-luxury-700 rounded-lg text-sm text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <ProductsGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-400 text-lg mb-4">No products found.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-gold-400 hover:text-gold-300 transition-colors"
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

              {/* End of List */}
              {!hasMore && products.length > 0 && (
                <p className="text-center text-luxury-500 mt-8">
                  You've seen all {total} products
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

export default AllProductsPage;
