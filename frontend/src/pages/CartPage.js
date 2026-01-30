import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiMinus, HiPlus, HiTrash, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../utils/animations';
import CheckoutModal from '../components/ui/CheckoutModal';

const CartPage = () => {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearBrand,
    getGroupedItems,
    getBrandTotal,
  } = useCart();

  const [checkoutModal, setCheckoutModal] = useState({
    isOpen: false,
    brandName: '',
    items: [],
    total: 0
  });

  const groupedItems = getGroupedItems();

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.productId, item.size, newQuantity, item.color);
  };

  const handleRemove = (item) => {
    removeFromCart(item.productId, item.size, item.color);
  };

  const handleCheckout = (brandName) => {
    const brandItems = groupedItems[brandName] || [];
    const brandTotal = getBrandTotal(brandName);
    
    setCheckoutModal({
      isOpen: true,
      brandName,
      items: brandItems,
      total: brandTotal
    });
  };

  const handleCheckoutClose = (orderPlaced) => {
    if (orderPlaced) {
      // Clear items for this brand after "successful" order
      clearBrand(checkoutModal.brandName);
    }
    setCheckoutModal({
      isOpen: false,
      brandName: '',
      items: [],
      total: 0
    });
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Shopping <span className="text-gradient-gold">Cart</span>
          </h1>
          <p className="text-luxury-400 mt-2">
            {totalItems > 0
              ? `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-luxury-800 rounded-full flex items-center justify-center">
              <HiOutlineShoppingBag className="w-12 h-12 text-luxury-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-luxury-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet.
              Explore our collection and find something you'll love.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Grouped by Brand */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([brandName, brandItems]) => (
                <motion.div
                  key={brandName}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  className="bg-luxury-900 rounded-xl border border-luxury-800 overflow-hidden"
                >
                  {/* Brand Header */}
                  <div className="px-6 py-4 border-b border-luxury-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gold-400">{brandName}</h3>
                      <p className="text-sm text-luxury-500">
                        {brandItems.length} item{brandItems.length > 1 ? 's' : ''} • 
                        Total: {formatPrice(getBrandTotal(brandName))}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCheckout(brandName)}
                      className="px-5 py-2 bg-gold-500 text-luxury-950 font-semibold text-sm rounded-lg hover:bg-gold-400 transition-colors flex items-center gap-2"
                    >
                      Checkout
                      <HiArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-luxury-800">
                    <AnimatePresence>
                      {brandItems.map((item) => (
                        <motion.div
                          key={`${item.productId}-${item.size}-${item.color}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 sm:p-6"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <Link
                              to={`/product/${item.productId}`}
                              className="flex-shrink-0"
                            >
                              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-luxury-800">
                                <img
                                  src={item.product?.image_urls?.[0] || item.product?.images?.[0]}
                                  alt={item.product?.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.productId}`}>
                                <h4 className="font-medium text-white hover:text-gold-400 transition-colors line-clamp-2">
                                  {item.product?.name}
                                </h4>
                              </Link>
                              <p className="text-sm text-luxury-400 mt-1">
                                Size: {item.size}
                                {item.color && ` • Color: ${item.color}`}
                              </p>
                              <p className="text-lg font-semibold text-white mt-2">
                                {item.product?.price || formatPrice(item.numericPrice)}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-1.5 bg-luxury-800 rounded-lg hover:bg-luxury-700 disabled:opacity-50 transition-colors"
                                  >
                                    <HiMinus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    className="p-1.5 bg-luxury-800 rounded-lg hover:bg-luxury-700 transition-colors"
                                  >
                                    <HiPlus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemove(item)}
                                  className="p-2 text-luxury-400 hover:text-red-400 transition-colors"
                                >
                                  <HiTrash className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Item Total (Desktop) */}
                            <div className="hidden sm:block text-right">
                              <p className="text-lg font-semibold text-white">
                                {formatPrice(item.numericPrice * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-luxury-400 hover:text-red-400 transition-colors"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="sticky top-24 bg-luxury-900 rounded-xl border border-luxury-800 p-6"
              >
                <h3 className="text-xl font-serif font-bold text-white mb-6">
                  Cart Summary
                </h3>

                {/* Brand-wise totals */}
                <div className="space-y-3 pb-6 border-b border-luxury-800">
                  {Object.entries(groupedItems).map(([brandName, brandItems]) => (
                    <div key={brandName} className="flex justify-between text-sm">
                      <span className="text-luxury-400">{brandName}</span>
                      <span className="text-white">{formatPrice(getBrandTotal(brandName))}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between py-6 border-b border-luxury-800">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-lg font-semibold text-gold-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <p className="text-xs text-luxury-500 mt-4">
                  Please checkout each brand separately by clicking the 
                  "Checkout" button next to each brand section.
                </p>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block text-center text-sm text-gold-400 hover:text-gold-300 mt-6 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={handleCheckoutClose}
        brandName={checkoutModal.brandName}
        items={checkoutModal.items}
        total={checkoutModal.total}
      />
    </motion.div>
  );
};

export default CartPage;
