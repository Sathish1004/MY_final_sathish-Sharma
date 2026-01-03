import express from 'express';
import { bookSession, getAllSessions, getStudentBookings } from '../controllers/mentorshipController.js';

const router = express.Router();

router.post('/book', bookSession);
router.get('/sessions', getAllSessions);
router.get('/my-bookings', getStudentBookings);

export default router;
