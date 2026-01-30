import express from 'express';
import { 
  processTryOn, 
  getStatus, 
  validateImages, 
  getModelParameters 
} from '../controllers/idmVTONController.js';

const router = express.Router();

// IDM-VTON Routes
router.post('/process', processTryOn);
router.get('/status', getStatus);
router.post('/validate-images', validateImages);
router.get('/parameters', getModelParameters);

export default router; 