
import express from 'express';
import { createShareLink, getSharedProgress } from '../controllers/ShareController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create/Update share link (Protected) -> /api/share-progress
router.post('/share-progress', protect, createShareLink);

// Get shared data (Public) -> /api/share/:token
router.get('/share/:token', getSharedProgress);

export default router;
