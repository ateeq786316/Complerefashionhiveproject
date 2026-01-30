
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface IDMVTONResponse {
  success: boolean;
  result?: string;
  error?: string;
  message?: string;
}

export interface IDMVTONStatus {
  success: boolean;
  status: 'ready' | 'not_ready';
  message: string;
}

export interface IDMVTONParameters {
  success: boolean;
  parameters: {
    modelName: string;
    version: string;
    supportedFormats: string[];
    maxImageSize: string;
    processingTime: string;
  };
}

class IDMVTONService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async processTryOn(personImage: string, garmentImage: string): Promise<IDMVTONResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/idm-vton/process`, {
        personImage,
        garmentImage
      });
      return response.data;
    } catch (error: any) {
      console.error('IDM-VTON processing error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: 'Failed to process try-on'
      };
    }
  }

  async getStatus(): Promise<IDMVTONStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/idm-vton/status`);
      return response.data;
    } catch (error: any) {
      console.error('IDM-VTON status error:', error);
      return {
        success: false,
        status: 'not_ready',
        message: 'Failed to get status'
      };
    }
  }

  async validateImages(personImage: string, garmentImage: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/idm-vton/validate-images`, {
        personImage,
        garmentImage
      });
      return response.data;
    } catch (error: any) {
      console.error('IDM-VTON validation error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Validation failed'
      };
    }
  }

  async getModelParameters(): Promise<IDMVTONParameters> {
    try {
      const response = await axios.get(`${this.baseURL}/idm-vton/parameters`);
      return response.data;
    } catch (error: any) {
      console.error('IDM-VTON parameters error:', error);
      return {
        success: false,
        parameters: {
          modelName: 'IDM-VTON',
          version: '1.0',
          supportedFormats: ['PNG', 'JPEG'],
          maxImageSize: '1024x1024',
          processingTime: '30-60 seconds'
        }
      };
    }
  }
}

export const idmVTONService = new IDMVTONService();

// Enhanced mock processing with HR-VITON style algorithm
export const mockIDMVTONProcessing = async (personImage: string, garmentImage: string): Promise<IDMVTONResponse> => {
  console.log('🎨 Starting HR-VITON style mock processing...');
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve({
        success: false,
        error: 'Failed to create canvas context',
        message: 'Mock processing failed'
      });
      return;
    }
    
    // Set canvas size to HR-VITON standard
    canvas.width = 512;
    canvas.height = 768;
    console.log('📐 Canvas created:', canvas.width, 'x', canvas.height);
    
    const personImg = new Image();
    const garmentImg = new Image();
    
    let imagesLoaded = 0;
    const totalImages = 2;
    
    const processImages = () => {
      if (imagesLoaded < totalImages) return;
      
      console.log('🔄 All images loaded, processing...');
      console.log('📸 Person image size:', personImg.width, 'x', personImg.height);
      console.log('👕 Garment image size:', garmentImg.width, 'x', garmentImg.height);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw person image
      const personAspectRatio = personImg.width / personImg.height;
      const canvasAspectRatio = canvas.width / canvas.height;
      
      let personWidth, personHeight, personX, personY;
      
      if (personAspectRatio > canvasAspectRatio) {
        // Person image is wider than canvas
        personWidth = canvas.width;
        personHeight = canvas.width / personAspectRatio;
        personX = 0;
        personY = (canvas.height - personHeight) / 2;
      } else {
        // Person image is taller than canvas
        personHeight = canvas.height;
        personWidth = canvas.height * personAspectRatio;
        personX = (canvas.width - personWidth) / 2;
        personY = 0;
      }
      
      console.log('👤 Drawing person at:', personX, personY, personWidth, personHeight);
      ctx.drawImage(personImg, personX, personY, personWidth, personHeight);
      
      // HR-VITON style body masking and garment fitting
      const upperStart = Math.floor(canvas.height * 0.15); // 15% from top
      const upperEnd = Math.floor(canvas.height * 0.75);   // 75% from top
      const upperHeight = upperEnd - upperStart;
      
      // Create realistic body mask
      const mask = ctx.createImageData(canvas.width, canvas.height);
      const maskData = mask.data;
      
      for (let y = upperStart; y < upperEnd; y++) {
        // Bell curve for natural body shape
        const centerY = (upperStart + upperEnd) / 2;
        const distance = Math.abs(y - centerY);
        const maxDistance = (upperEnd - upperStart) / 2;
        let intensity = 1.0 - Math.pow(distance / maxDistance, 2);
        intensity = Math.max(0.0, Math.min(1.0, intensity));
        
        for (let x = 0; x < canvas.width; x++) {
          // Create shoulder-to-waist shape
          const shoulderWidth = canvas.width * 0.85;
          const waistWidth = canvas.width * 0.65;
          const currentWidth = shoulderWidth - (y - upperStart) * (shoulderWidth - waistWidth) / (upperEnd - upperStart);
          
          if (Math.abs(x - canvas.width / 2) < currentWidth / 2) {
            // Add horizontal variation
            const xFactor = 1.0 - Math.abs(x - canvas.width / 2) / (canvas.width / 2);
            const finalIntensity = intensity * xFactor;
            
            const index = (y * canvas.width + x) * 4;
            maskData[index + 3] = Math.floor(finalIntensity * 255); // Alpha channel
          }
        }
      }
      
      // Scale garment to fit upper body
      const garmentWidth = Math.floor(canvas.width * 0.8);
      const garmentHeight = upperHeight;
      const garmentX = Math.floor((canvas.width - garmentWidth) / 2);
      const garmentY = upperStart + Math.floor((upperHeight - garmentHeight) / 2);
      
      console.log('👕 Drawing garment at:', garmentX, garmentY, garmentWidth, garmentHeight);
      
      // Apply garment with HR-VITON style blending
      const garmentData = ctx.getImageData(garmentX, garmentY, garmentWidth, garmentHeight);
      const personData = ctx.getImageData(garmentX, garmentY, garmentWidth, garmentHeight);
      
      for (let y = 0; y < garmentHeight; y++) {
        for (let x = 0; x < garmentWidth; x++) {
          const maskIndex = ((garmentY + y) * canvas.width + (garmentX + x)) * 4;
          const maskVal = maskData[maskIndex + 3] / 255; // Normalize alpha
          
          if (maskVal > 0) {
            const garmentIndex = (y * garmentWidth + x) * 4;
            const personIndex = (y * garmentWidth + x) * 4;
            
            // HR-VITON style blending with higher opacity
            const alpha = maskVal * 0.95; // 95% opacity for better fitting
            
            // Blend each channel
            garmentData.data[garmentIndex + 0] = Math.floor(
              alpha * garmentData.data[garmentIndex + 0] + (1 - alpha) * personData.data[personIndex + 0]
            );
            garmentData.data[garmentIndex + 1] = Math.floor(
              alpha * garmentData.data[garmentIndex + 1] + (1 - alpha) * personData.data[personIndex + 1]
            );
            garmentData.data[garmentIndex + 2] = Math.floor(
              alpha * garmentData.data[garmentIndex + 2] + (1 - alpha) * personData.data[personIndex + 2]
            );
            garmentData.data[garmentIndex + 3] = 255; // Full opacity
          }
        }
      }
      
      // Apply the blended garment
      ctx.putImageData(garmentData, garmentX, garmentY);
      
      // Add HR-VITON style post-processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Enhance contrast and color
      for (let i = 0; i < data.length; i += 4) {
        // Enhance contrast
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.15 + 128));     // Red
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.15 + 128)); // Green
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.15 + 128)); // Blue
        
        // Enhance brightness slightly
        data[i] = Math.min(255, data[i] * 1.05);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.min(255, data[i + 2] * 1.05);
        
        // Enhance color saturation
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = Math.min(255, avg + (data[i] - avg) * 1.1);
        data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.1);
        data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.1);
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      console.log('✅ Processing completed successfully');
      
      const result = canvas.toDataURL('image/png');
      resolve({
        success: true,
        result,
        message: 'HR-VITON style mock processing completed with realistic try-on simulation'
      });
    };
    
    personImg.onload = () => {
      console.log('📸 Person image loaded successfully');
      imagesLoaded++;
      processImages();
    };
    
    garmentImg.onload = () => {
      console.log('👕 Garment image loaded successfully');
      imagesLoaded++;
      processImages();
    };
    
    personImg.onerror = () => {
      console.error('❌ Failed to load person image');
      resolve({
        success: false,
        error: 'Failed to load person image',
        message: 'Mock processing failed'
      });
    };
    
    garmentImg.onerror = () => {
      console.error('❌ Failed to load garment image');
      resolve({
        success: false,
        error: 'Failed to load garment image',
        message: 'Mock processing failed'
      });
    };
    
    personImg.src = personImage;
    garmentImg.src = garmentImage;
  });
}; 