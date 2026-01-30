import React from 'react';
import { motion } from 'framer-motion';
import { skeletonPulse } from '../../utils/animations';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <motion.div
    variants={skeletonPulse}
    animate="animate"
    className="bg-luxury-900 rounded-xl overflow-hidden border border-luxury-800/50"
  >
    <div className="aspect-[3/4] bg-luxury-800 image-loading" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-luxury-800 rounded w-1/3" />
      <div className="h-4 bg-luxury-800 rounded w-3/4" />
      <div className="h-5 bg-luxury-800 rounded w-1/2" />
    </div>
  </motion.div>
);

// Brand Card Skeleton
export const BrandCardSkeleton = () => (
  <motion.div
    variants={skeletonPulse}
    animate="animate"
    className="bg-luxury-900 rounded-2xl overflow-hidden border border-luxury-800/50"
  >
    <div className="aspect-[4/3] bg-luxury-800 image-loading" />
  </motion.div>
);

// Text Skeleton
export const TextSkeleton = ({ width = '100%', height = '1rem', className = '' }) => (
  <motion.div
    variants={skeletonPulse}
    animate="animate"
    className={`bg-luxury-800 rounded ${className}`}
    style={{ width, height }}
  />
);

// Product Details Skeleton
export const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-luxury-800 rounded-xl image-loading" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-luxury-800 rounded-lg image-loading" />
          ))}
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-6">
        <TextSkeleton width="30%" height="0.75rem" />
        <TextSkeleton width="80%" height="2rem" />
        <TextSkeleton width="40%" height="1.5rem" />
        <div className="space-y-2">
          <TextSkeleton width="100%" height="1rem" />
          <TextSkeleton width="90%" height="1rem" />
          <TextSkeleton width="70%" height="1rem" />
        </div>
        <TextSkeleton width="100%" height="3rem" className="rounded-lg" />
      </div>
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <motion.div
    variants={skeletonPulse}
    animate="animate"
    className="flex gap-4 p-4 bg-luxury-900 rounded-lg border border-luxury-800"
  >
    <div className="w-24 h-32 bg-luxury-800 rounded-lg image-loading" />
    <div className="flex-1 space-y-3">
      <TextSkeleton width="60%" height="1rem" />
      <TextSkeleton width="40%" height="0.75rem" />
      <TextSkeleton width="30%" height="1.25rem" />
    </div>
  </motion.div>
);

// Products Grid Skeleton
export const ProductsGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Brands Grid Skeleton
export const BrandsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <BrandCardSkeleton key={i} />
    ))}
  </div>
);

export default {
  ProductCardSkeleton,
  BrandCardSkeleton,
  TextSkeleton,
  ProductDetailsSkeleton,
  CartItemSkeleton,
  ProductsGridSkeleton,
  BrandsGridSkeleton,
};
