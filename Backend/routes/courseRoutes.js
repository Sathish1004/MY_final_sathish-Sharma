import express from 'express';
import {
    getAllCourses, createCourse, updateCourse, deleteCourse,
    getCourseAnalytics, getCourseCurriculum, getCourseStudents
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

// Advanced Module Routes
router.get('/:id/analytics', protect, admin, getCourseAnalytics);
router.get('/:id/curriculum', protect, admin, getCourseCurriculum);
router.get('/:id/students', protect, admin, getCourseStudents);

export default router;
