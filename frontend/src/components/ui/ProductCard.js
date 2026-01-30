import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { cardHover, imageReveal } from "../../utils/animations";

const ProductCard = ({ product, onQuickView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    _id,
    name,
    brand,
    brandCollection,
    price,
    image_urls,
    images,
    category,
  } = product;

  // Get images from either image_urls or images array
  const productImages = image_urls || images || [];
  const brandName = brandCollection || brand;

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-card rounded-xl overflow-hidden border border-luxury-800/50"
    >
      {/* Category Badge */}
      {category && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 bg-gold-500 text-luxury-950 text-xs font-semibold rounded-full capitalize">
            {category}
          </span>
        </div>
      )}

      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="absolute top-3 right-3 z-10 flex flex-col gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onQuickView && onQuickView(product)}
          className="p-2.5 bg-luxury-900/90 backdrop-blur-sm text-white rounded-full hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          aria-label="Quick view"
        >
          <HiOutlineEye className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 bg-luxury-900/90 backdrop-blur-sm text-white rounded-full hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          aria-label="Add to wishlist"
        >
          <HiOutlineHeart className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Image Container */}
      <Link to={`/product/${_id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-luxury-800">
          {/* Loading Skeleton */}
          {!imageLoaded && <div className="absolute inset-0 image-loading" />}

          {/* Product Image */}
          <motion.img
            src={productImages[0]}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            variants={imageReveal}
            initial="initial"
            animate={imageLoaded ? "animate" : "initial"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Second Image on Hover */}
          {productImages[1] && (
            <motion.img
              src={productImages[1]}
              alt={`${name} - alternate view`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand Name */}
        <p className="text-xs text-gold-400 font-medium uppercase tracking-wider mb-1 capitalize">
          {brandName}
        </p>

        {/* Product Name */}
        <Link to={`/product/${_id}`}>
          <h3 className="text-sm font-medium text-white line-clamp-2 hover:text-gold-400 transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-semibold text-white">{price}</span>
        </div>

        {/* Quick Add Button (appears on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="mt-3"
        >
          <Link
            to={`/product/${_id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold-500 text-luxury-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            <HiOutlineShoppingBag className="w-4 h-4" />
            View Details
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
