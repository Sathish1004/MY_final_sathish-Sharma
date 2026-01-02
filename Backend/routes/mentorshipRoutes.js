import express from 'express';
import { bookSession, getUserSessions, getAllSessions, getMentors, getBookedSlots } from '../controllers/mentorshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mentors', getMentors);
router.get('/booked-slots/:mentor_id', getBookedSlots);
router.post('/book', protect, bookSession);
router.get('/sessions', protect, getUserSessions);

export default router;
