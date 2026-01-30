import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiCheck, HiShoppingBag } from 'react-icons/hi';
import { modalBackdrop, modalContent } from '../../utils/animations';

const CheckoutModal = ({ isOpen, onClose, brandName, items, total }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only - just show success message
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose(true); // true means order was "placed"
    }, 2000);
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => onClose(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-2xl bg-luxury-900 rounded-2xl shadow-2xl my-8"
          >
            {/* Close Button */}
            <button
              onClick={() => onClose(false)}
              className="absolute top-4 right-4 z-10 p-2 text-luxury-400 hover:text-white bg-luxury-800/50 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>

            {submitted ? (
              // Success Message
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <HiCheck className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="text-luxury-400">
                  Thank you for shopping with {brandName}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b border-luxury-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                      <HiShoppingBag className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-white">
                        Checkout - {brandName}
                      </h2>
                      <p className="text-sm text-luxury-400">
                        {items?.length || 0} item(s) • Total: {formatPrice(total || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 border-b border-luxury-800 max-h-48 overflow-y-auto">
                  <h3 className="text-sm font-medium text-luxury-400 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    {items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-white truncate flex-1 mr-4">
                          {item.product?.name} ({item.size}) x{item.quantity}
                        </span>
                        <span className="text-gold-400">
                          {formatPrice(item.numericPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <h3 className="text-sm font-medium text-luxury-400 mb-4">
                    Delivery Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-1">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-1">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="City name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-white mb-1">
                        Delivery Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="Complete address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="Postal code (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white mb-1">
                        Order Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                        placeholder="Any special instructions"
                      />
                    </div>
                  </div>

                  {/* Total & Submit */}
                  <div className="mt-6 pt-6 border-t border-luxury-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg text-white font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-gold-400">
                        {formatPrice(total || 0)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                    >
                      Place Order
                    </motion.button>

                    <p className="text-xs text-center text-luxury-500 mt-3">
                      Cash on Delivery • Free Shipping on orders above Rs. 3,000
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
