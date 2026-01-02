
import express from 'express';
import { upload, uploadImages } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow up to 3 images
router.post('/', protect, upload.array('images', 3), uploadImages);

export default router;
