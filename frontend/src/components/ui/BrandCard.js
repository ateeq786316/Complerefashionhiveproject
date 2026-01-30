import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { cardHover, imageReveal } from '../../utils/animations';

const BrandCard = ({ brand }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { name, slug, description, coverImage, productCount, categories } = brand;

  // Generate a placeholder gradient if no cover image
  const placeholderColors = [
    'from-purple-900 to-indigo-900',
    'from-rose-900 to-pink-900',
    'from-emerald-900 to-teal-900',
    'from-amber-900 to-orange-900',
    'from-cyan-900 to-blue-900',
    'from-fuchsia-900 to-purple-900',
  ];
  const colorIndex = name.charCodeAt(0) % placeholderColors.length;
  const placeholderGradient = placeholderColors[colorIndex];

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-luxury-800/50"
    >
      <Link to={`/brands/${slug || name}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {coverImage ? (
            <>
              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 image-loading" />
              )}
              
              {/* Brand Cover Image */}
              <motion.img
                src={coverImage}
                alt={name}
                onLoad={() => setImageLoaded(true)}
                variants={imageReveal}
                initial="initial"
                animate={imageLoaded ? 'animate' : 'initial'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </>
          ) : (
            // Placeholder gradient background
            <div className={`w-full h-full bg-gradient-to-br ${placeholderGradient} flex items-center justify-center`}>
              <span className="text-6xl font-serif font-bold text-white/30">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-luxury-950/50 to-transparent" />

          {/* Brand Info Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {/* Brand Name */}
            <motion.h3
              className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 capitalize"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              {name}
            </motion.h3>

            {/* Product Count & Categories */}
            <div className="flex items-center gap-3 text-sm text-luxury-400 mb-3">
              {productCount !== undefined && (
                <span>{productCount} Products</span>
              )}
              {categories?.length > 0 && (
                <>
                  <span className="w-1 h-1 bg-luxury-600 rounded-full" />
                  <span>{categories.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-luxury-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description || `Explore ${name}'s latest collection`}
            </p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center text-gold-400 font-medium text-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            >
              Explore Collection
              <HiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BrandCard;
