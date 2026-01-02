import express from 'express';
import { getAllProjects, getProjectStats, showInterest, getUserInterests, submitProject } from '../controllers/projectController.js';
import { protect, lenientAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', lenientAuth, getAllProjects);
router.get('/stats', getProjectStats);
router.post('/interest', protect, showInterest);
router.get('/user-interests', protect, getUserInterests);
router.post('/submit', protect, submitProject);

export default router;
