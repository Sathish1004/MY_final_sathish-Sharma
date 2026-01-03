import db from '../config/db.js';

export const addFeedback = async (req, res) => {
    try {
        const {
            user_id,
            user_name,
            rating, // Overall rating (calculated or passed)
            category,
            message,
            rating_course,
            rating_ui,
            rating_ux,
            rating_coding,
            rating_general,
            comments
        } = req.body;

        // Validation: Ensure all 5 specific ratings are present
        if (!rating_course || !rating_ui || !rating_ux || !rating_coding || !rating_general) {
            return res.status(400).json({ message: 'All 5 rating categories are mandatory.' });
        }

        const query = `
            INSERT INTO feedback 
            (user_id, user_name, rating, category, message, rating_course, rating_ui, rating_ux, rating_coding, rating_general, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            user_id || null,
            user_name || 'Anonymous',
            rating,
            category || 'Comprehensive',
            message || '',
            rating_course,
            rating_ui,
            rating_ux,
            rating_coding,
            rating_general,
            comments || ''
        ]);

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserFeedback = async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await db.query('SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
