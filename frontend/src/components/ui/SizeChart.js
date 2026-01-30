import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineInformationCircle } from 'react-icons/hi';
import { modalBackdrop, modalContent } from '../../utils/animations';

// Size chart data for different categories
const sizeChartData = {
  woman: {
    title: "Women's Size Chart",
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)', 'Length (in)'],
    rows: [
      ['XS', '32-34', '24-26', '34-36', '35'],
      ['S', '34-36', '26-28', '36-38', '36'],
      ['M', '36-38', '28-30', '38-40', '37'],
      ['L', '38-40', '30-32', '40-42', '38'],
      ['XL', '40-42', '32-34', '42-44', '39'],
      ['XXL', '42-44', '34-36', '44-46', '40'],
    ]
  },
  man: {
    title: "Men's Size Chart",
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Shoulder (in)', 'Length (in)'],
    rows: [
      ['S', '36-38', '30-32', '17', '27'],
      ['M', '38-40', '32-34', '18', '28'],
      ['L', '40-42', '34-36', '19', '29'],
      ['XL', '42-44', '36-38', '20', '30'],
      ['XXL', '44-46', '38-40', '21', '31'],
      ['3XL', '46-48', '40-42', '22', '32'],
    ]
  },
  kids: {
    title: "Kids Size Chart",
    headers: ['Size', 'Age', 'Chest (in)', 'Waist (in)', 'Length (in)'],
    rows: [
      ['2-3Y', '2-3 Years', '21-22', '20-21', '14'],
      ['4-5Y', '4-5 Years', '23-24', '21-22', '16'],
      ['6-7Y', '6-7 Years', '25-26', '22-23', '18'],
      ['8-9Y', '8-9 Years', '27-28', '23-24', '20'],
      ['10-11Y', '10-11 Years', '29-30', '24-25', '22'],
      ['12-13Y', '12-13 Years', '31-32', '25-26', '24'],
    ]
  },
  unstitched: {
    title: "Unstitched Fabric",
    headers: ['Piece', 'Length (meters)'],
    rows: [
      ['Shirt', '2.5'],
      ['Dupatta', '2.5'],
      ['Trouser', '2.5'],
      ['3-Piece Suit', '7.5 (Total)'],
    ]
  }
};

// Size Chart Button Component
export const SizeChartButton = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 transition-colors"
    >
      <HiOutlineInformationCircle className="w-4 h-4" />
      Size Chart
    </button>
  );
};

// Size Chart Modal Component
const SizeChartModal = ({ isOpen, onClose, category = 'woman' }) => {
  const [activeTab, setActiveTab] = useState(category.toLowerCase());
  
  const tabs = [
    { id: 'woman', label: 'Women' },
    { id: 'man', label: 'Men' },
    { id: 'kids', label: 'Kids' },
    { id: 'unstitched', label: 'Unstitched' },
  ];

  const chartData = sizeChartData[activeTab] || sizeChartData.woman;

  if (!isOpen) return null;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-2xl bg-luxury-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-luxury-400 hover:text-white bg-luxury-800/50 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-luxury-800">
              <h2 className="text-xl font-serif font-bold text-white">
                Size Guide
              </h2>
              <p className="text-sm text-luxury-400 mt-1">
                Find your perfect fit with our comprehensive size chart
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-luxury-800 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-gold-400'
                      : 'text-luxury-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Size Chart Table */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {chartData.title}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-luxury-800">
                      {chartData.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-sm font-medium text-gold-400"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`border-b border-luxury-800 ${
                          rowIndex % 2 === 0 ? 'bg-luxury-900' : 'bg-luxury-800/30'
                        }`}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-4 py-3 text-sm ${
                              cellIndex === 0 ? 'font-medium text-white' : 'text-luxury-300'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Tips */}
              <div className="mt-6 p-4 bg-luxury-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gold-400 mb-2">
                  How to Measure
                </h4>
                <ul className="text-xs text-luxury-400 space-y-1">
                  <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
                  <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                  <li>• <strong>Hips:</strong> Measure around the fullest part of your hips</li>
                  <li>• <strong>Length:</strong> Measure from shoulder to desired length</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeChartModal;
