import express from 'express';
import { getQuestions, runCode, submitCode, getUserProgress } from '../controllers/codingController.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/progress', getUserProgress);
router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;
