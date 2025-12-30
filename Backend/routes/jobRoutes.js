import express from 'express';
import { getAllJobs, createJob, updateJob, deleteJob } from '../controllers/jobsController.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
