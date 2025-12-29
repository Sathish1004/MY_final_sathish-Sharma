import db from '../config/db.js';

// Get all jobs (with optional filters)
export const getAllJobs = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = 'SELECT * FROM jobs';
        const params = [];

        if (type || status) {
            query += ' WHERE';
            if (type) {
                query += ' job_type = ?';
                params.push(type);
            }
            if (status) {
                if (type) query += ' AND';
                query += ' status = ?';
                params.push(status);
            }
        }

        query += ' ORDER BY created_at DESC';

        const [jobs] = await db.query(query, params);
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error fetching jobs' });
    }
};

// Create a new job
export const createJob = async (req, res) => {
    try {
        const {
            job_title, company_name, job_type, work_mode, location,
            salary_package, required_skills, job_description,
            responsibilities, eligibility,
            application_deadline, application_link, status
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO jobs (
                job_title, company_name, job_type, work_mode, location,
                salary_package, required_skills, job_description,
                responsibilities, eligibility,
                application_deadline, application_link, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                job_title, company_name, job_type, work_mode, location,
                salary_package, required_skills, job_description,
                responsibilities, eligibility,
                application_deadline, application_link, status || 'Active'
            ]
        );

        const [newJob] = await db.query('SELECT * FROM jobs WHERE job_id = ?', [result.insertId]);
        res.status(201).json(newJob[0]);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            message: 'Server error creating job',
            error: error.message,
            sqlMessage: error.sqlMessage
        });
    }
};

// Update a job
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            job_title, company_name, job_type, work_mode, location,
            salary_package, required_skills, job_description,
            responsibilities, eligibility,
            application_deadline, application_link, status
        } = req.body;

        await db.query(
            `UPDATE jobs SET
                job_title = ?, company_name = ?, job_type = ?, work_mode = ?,
                location = ?, salary_package = ?, required_skills = ?,
                job_description = ?, responsibilities = ?, eligibility = ?,
                application_deadline = ?, application_link = ?, status = ?
            WHERE job_id = ?`,
            [
                job_title, company_name, job_type, work_mode, location,
                salary_package, required_skills, job_description,
                responsibilities, eligibility,
                application_deadline, application_link, status,
                id
            ]
        );

        const [updatedJob] = await db.query('SELECT * FROM jobs WHERE job_id = ?', [id]);
        res.json(updatedJob[0]);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Server error updating job' });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM jobs WHERE job_id = ?', [id]);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server error deleting job' });
    }
};
