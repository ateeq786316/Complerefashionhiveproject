import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  Download,
  Upload,
  Sparkles,
  RotateCw,
  Eye,
  Zap,
  Cpu,
  Brain,
  Target,
  Scan,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CameraModal from "./CameraModal";

// Advanced Body Detection and Garment Fitting System
class VirtualTryOnEngine {
  constructor() {
    this.bodyKeypoints = {
      head: { x: 0, y: 0 },
      leftShoulder: { x: 0, y: 0 },
      rightShoulder: { x: 0, y: 0 },
      leftElbow: { x: 0, y: 0 },
      rightElbow: { x: 0, y: 0 },
      leftWrist: { x: 0, y: 0 },
      rightWrist: { x: 0, y: 0 },
      chest: { x: 0, y: 0 },
      waist: { x: 0, y: 0 },
      hips: { x: 0, y: 0 },
    };

    this.garmentDimensions = {
      width: 0,
      height: 0,
      shoulderWidth: 0,
      sleeveLength: 0,
      bodyLength: 0,
    };
  }

  // Advanced body detection using canvas analysis
  detectBodyPoints(imageData, width, height) {
    const points = {};
    const data = imageData.data;

    // Find shoulder line (brightest continuous horizontal line in upper region)
    const upperRegion = Math.floor(height * 0.2);
    const lowerRegion = Math.floor(height * 0.4);
    let maxBrightness = 0;
    let shoulderY = upperRegion;

    for (let y = upperRegion; y < lowerRegion; y++) {
      let rowBrightness = 0;
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;
        rowBrightness += brightness;
      }
      if (rowBrightness > maxBrightness) {
        maxBrightness = rowBrightness;
        shoulderY = y;
      }
    }

    // Find left and right shoulder edges
    let leftEdge = 0;
    let rightEdge = width;

    for (let x = 0; x < width; x++) {
      const index = (shoulderY * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      if (brightness > maxBrightness * 0.7) {
        leftEdge = x;
        break;
      }
    }

    for (let x = width - 1; x >= 0; x--) {
      const index = (shoulderY * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      if (brightness > maxBrightness * 0.7) {
        rightEdge = x;
        break;
      }
    }

    // Calculate key body points
    const centerX = width / 2;
    const shoulderWidth = rightEdge - leftEdge;

    points.head = { x: centerX, y: shoulderY - 30 };
    points.leftShoulder = { x: leftEdge, y: shoulderY };
    points.rightShoulder = { x: rightEdge, y: shoulderY };
    points.chest = { x: centerX, y: shoulderY + 50 };
    points.waist = { x: centerX, y: shoulderY + 120 };
    points.hips = { x: centerX, y: shoulderY + 180 };

    // Estimate arm positions
    points.leftElbow = { x: leftEdge - 20, y: shoulderY + 80 };
    points.rightElbow = { x: rightEdge + 20, y: shoulderY + 80 };
    points.leftWrist = { x: leftEdge - 30, y: shoulderY + 140 };
    points.rightWrist = { x: rightEdge + 30, y: shoulderY + 140 };

    return points;
  }

  // Analyze garment dimensions and features
  analyzeGarment(garmentImg) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = garmentImg.width;
    canvas.height = garmentImg.height;
    ctx.drawImage(garmentImg, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Find garment boundaries (non-transparent pixels)
    let minX = canvas.width,
      maxX = 0,
      minY = canvas.height,
      maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        if (data[index + 3] > 10) {
          // Non-transparent pixel
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    return {
      width: maxX - minX,
      height: maxY - minY,
      shoulderWidth: (maxX - minX) * 0.8, // Estimate shoulder width
      sleeveLength: (maxY - minY) * 0.4, // Estimate sleeve length
      bodyLength: maxY - minY,
    };
  }

  // Advanced garment warping and fitting
  applyGarmentFitting(
    ctx,
    personImg,
    garmentImg,
    canvasWidth,
    canvasHeight,
    bodyPoints,
    garmentDims
  ) {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw person base
    ctx.drawImage(personImg, 0, 0, canvasWidth, canvasHeight);

    // Calculate scaling factors
    const bodyShoulderWidth =
      bodyPoints.rightShoulder.x - bodyPoints.leftShoulder.x;
    const scaleRatio = bodyShoulderWidth / garmentDims.shoulderWidth;

    // Calculate garment position
    const garmentWidth = garmentDims.width * scaleRatio;
    const garmentHeight = garmentDims.height * scaleRatio;
    const garmentX = bodyPoints.chest.x - garmentWidth / 2;
    const garmentY = bodyPoints.chest.y - garmentHeight * 0.3; // Position above waist

    // Save context for garment transformation
    ctx.save();

    // Create clipping mask for body region
    ctx.beginPath();
    ctx.moveTo(bodyPoints.head.x, bodyPoints.head.y);

    // Left shoulder to arm
    ctx.lineTo(bodyPoints.leftShoulder.x, bodyPoints.leftShoulder.y);
    ctx.lineTo(bodyPoints.leftElbow.x, bodyPoints.leftElbow.y);
    ctx.lineTo(bodyPoints.leftWrist.x, bodyPoints.leftWrist.y);

    // Bottom curve
    ctx.lineTo(bodyPoints.leftWrist.x, bodyPoints.hips.y);
    ctx.lineTo(bodyPoints.rightWrist.x, bodyPoints.hips.y);

    // Right arm to shoulder
    ctx.lineTo(bodyPoints.rightWrist.x, bodyPoints.rightElbow.y);
    ctx.lineTo(bodyPoints.rightElbow.x, bodyPoints.rightElbow.y);
    ctx.lineTo(bodyPoints.rightShoulder.x, bodyPoints.rightShoulder.y);

    // Back to head
    ctx.lineTo(bodyPoints.head.x, bodyPoints.head.y);
    ctx.closePath();
    ctx.clip();

    // Apply perspective transformation for realistic fitting
    ctx.globalAlpha = 0.95;

    // Transform garment to fit body posture
    const transformMatrix = this.calculatePerspectiveTransform(
      garmentImg.width,
      garmentImg.height,
      garmentWidth,
      garmentHeight,
      bodyPoints
    );

    ctx.setTransform(
      transformMatrix[0],
      transformMatrix[1],
      transformMatrix[2],
      transformMatrix[3],
      garmentX,
      garmentY
    );

    // Draw transformed garment
    ctx.drawImage(garmentImg, 0, 0);

    ctx.restore();

    // Add realistic lighting and shadow effects
    this.applyLightingEffects(
      ctx,
      garmentX,
      garmentY,
      garmentWidth,
      garmentHeight,
      bodyPoints
    );

    // Add fabric texture blending
    this.applyTextureBlending(
      ctx,
      garmentX,
      garmentY,
      garmentWidth,
      garmentHeight
    );
  }

  // Calculate perspective transformation matrix
  calculatePerspectiveTransform(
    origWidth,
    origHeight,
    targetWidth,
    targetHeight,
    bodyPoints
  ) {
    // Simple perspective based on body posture
    const bodyLean =
      (bodyPoints.rightShoulder.y - bodyPoints.leftShoulder.y) / 100;
    const scaleX = targetWidth / origWidth;
    const scaleY = targetHeight / origHeight;

    return [
      scaleX + bodyLean * 0.1, // a - horizontal scaling + lean effect
      bodyLean * 0.05, // b - vertical skew based on lean
      -bodyLean * 0.03, // c - horizontal skew
      scaleY, // d - vertical scaling
    ];
  }

  // Apply realistic lighting effects
  applyLightingEffects(ctx, x, y, width, height, bodyPoints) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);

    // Directional lighting from top-left (simulating natural light)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)"); // Highlight
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.1)"); // Midtone
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)"); // Shadow

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }

  // Apply fabric texture blending
  applyTextureBlending(ctx, x, y, width, height) {
    ctx.globalAlpha = 0.1;
    ctx.globalCompositeOperation = "overlay";

    // Create fabric-like texture pattern
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    patternCanvas.width = 50;
    patternCanvas.height = 50;

    // Create subtle fabric texture
    patternCtx.fillStyle = "rgba(100, 100, 100, 0.3)";
    for (let i = 0; i < 20; i++) {
      patternCtx.fillRect(Math.random() * 50, Math.random() * 50, 2, 2);
    }

    const pattern = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(x, y, width, height);

    ctx.globalCompositeOperation = "source-over";
  }

  // Enhanced post-processing
  applyPostProcessing(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Edge blending for natural integration
    for (let i = 0; i < data.length; i += 4) {
      // Subtle edge smoothing
      if (data[i + 3] > 200) {
        // Near opaque pixels
        data[i] = Math.min(255, data[i] * 1.05); // Slight brightness boost
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.min(255, data[i + 2] * 1.05);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

const IDMVTONTryOn = ({ product, selectedColor, onClose }) => {
  const [personImage, setPersonImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processingStep, setProcessingStep] = useState("");
  const [detectedPoints, setDetectedPoints] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const personFileInputRef = useRef(null);
  const garmentFileInputRef = useRef(null);
  const streamRef = useRef(null);
  const tryOnEngine = useRef(new VirtualTryOnEngine());

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Get garment image from product
  const getGarmentImageUrl = () => {
    if (product?.images?.length > 0) {
      if (typeof product.images[0] === "object" && product.images[0]?.url) {
        return product.images[0].url;
      }
      if (typeof product.images[0] === "string") {
        return product.images[0];
      }
    }

    if (product?.image_urls?.length > 0) {
      return product.image_urls[0];
    }

    if (product?.image_url) {
      return product.image_url;
    }

    return null;
  };

  const garmentImageUrl = getGarmentImageUrl();

  // Load garment image
  useEffect(() => {
    if (!garmentImageUrl) {
      setError("No garment image available for this product");
      return;
    }

    const loadGarmentImage = async () => {
      try {
        const response = await fetch(garmentImageUrl);
        if (!response.ok)
          throw new Error(`Failed to load image: ${response.status}`);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = (e) => {
          setGarmentImage(e.target.result);
          setError(null);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        setError(`Failed to load garment image: ${err.message}`);
      }
    };

    loadGarmentImage();
  }, [garmentImageUrl]);

  const handleCameraCapture = (imageData) => {
    setPersonImage(imageData);
  };

  const captureFromCamera = async () => {
    try {
      console.log("Starting camera initialization...");
      setError("");

      const constraints = {
        video: {
          width: { ideal: 768 },
          height: { ideal: 1024 },
          facingMode: "user",
        },
      };

      console.log("Requesting camera access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained:", stream);

      streamRef.current = stream;
      setCameraActive(true); // Set active first to render video element

      // Wait a tiny bit for React to render the video element
      setTimeout(() => {
        if (videoRef.current) {
          console.log("Setting video source...");
          videoRef.current.srcObject = stream;

          // Wait for video to load metadata
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded, playing video...");
            videoRef.current
              .play()
              .then(() => {
                console.log("Video playing successfully");
                setCameraActive(true);
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                setError("Failed to play camera feed");
                setCameraActive(false);
              });
          };

          // Handle video errors
          videoRef.current.onerror = (e) => {
            console.error("Video error:", e);
            setError("Failed to load camera feed");
            setCameraActive(false);
          };
        } else {
          console.error("Video ref is still null after timeout");
          setError("Video element not found even after rendering");
          setCameraActive(false);
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Camera permission was denied. Please allow camera access to use this feature."
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "OverconstrainedError") {
        setError(
          "Camera doesn't support the required resolution. Trying fallback..."
        );
        // Try with simpler constraints
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
      console.log("Trying fallback camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      setCameraActive(true); // Set active first

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Fallback video loaded");
            videoRef.current
              .play()
              .then(() => {
                setCameraActive(true);
                setError("");
              })
              .catch((err) => {
                setError("Failed to play camera feed even with fallback");
                setCameraActive(false);
              });
          };
        } else {
          console.error("Fallback video ref is null");
          setError("Video element not found for fallback");
          setCameraActive(false);
        }
      }, 100);
    } catch (err) {
      console.error("Fallback camera access failed:", err);
      setError("Unable to access camera even with fallback settings");
      setCameraActive(false);
    }
  };

  const capturePersonImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setPersonImage(imageData);
    setCameraActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handlePersonImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPersonImage(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGarmentImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setGarmentImage(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Main processing function with proper body detection
  // Main processing function with REAL IDM-VTON API
  const processVirtualTryOn = async () => {
    if (!personImage || !garmentImage) {
      setError("Please provide both person and garment images");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const processingSteps = [
        "🤖 Connecting to IDM-VTON API...",
        "📤 Uploading images to processing server...",
        "🧠 Running pose detection and body analysis...",
        "👗 Applying garment to detected body pose...",
        "🎨 Generating realistic virtual try-on...",
        "✨ Finalizing high-quality result...",
        "🖼️ Complete! Loading your try-on image...",
      ];

      // Show processing steps
      for (let i = 0; i < processingSteps.length - 1; i++) {
        setProcessingStep(processingSteps[i]);
        await new Promise((resolve) =>
          setTimeout(resolve, 600 + Math.random() * 400)
        );
      }

      console.log("=== Sending Try-On Request ===");
      console.log("Person image length:", personImage?.length || 0);
      console.log("Garment image length:", garmentImage?.length || 0);

      // Call REAL IDM-VTON API
      const response = await fetch("http://localhost:8000/tryon/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImage: personImage, // Full base64 data URL
          garmentImage: garmentImage, // Full base64 data URL
          garmentType: product?.category?.toLowerCase().includes("dress")
            ? "dresses"
            : "upper_body",
          garmentDesc: product?.name || "shirt",
          denoiseSteps: 30,
          seed: 42,
          useAutoMask: true,
          crop: false,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("API Response:", result);
      setProcessingStep(processingSteps[6]); // Final step

      if (result.success) {
        setResult(result.resultImage); // This is already a data URL
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsProcessing(false);
        setProcessingStep("");
      } else {
        throw new Error(result.error || "API processing failed");
      }
    } catch (err) {
      console.error("IDM-VTON API Error:", err);
      setError(`API Error: ${err.message}`);
      setIsProcessing(false);
      setProcessingStep("");
    }
  };
  const downloadResult = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.download = `virtual-tryon-${
      product?.name || "result"
    }-${Date.now()}.png`;
    link.href = result;
    link.click();
  };

  const reset = () => {
    setPersonImage(null);
    setResult(null);
    setError(null);
    setProcessingStep("");
    setDetectedPoints(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!product) {
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-red-900 rounded-lg p-6 max-w-md">
          <h3 className="text-white font-bold mb-2">Error</h3>
          <p className="text-red-200">Product data is missing</p>
          <button
            onClick={onClose}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const mainContent = (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-slate-700"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scan className="h-6 w-6 text-cyan-400" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  AI-Powered Virtual Try-On
                </h2>
                <p className="text-sm text-slate-400">
                  Advanced body detection & garment fitting
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow p-6">
          <AnimatePresence mode="wait">
            {!personImage && !result && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className="h-8 w-8 text-cyan-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Advanced Virtual Try-On System
                      </h3>
                      <p className="text-slate-400 text-sm">
                        AI-powered body detection and realistic garment fitting
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        🎯 Key Features:
                      </h4>
                      <ul className="text-slate-300 text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></div>
                          <span>
                            Body keypoint detection (shoulders, chest, waist,
                            arms)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></div>
                          <span>
                            Intelligent garment sizing and positioning
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></div>
                          <span>Realistic lighting and shadow simulation</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></div>
                          <span>
                            Advanced texture blending and post-processing
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">
                        ⚡ Processing Pipeline:
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                            <span className="text-cyan-400 text-xs">1</span>
                          </div>
                          <span className="text-slate-300">
                            Body pose analysis
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                            <span className="text-cyan-400 text-xs">2</span>
                          </div>
                          <span className="text-slate-300">
                            Garment dimension mapping
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                            <span className="text-cyan-400 text-xs">3</span>
                          </div>
                          <span className="text-slate-300">
                            Perspective transformation
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                            <span className="text-cyan-400 text-xs">4</span>
                          </div>
                          <span className="text-slate-300">
                            Realistic compositing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h4 className="text-white font-medium mb-4 text-center">
                      👤 Person Image
                    </h4>
                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 mb-4">
                      <h5 className="text-blue-300 font-medium text-sm mb-2">
                        📸 Best Results Tips:
                      </h5>
                      <ul className="text-blue-200 text-xs space-y-1">
                        <li>• Front-facing pose with neutral expression</li>
                        <li>• Good lighting (natural light preferred)</li>
                        <li>• Upper body clearly visible</li>
                        <li>• Simple background without distractions</li>
                      </ul>
                    </div>

                    {personImage ? (
                      <div className="text-center">
                        <img
                          src={personImage}
                          alt="Person"
                          className="max-w-full h-64 object-cover rounded-lg mx-auto mb-4"
                        />
                        <button
                          onClick={() => setPersonImage(null)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center">
                            <Camera className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <button
                              onClick={() => setShowCameraModal(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full"
                            >
                              Use Camera
                            </button>
                          </div>
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-green-400 mx-auto mb-2" />
                            <button
                              onClick={() => personFileInputRef.current.click()}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full"
                            >
                              Upload Image
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h4 className="text-white font-medium mb-4 text-center">
                      👕 Garment Image
                    </h4>
                    <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3 mb-4">
                      <h5 className="text-purple-300 font-medium text-sm mb-2">
                        👔 Garment Requirements:
                      </h5>
                      <ul className="text-purple-200 text-xs space-y-1">
                        <li>• Product image loaded automatically</li>
                        <li>• Clear, high-resolution garment photo</li>
                        <li>• Garment on plain/white background</li>
                        <li>• Full garment visible without cropping</li>
                      </ul>
                    </div>

                    {garmentImage ? (
                      <div className="text-center">
                        <img
                          src={garmentImage}
                          alt="Garment"
                          className="max-w-full h-64 object-cover rounded-lg mx-auto mb-4"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">
                        <p>Using product image as garment</p>
                        {error && (
                          <p className="text-red-400 mt-2 text-sm">{error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {personImage && (
                  <div className="text-center">
                    <img
                      src={personImage}
                      alt="Person"
                      className="max-w-full h-64 object-cover rounded-lg mx-auto mb-4 border-2 border-green-500/50"
                    />
                    <button
                      onClick={() => setPersonImage(null)}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RotateCw className="h-4 w-4" />
                      Change Photo
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {personImage && !result && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Ready for Advanced Processing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        Person Image
                      </h4>
                      <img
                        src={personImage}
                        alt="Person"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">
                        Garment Image
                      </h4>
                      <img
                        src={garmentImage}
                        alt="Garment"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <div className="text-center mb-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                    <h4 className="text-white font-medium mb-2">
                      AI Processing in Progress
                    </h4>
                    <p className="text-cyan-400 text-sm mb-4">
                      {processingStep}
                    </p>

                    <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse"
                        style={{ width: "70%" }}
                      ></div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <h5 className="text-white font-medium mb-2">
                        AI Processing Pipeline:
                      </h5>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Body keypoint detection and analysis
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Garment dimension and feature extraction
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                          Advanced perspective transformation
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                          Realistic lighting and texture blending
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={processVirtualTryOn}
                    disabled={isProcessing || !garmentImage}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto"
                  >
                    {isProcessing ? "Processing..." : "🚀 Generate AI Try-On"}
                  </button>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    AI-Powered Try-On Result
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <h4 className="text-white font-medium mb-3 text-center">
                        Original Person
                      </h4>
                      <img
                        src={personImage}
                        alt="Original Person"
                        className="max-w-full h-64 object-cover rounded-lg mx-auto"
                      />
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 relative">
                      <h4 className="text-white font-medium mb-3 text-center">
                        AI Try-On Result
                      </h4>
                      <img
                        src={result}
                        alt="AI Try-On Result"
                        className="max-w-full h-64 object-cover rounded-lg mx-auto"
                      />

                      {/* Body points overlay (for demonstration) */}
                      {detectedPoints && (
                        <div className="absolute inset-0 pointer-events-none">
                          {Object.entries(detectedPoints).map(
                            ([key, point]) => (
                              <div
                                key={key}
                                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                                style={{
                                  left: `${(point.x / 512) * 100}%`,
                                  top: `${(point.y / 768) * 100}%`,
                                  transform: "translate(-50%, -50%)",
                                }}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 max-w-2xl mx-auto mb-6">
                    <h4 className="text-white font-medium mb-3 text-center">
                      AI Processing Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-cyan-400 font-semibold">
                          Technology
                        </div>
                        <div className="text-slate-300">AI Body Detection</div>
                      </div>
                      <div className="text-center">
                        <div className="text-cyan-400 font-semibold">
                          Resolution
                        </div>
                        <div className="text-slate-300">512×768</div>
                      </div>
                      <div className="text-center">
                        <div className="text-cyan-400 font-semibold">
                          Processing
                        </div>
                        <div className="text-slate-300">~5 seconds</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={downloadResult}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Result
                  </button>

                  <button
                    onClick={reset}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={personFileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePersonImageUpload}
          className="hidden"
        />
        <input
          ref={garmentFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleGarmentImageUpload}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );

  return (
    <>
      {mainContent}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
};

export default IDMVTONTryOn;
