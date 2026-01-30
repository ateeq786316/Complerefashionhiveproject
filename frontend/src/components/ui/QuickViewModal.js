import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMinus, HiPlus, HiCheck } from 'react-icons/hi';
import { modalBackdrop, modalContent } from '../../utils/animations';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';

const QuickViewModal = ({ isOpen, onClose, productId, product: initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  // Available sizes based on category
  const getSizesForCategory = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('kid')) {
      return ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'];
    }
    if (cat.includes('unstitched')) {
      return ['Standard'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };

  useEffect(() => {
    if (isOpen && productId && !initialProduct) {
      fetchProduct();
    } else if (initialProduct) {
      setProduct(initialProduct);
      setLoading(false);
    }
  }, [isOpen, productId, initialProduct]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setQuantity(1);
      setCurrentImageIndex(0);
      setAddedToCart(false);
      setError('');
    }
  }, [isOpen]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getOne(productId);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    const result = addToCart(product, quantity, selectedSize, '');
    if (result.success) {
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  // Get images array
  const getImages = () => {
    if (product?.image_urls?.length) return product.image_urls;
    if (product?.images?.length) return product.images;
    return [];
  };

  if (!isOpen) return null;

  const images = getImages();
  const sizes = product ? getSizesForCategory(product.category) : [];
  const brandName = product?.brandCollection || product?.brand;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-luxury-900 rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-luxury-400 hover:text-white bg-luxury-800/50 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="py-20">
                <LoadingSpinner text="Loading product..." />
              </div>
            ) : error && !product ? (
              <div className="py-20 text-center">
                <p className="text-red-400">{error}</p>
              </div>
            ) : product ? (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Gallery */}
                <div className="p-6">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-luxury-800 mb-4">
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? 'border-gold-500'
                              : 'border-transparent hover:border-luxury-600'
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

                {/* Product Info */}
                <div className="p-6 flex flex-col">
                  <p className="text-xs text-gold-400 font-medium uppercase tracking-wider mb-2 capitalize">
                    {brandName}
                  </p>
                  <h2 className="text-xl font-serif font-bold text-white mb-2">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-gold-400">
                      {product.price}
                    </span>
                  </div>

                  {/* Category */}
                  {product.category && (
                    <p className="text-sm text-luxury-400 mb-4 capitalize">
                      Category: {product.category}
                    </p>
                  )}

                  {/* Size Selection */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-white mb-2">
                      Size <span className="text-red-400">*</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setError('');
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                            selectedSize === size
                              ? 'bg-gold-500 text-luxury-950 border-gold-500'
                              : 'bg-luxury-800 text-white border-luxury-700 hover:border-gold-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-white mb-2">Quantity</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 bg-luxury-800 rounded-lg hover:bg-luxury-700 transition-colors"
                      >
                        <HiMinus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-lg font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 bg-luxury-800 rounded-lg hover:bg-luxury-700 transition-colors"
                      >
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <p className="text-sm text-red-400 mb-4">{error}</p>
                  )}

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-3.5 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-gold-500 text-luxury-950 hover:bg-gold-400'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <HiCheck className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </motion.button>

                  {/* View Full Details Link */}
                  <Link
                    to={`/product/${product._id}`}
                    onClick={onClose}
                    className="mt-4 text-center text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
