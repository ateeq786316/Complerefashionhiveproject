import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { brandAPI } from '../services/api';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../utils/animations';
import BrandCard from '../components/ui/BrandCard';
import { BrandsGridSkeleton } from '../components/ui/Skeleton';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total products
  const totalProducts = brands.reduce((sum, brand) => sum + (brand.productCount || 0), 0);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20"
    >
      {/* Hero Section */}
      <section className="py-16 bg-gradient-luxury border-b border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
              Our <span className="text-gradient-gold">Brands</span>
            </h1>
            <p className="text-lg text-luxury-300 max-w-2xl mx-auto">
              Explore Pakistan's most prestigious fashion brands, each offering
              unique styles and premium quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-16 bg-luxury-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <BrandsGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchBrands}
                className="px-6 py-2 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-luxury-400">No brands found.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {brands.map((brand) => (
                <motion.div key={brand._id || brand.name} variants={staggerItem}>
                  <BrandCard brand={brand} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {!loading && brands.length > 0 && (
        <section className="py-16 bg-gradient-luxury border-t border-luxury-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { value: brands.length, label: 'Fashion Brands' },
                { value: totalProducts.toLocaleString() + '+', label: 'Products' },
                { value: '100%', label: 'Authentic' },
                { value: 'Pakistan', label: 'Made In' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold">
                    {stat.value}
                  </p>
                  <p className="text-sm text-luxury-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default BrandsPage;
