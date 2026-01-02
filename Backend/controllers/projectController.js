import db from '../config/db.js';

// Get All Projects with Interest Status
export const getAllProjects = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        const [projects] = await db.query(`
            SELECT p.*, 
                   (SELECT COUNT(*) FROM project_interests WHERE project_id = p.id) as participants,
                   CASE WHEN pi.interest_id IS NOT NULL THEN 1 ELSE 0 END as isInterested,
                   CASE WHEN ps.submission_id IS NOT NULL THEN 1 ELSE 0 END as isSubmitted,
                   pi.status as interestStatus,
                   pi.interest_date,
                   pi.submission_deadline
            FROM projects p
            LEFT JOIN project_interests pi ON p.id = pi.project_id AND pi.user_id = ?
            LEFT JOIN project_submissions ps ON p.id = ps.project_id AND ps.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId, userId]);

        const mappedProjects = projects.map(p => {
            // Handle expiration logic on the fly for better consistency
            let currentStatus = p.interestStatus;
            const now = new Date();
            if (currentStatus === 'interested' && p.submission_deadline && new Date(p.submission_deadline) < now) {
                currentStatus = 'expired';
            }

            return {
                ...p,
                tech_stack: typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack,
                requirements: typeof p.requirements === 'string' ? JSON.parse(p.requirements) : p.requirements,
                learning_objectives: typeof p.learning_objectives === 'string' ? JSON.parse(p.learning_objectives) : p.learning_objectives,
                tasks: typeof p.tasks === 'string' ? JSON.parse(p.tasks) : p.tasks,
                team_members: typeof p.team_members === 'string' ? JSON.parse(p.team_members) : p.team_members,
                isInterested: !!p.isInterested,
                isSubmitted: !!p.isSubmitted,
                interestStatus: currentStatus,
                deadline: p.submission_deadline
            };
        });

        res.json(mappedProjects);
    } catch (error) {
        console.error('Get All Projects Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Project Stats (Active Projects, Active Developers)
export const getProjectStats = async (req, res) => {
    try {
        // Active Projects: Status is 'active' or has at least one interest
        const [projectsCount] = await db.query(`
            SELECT COUNT(DISTINCT p.id) as count 
            FROM projects p
            JOIN project_interests i ON p.id = i.project_id
            WHERE p.status = 'active' OR i.interest_id IS NOT NULL
        `);

        // Active Developers: Unique users in project_interests
        const [developersCount] = await db.query(`
            SELECT COUNT(DISTINCT user_id) as count FROM project_interests
        `);

        res.json({
            activeProjects: projectsCount[0].count,
            activeDevelopers: developersCount[0].count
        });
    } catch (error) {
        console.error('Get Project Stats Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Show Interest (Record User Interest)
export const showInterest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        // 1. Check if project exists
        const [project] = await db.query('SELECT title, status FROM projects WHERE id = ?', [projectId]);
        if (project.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const projectTitle = project[0].title;
        const currentStatus = project[0].status;

        // 2. Check if interest already exists
        const [existing] = await db.query(
            'SELECT interest_id FROM project_interests WHERE user_id = ? AND project_id = ?',
            [userId, projectId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already shown interest in this project' });
        }

        // 3. Get user details from database to ensure we have name and email
        const [userData] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId]);
        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userName = userData[0].name;
        const userEmail = userData[0].email;

        // 4. Calculate deadline (7 days from now)
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);

        // 5. Insert interest with status 'interested' and deadline
        await db.query(
            'INSERT INTO project_interests (user_id, user_name, user_email, project_id, project_title, status, submission_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, userName, userEmail, projectId, projectTitle, 'interested', deadline]
        );

        // 5. Update project status to 'active' if it was 'open'
        if (currentStatus === 'open') {
            await db.query('UPDATE projects SET status = "active" WHERE id = ?', [projectId]);
        }

        res.status(201).json({ message: 'Interest recorded successfully', status: 'active' });
    } catch (error) {
        console.error('Show Interest Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Interests
export const getUserInterests = async (req, res) => {
    try {
        const userId = req.user.id;
        const [interests] = await db.query(`
            SELECT i.*, p.title, p.description, p.status 
            FROM project_interests i
            JOIN projects p ON i.project_id = p.id
            WHERE i.user_id = ? 
            ORDER BY i.created_at DESC
        `, [userId]);
        res.json(interests);
    } catch (error) {
        console.error('Get User Interests Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit Project
export const submitProject = async (req, res) => {
    try {
        const { projectId, githubUrl, liveDemoUrl, techStack, isOriginalWork, images, description } = req.body;
        const userId = req.user.id;

        if (!projectId || !githubUrl || !techStack || isOriginalWork === undefined || !images || images.length === 0) {
            return res.status(400).json({ message: 'Missing required fields or images' });
        }

        if (!isOriginalWork) {
            return res.status(400).json({ message: 'You must confirm that this is your original work' });
        }

        // 0. Fetch user details from database to ensure we have name and email
        const [userData] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId]);
        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userName = userData[0].name;
        const userEmail = userData[0].email;

        // 1. Check if interest exists and is not expired
        const [interest] = await db.query(
            'SELECT interest_id, status, submission_deadline FROM project_interests WHERE user_id = ? AND project_id = ?',
            [userId, projectId]
        );

        if (interest.length === 0) {
            return res.status(403).json({ message: 'You must show interest in the project before submitting' });
        }

        const currentInterest = interest[0];
        const now = new Date();

        if (currentInterest.status === 'expired' || (currentInterest.submission_deadline && new Date(currentInterest.submission_deadline) < now)) {
            // Update status to expired if it wasn't already
            if (currentInterest.status !== 'expired') {
                await db.query('UPDATE project_interests SET status = "expired" WHERE interest_id = ?', [currentInterest.interest_id]);
            }
            return res.status(403).json({ message: 'Submission deadline has passed' });
        }

        if (currentInterest.status === 'submitted') {
            return res.status(400).json({ message: 'You have already submitted this project' });
        }

        // 2. Check if already submitted
        const [existing] = await db.query(
            'SELECT submission_id FROM project_submissions WHERE user_id = ? AND project_id = ?',
            [userId, projectId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already submitted this project' });
        }

        // 3. Insert submission using new column names
        await db.query(`
            INSERT INTO project_submissions (user_id, project_id, name, email, github_url, live_demo_url, tech_stack, is_original_work, images, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [userId, projectId, userName, userEmail, githubUrl, liveDemoUrl, techStack, isOriginalWork, JSON.stringify(images), description]);

        // 4. Update interest status to 'submitted'
        await db.query(
            'UPDATE project_interests SET status = ? WHERE user_id = ? AND project_id = ?',
            ['submitted', userId, projectId]
        );

        res.status(201).json({ message: 'Project submitted successfully' });
    } catch (error) {
        console.error('Submit Project error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
