import express from 'express';
import { getQuestions, runCode, submitCode } from '../controllers/codingController.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/run', runCode);
router.post('/submit', submitCode);

export default router;
