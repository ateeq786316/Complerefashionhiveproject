import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiCamera, HiRefresh } from "react-icons/hi";

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && !cameraActive && !capturedImage) {
      initializeCamera();
    }

    // Cleanup on close
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      setCapturedImage(null);
      setError("");
    };
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setError("");

      const constraints = {
        video: {
          width: { ideal: 768 },
          height: { ideal: 1024 },
          facingMode: "user",
        },
      };

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;
      setCameraActive(true);
      setIsLoading(false);

      // Wait for React to render video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.error("Error playing video:", err);
              setError("Failed to play camera feed");
              setCameraActive(false);
            });
          };
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      setIsLoading(false);

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError("Camera permission denied. Please allow camera access.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "OverconstrainedError") {
        // Try fallback with simpler constraints
        await fallbackCameraAccess();
        return;
      } else {
        setError(`Unable to access camera: ${err.message}`);
      }
      setCameraActive(false);
    }
  };

  const fallbackCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      setCameraActive(true);
      setIsLoading(false);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              setError("Failed to play camera feed");
              setCameraActive(false);
            });
          };
        }
      }, 100);
    } catch (err) {
      console.error("Fallback camera access failed:", err);
      setError("Unable to access camera even with fallback settings");
      setIsLoading(false);
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const retakeImage = () => {
    setCapturedImage(null);
    initializeCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    // Stop any active streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Reset state
    setCameraActive(false);
    setCapturedImage(null);
    setError("");
    setIsLoading(false);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Camera Capture</h2>
                <p className="text-sm text-slate-400">
                  Take a photo for virtual try-on
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-slate-400">Initializing camera...</p>
                </div>
              )}

              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-500/20 rounded-full">
                    <HiCamera className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={initializeCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {cameraActive && !isLoading && !error && (
                <div className="text-center">
                  <div
                    className="relative mx-auto mb-4"
                    style={{ maxWidth: "400px" }}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-lg bg-black mx-auto"
                      style={{ maxHeight: "500px" }}
                    />
                    <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none"></div>
                  </div>

                  <button
                    onClick={captureImage}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <HiCamera className="w-5 h-5" />
                    Capture Photo
                  </button>
                </div>
              )}

              {capturedImage && (
                <div className="text-center">
                  <div
                    className="relative mx-auto mb-6"
                    style={{ maxWidth: "400px" }}
                  >
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full rounded-lg border-2 border-green-500/50"
                    />
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={retakeImage}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <HiRefresh className="w-4 h-4" />
                      Retake
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Use This Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CameraModal;
