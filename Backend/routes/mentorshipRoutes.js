import express from 'express';
import { bookSession, getAllSessions } from '../controllers/mentorshipController.js';

const router = express.Router();

router.post('/book', bookSession);
router.get('/sessions', getAllSessions);

export default router;
