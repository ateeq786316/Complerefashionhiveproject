import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiSparkles } from "react-icons/hi";
import { brandAPI, productAPI } from "../services/api";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  heroText,
  fadeInUp,
} from "../utils/animations";
import ProductCard from "../components/ui/ProductCard";
import BrandCard from "../components/ui/BrandCard";
import QuickViewModal from "../components/ui/QuickViewModal";
import {
  ProductsGridSkeleton,
  BrandsGridSkeleton,
} from "../components/ui/Skeleton";

const HomePage = () => {
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [brandsRes, featuredRes] = await Promise.all([
        brandAPI.getAll(),
        productAPI.getFeatured(8),
      ]);

      setBrands(brandsRes.data || []);
      setFeaturedProducts(featuredRes.data || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-950 via-purple-950/20 to-luxury-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczIgNCAyIDRjMCAyLTIgNC0yIDRzMiAyIDQgMmMyIDAgNC0yIDQtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={heroText}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-800/50 backdrop-blur-sm rounded-full border border-luxury-700"
            >
              <HiSparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-luxury-200">
                Premium Pakistani Fashion Brands
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Discover <span className="text-gradient-gold">Luxury</span>
              <br />
              Fashion Collections
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-luxury-300 leading-relaxed">
              Explore curated collections from Pakistan's most prestigious
              fashion houses. Sapphire, Edenrobe, Gul Ahmed, and more - all in
              one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors flex items-center gap-2"
                >
                  Shop Now
                  <HiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/brands">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-luxury-600 hover:border-gold-500 hover:text-gold-400 transition-colors"
                >
                  Explore Brands
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-luxury-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-20 bg-luxury-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Our <span className="text-gradient-gold">Brands</span>
            </h2>
            <p className="text-luxury-400 max-w-2xl mx-auto">
              Shop from Pakistan's leading fashion brands
            </p>
          </motion.div>

          {loading ? (
            <BrandsGridSkeleton count={6} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {brands.slice(0, 6).map((brand) => (
                <motion.div
                  key={brand._id || brand.name}
                  variants={staggerItem}
                >
                  <BrandCard brand={brand} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/brands"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              View All Brands
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Featured <span className="text-gradient-gold">Products</span>
            </h2>
            <p className="text-luxury-400 max-w-2xl mx-auto">
              Hand-picked pieces from our latest collections
            </p>
          </motion.div>

          {loading ? (
            <ProductsGridSkeleton count={8} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product._id} variants={staggerItem}>
                  <ProductCard
                    product={product}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              Shop All Products
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Experience Virtual{" "}
              <span className="text-gradient-gold">Try-On</span>
            </h2>
            <p className="text-lg text-luxury-300 max-w-2xl mx-auto">
              Use our virtual try-on feature to visualize how pieces look on you
              before making a purchase.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                Try It Now
              </motion.button>
            </Link>
          </motion.div>
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

export default HomePage;
