
import db from '../config/db.js';
import crypto from 'crypto';

// Generate a random token
const generateToken = () => crypto.randomBytes(16).toString('hex');

export const createShareLink = async (req, res) => {
    const userId = req.user.id; // Assumes auth middleware populates req.user
    const { share_config } = req.body;

    if (!share_config) {
        return res.status(400).json({ message: 'Share configuration is required' });
    }

    try {
        // Check if user already has a share link
        const [existing] = await db.query('SELECT share_token FROM shared_progress WHERE user_id = ?', [userId]);

        let token;
        if (existing.length > 0) {
            token = existing[0].share_token;
            // Update config
            await db.query('UPDATE shared_progress SET share_config = ? WHERE user_id = ?', [JSON.stringify(share_config), userId]);
        } else {
            token = generateToken();
            await db.query('INSERT INTO shared_progress (user_id, share_token, share_config) VALUES (?, ?, ?)',
                [userId, token, JSON.stringify(share_config)]);
        }

        const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:8082'}/share/${token}`;
        res.json({ share_url: shareUrl, share_token: token });

    } catch (error) {
        console.error('Error creating share link:', error);
        res.status(500).json({ message: 'Server error creating share link' });
    }
};

export const getSharedProgress = async (req, res) => {
    const { token } = req.params;

    try {
        // Get share config and user id
        const [shares] = await db.query('SELECT * FROM shared_progress WHERE share_token = ?', [token]);

        if (shares.length === 0) {
            return res.status(404).json({ message: 'Share link not found or expired' });
        }

        const share = shares[0];
        const config = share.share_config; // Database returns JSON column as object automatically usually, or parse it
        const userId = share.user_id;

        // Fetch user basic info
        const [users] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = users[0]?.name || 'Student';

        const result = {
            student_name: userName,
            config: config,
            data: {}
        };

        // Fetch data based on config
        // Note: In a real app, you would join tables. Here we mock/fetch basic stats as per request context
        // Assuming we want to return similar stats structure as Dashboard

        // Mocking/Fetching Logic - Ideally this should reuse DashboardService logic but simplified here

        if (config.overview || config.courses) {
            // Fetch course counts
            // Mock for now or query 'enrollments'
            result.data.active_courses = 8; // Replace with actual DB query if available
            result.data.completed_courses = 12;
        }

        if (config.projects) {
            result.data.completed_projects = 15; // Replace with DB query
        }

        if (config.mentorship) {
            result.data.mentor_sessions = 12; // Replace with DB query
        }

        if (config.jobs) {
            result.data.job_applications = 23; // Replace with DB query
        }

        if (config.learning_paths) {
            // Static for this demo as per Dashboard.tsx
            result.data.learning_paths = [
                { title: 'Frontend Developer', progress: 85, courses: 12, color: 'from-blue-500 to-cyan-400' },
                { title: 'Full Stack Engineer', progress: 60, courses: 18, color: 'from-purple-500 to-pink-400' },
                { title: 'DevOps Engineer', progress: 30, courses: 10, color: 'from-emerald-500 to-green-400' },
                { title: 'UI/UX Designer', progress: 45, courses: 8, color: 'from-amber-500 to-orange-400' },
            ];
        }

        if (config.events) {
            // Mock upcoming events
            result.data.upcoming_events = [
                { title: 'Web Development Workshop', date: 'Dec 20, 2024', type: 'Workshop', priority: 'high' }
            ];
        }

        res.json(result);

    } catch (error) {
        console.error('Error fetching shared progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
