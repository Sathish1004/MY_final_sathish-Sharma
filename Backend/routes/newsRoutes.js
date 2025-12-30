import express from 'express';
import { addNews, getAllNews, updateNews, deleteNews, getPublicNews } from '../controllers/newsController.js';

const router = express.Router();

router.get('/public', getPublicNews);
router.post('/add', addNews);
router.get('/', getAllNews);
router.put('/update/:id', updateNews);
router.delete('/delete/:id', deleteNews);

export default router;
