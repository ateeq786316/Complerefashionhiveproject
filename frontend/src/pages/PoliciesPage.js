import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTruck, HiRefresh, HiShieldCheck, HiLockClosed } from 'react-icons/hi';
import { pageTransition, fadeInUp, tabContent } from '../utils/animations';

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('shipping');

  const policyTabs = [
    { id: 'shipping', label: 'Shipping', icon: HiTruck },
    { id: 'returns', label: 'Returns', icon: HiRefresh },
    { id: 'warranty', label: 'Quality', icon: HiShieldCheck },
    { id: 'privacy', label: 'Privacy', icon: HiLockClosed },
  ];

  const policies = {
    shipping: `
      <h3>Shipping Policy</h3>
      <p>We deliver across Pakistan with care and efficiency.</p>
      
      <h4>Delivery Times</h4>
      <ul>
        <li><strong>Standard Shipping:</strong> 3-5 business days</li>
        <li><strong>Express Shipping:</strong> 1-2 business days</li>
        <li><strong>Major Cities:</strong> Karachi, Lahore, Islamabad - Next day delivery available</li>
      </ul>
      
      <h4>Shipping Costs</h4>
      <ul>
        <li>Orders over Rs. 3,000: Free standard shipping</li>
        <li>Orders under Rs. 3,000: Rs. 200 flat rate</li>
        <li>Express shipping: Additional Rs. 150</li>
      </ul>
      
      <h4>Order Tracking</h4>
      <p>You will receive an SMS and email with tracking information once your order is dispatched.</p>
    `,
    returns: `
      <h3>Returns & Exchanges</h3>
      <p>We want you to be completely satisfied with your purchase.</p>
      
      <h4>Return Window</h4>
      <p>You have 7 days from the delivery date to return or exchange your items.</p>
      
      <h4>Return Conditions</h4>
      <ul>
        <li>Items must be unworn, unwashed, and in original condition</li>
        <li>All original tags must be attached</li>
        <li>Items must be returned in original packaging</li>
        <li>Stitched items and sale items are not eligible for return</li>
      </ul>
      
      <h4>How to Return</h4>
      <ol>
        <li>Contact our customer service via WhatsApp or call</li>
        <li>Pack your items securely</li>
        <li>Arrange pickup or drop at nearest TCS/Leopards office</li>
        <li>Refund will be processed within 5-7 business days</li>
      </ol>
      
      <h4>Exchange Policy</h4>
      <p>Exchanges are subject to stock availability. Size exchanges are free of charge.</p>
    `,
    warranty: `
      <h3>Quality Assurance</h3>
      <p>All our products are sourced directly from official brand stores and authorized dealers.</p>
      
      <h4>Authenticity Guarantee</h4>
      <ul>
        <li>100% authentic products from official brand outlets</li>
        <li>Original brand packaging included</li>
        <li>Brand warranty applicable</li>
      </ul>
      
      <h4>Quality Standards</h4>
      <ul>
        <li>Premium fabric quality</li>
        <li>Professional stitching (for stitched items)</li>
        <li>Color-fast and shrink-resistant materials</li>
      </ul>
      
      <h4>Defective Items</h4>
      <p>If you receive a defective item, please contact us within 48 hours with photos. We will arrange a free replacement or full refund.</p>
      
      <h4>Care Instructions</h4>
      <ul>
        <li>Follow the care label on each garment</li>
        <li>Dry clean recommended for embroidered items</li>
        <li>Wash colors separately</li>
      </ul>
    `,
    privacy: `
      <h3>Privacy Policy</h3>
      <p>Your privacy is important to us. Here's how we handle your information.</p>
      
      <h4>Information We Collect</h4>
      <ul>
        <li>Contact information (name, phone, email)</li>
        <li>Shipping address</li>
        <li>Order history</li>
      </ul>
      
      <h4>How We Use Your Information</h4>
      <ul>
        <li>Process and deliver your orders</li>
        <li>Send order updates via SMS/WhatsApp</li>
        <li>Notify about new arrivals and promotions (if subscribed)</li>
      </ul>
      
      <h4>Data Security</h4>
      <ul>
        <li>Your payment information is never stored</li>
        <li>Cash on Delivery available for added security</li>
        <li>Data is not shared with third parties</li>
      </ul>
      
      <h4>Your Rights</h4>
      <p>You can request to view, modify, or delete your personal data at any time by contacting us.</p>
    `,
  };

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
              Policies & <span className="text-gradient-gold">Information</span>
            </h1>
            <p className="text-luxury-400">
              Everything you need to know about shopping with us
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-luxury-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Policy Tabs */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-2 mb-8"
          >
            {policyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold-500 text-luxury-950'
                    : 'bg-luxury-800 text-white hover:bg-luxury-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Policy Content */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-luxury-900 rounded-xl border border-luxury-800 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabContent}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="prose prose-invert max-w-none"
                >
                  <div
                    className="policy-content"
                    dangerouslySetInnerHTML={{ __html: policies[activeTab] }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-serif font-bold text-white mb-3">
              Need Help?
            </h3>
            <p className="text-luxury-400 mb-6">
              Our customer service team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href="tel:+923001234567"
                className="px-6 py-3 bg-gold-500 text-luxury-950 rounded-lg hover:bg-gold-400 transition-colors"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Style for policy content */}
      <style>{`
        .policy-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }
        .policy-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #D4AF37;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .policy-content p {
          color: #A3A3A3;
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .policy-content ul, .policy-content ol {
          color: #A3A3A3;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .policy-content li {
          margin-bottom: 0.5rem;
        }
        .policy-content strong {
          color: white;
        }
      `}</style>
    </motion.div>
  );
};

export default PoliciesPage;
