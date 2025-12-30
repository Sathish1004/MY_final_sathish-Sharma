import db from '../config/db.js';

export const addFeedback = async (req, res) => {
    try {
        const {
            user_id,
            user_name,
            rating,
            category,
            message,
            rating_course,
            rating_ui,
            rating_ux,
            rating_coding,
            comments
        } = req.body;

        if (!rating || !category) {
            return res.status(400).json({ message: 'Rating and category are required' });
        }

        const query = `
            INSERT INTO feedback 
            (user_id, user_name, rating, category, message, rating_course, rating_ui, rating_ux, rating_coding, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            user_id || null,
            user_name || 'Anonymous',
            rating,
            category,
            message || '',
            rating_course || 0,
            rating_ui || 0,
            rating_ux || 0,
            rating_coding || 0,
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
