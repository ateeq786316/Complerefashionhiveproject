import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiCamera, HiRefresh, HiPhotograph } from 'react-icons/hi';
import { modalBackdrop, modalContent } from '../../utils/animations';

const VirtualTryOnModal = ({ isOpen, onClose, product }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const startCamera = useCallback(async () => {
    setError('');
    setPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Camera permission was denied. Please allow camera access to use this feature.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Unable to access camera. Please try again.');
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Flip horizontally for mirror effect
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError('');
      setPermissionDenied(false);
    }

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

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
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-3xl bg-luxury-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-luxury-800">
              <div>
                <h2 className="text-xl font-serif font-bold text-white">
                  Virtual Try-On
                </h2>
                <p className="text-sm text-luxury-400">
                  See how {product?.name || 'this item'} looks on you
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-luxury-400 hover:text-white bg-luxury-800/50 rounded-full transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Camera View */}
            <div className="relative aspect-video bg-luxury-950">
              {/* Hidden canvas for capturing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-500/20 rounded-full">
                    <HiCamera className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 mb-4">{error}</p>
                  {permissionDenied && (
                    <p className="text-sm text-luxury-500 mb-4">
                      To enable camera access, please check your browser settings.
                    </p>
                  )}
                  <button
                    onClick={startCamera}
                    className="px-6 py-2 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Captured Image */}
              {capturedImage && (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                  {/* Product overlay (demonstration) */}
                  {product?.images?.[0] && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 opacity-70">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full rounded-lg shadow-2xl"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Live Camera Feed */}
              {!error && !capturedImage && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
              )}

              {/* Camera Loading State */}
              {!cameraActive && !error && !capturedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-luxury-700 border-t-gold-500 rounded-full"
                  />
                  <p className="mt-4 text-luxury-400">Starting camera...</p>
                </div>
              )}

              {/* Product Info Overlay */}
              {product && cameraActive && !capturedImage && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-luxury-900/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-gold-400 font-medium">
                      {product.brandName}
                    </p>
                    <p className="text-white font-semibold truncate">
                      {product.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 p-6 border-t border-luxury-800">
              {capturedImage ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retakePhoto}
                    className="flex items-center gap-2 px-6 py-3 bg-luxury-800 text-white font-semibold rounded-lg hover:bg-luxury-700 transition-colors"
                  >
                    <HiRefresh className="w-5 h-5" />
                    Retake
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                  >
                    <HiPhotograph className="w-5 h-5" />
                    Save Photo
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capturePhoto}
                  disabled={!cameraActive || error}
                  className="flex items-center gap-2 px-8 py-3 bg-gold-500 text-luxury-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiCamera className="w-5 h-5" />
                  Capture
                </motion.button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="px-6 pb-4">
              <p className="text-xs text-center text-luxury-500">
                Virtual try-on is for demonstration purposes. Actual product appearance may vary.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VirtualTryOnModal;
