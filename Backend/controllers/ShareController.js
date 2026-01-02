
import db from '../config/db.js';
import crypto from 'crypto';

// Generate a random token
const generateToken = () => crypto.randomBytes(16).toString('hex');

export const createShareLink = async (req, res) => {
    const userId = req.user.id;
    const { share_config, share_data } = req.body;

    if (!share_config) {
        return res.status(400).json({ message: 'Share configuration is required' });
    }

    try {
        const [existing] = await db.query('SELECT share_token FROM shared_progress WHERE user_id = ?', [userId]);

        let token;
        const dataToSave = JSON.stringify(share_data || {});
        const configToSave = JSON.stringify(share_config);

        if (existing.length > 0) {
            token = existing[0].share_token;
            await db.query('UPDATE shared_progress SET share_config = ?, share_data = ? WHERE user_id = ?',
                [configToSave, dataToSave, userId]);
        } else {
            token = generateToken();
            await db.query('INSERT INTO shared_progress (user_id, share_token, share_config, share_data) VALUES (?, ?, ?, ?)',
                [userId, token, configToSave, dataToSave]);
        }

        const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${token}`;
        res.json({ share_url: shareUrl, share_token: token });

    } catch (error) {
        console.error('Error creating share link:', error);
        res.status(500).json({ message: 'Server error creating share link' });
    }
};

export const getSharedProgress = async (req, res) => {
    const { token } = req.params;

    try {
        const [shares] = await db.query('SELECT * FROM shared_progress WHERE share_token = ?', [token]);

        if (shares.length === 0) {
            return res.status(404).json({ message: 'Share link not found or expired' });
        }

        const share = shares[0];
        const config = share.share_config;
        const userId = share.user_id;
        const snapshotData = share.share_data || {};

        const [users] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = users[0]?.name || 'Student';

        const result = {
            student_name: userName,
            config: config,
            data: snapshotData
        };

        // Fallback for legacy data/mocks if snapshot is empty (optional)
        if (Object.keys(snapshotData).length === 0) {
            if (config.overview || config.courses) {
                result.data.active_courses = 0;
                result.data.completed_courses = 0;
            }
            if (config.projects) result.data.completed_projects = 0;
            if (config.mentorship) result.data.mentor_sessions = 0;
            if (config.jobs) result.data.job_applications = 0;
        }

        res.json(result);

    } catch (error) {
        console.error('Error fetching shared progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
