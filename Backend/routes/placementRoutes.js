import express from 'express';
import multer from 'multer';
import path from 'path';
import { addPlacement, getAllPlacements, updatePlacement, deletePlacement } from '../controllers/placementController.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/placements/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|mp4|webm|mkv|mov/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images/Videos Only!'));
        }
    }
});

// Allow multiple fields
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

router.post('/add', uploadFields, addPlacement);
router.get('/all', getAllPlacements);
router.put('/:id', uploadFields, updatePlacement);
router.delete('/:id', deletePlacement);

export default router;
