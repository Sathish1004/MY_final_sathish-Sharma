import db from '../config/db.js';

export const addNews = async (req, res) => {
    try {
        const { title, description, category, status, publish_date, image_url, external_link } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Please provide all required fields (title, description, category)' });
        }

        const query = `
            INSERT INTO news (title, description, category, status, publish_date, image_url, external_link)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        // Use current date if publish_date is not provided
        const dateToPublish = publish_date || new Date();

        const [result] = await db.query(query, [title, description, category, status || 'Draft', dateToPublish, image_url, external_link]);

        res.status(201).json({ message: 'News added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllNews = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM news ORDER BY publish_date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPublicNews = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM news WHERE status = 'Publish' ORDER BY publish_date DESC");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching public news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, status, publish_date, image_url, external_link } = req.body;

        const query = `
            UPDATE news 
            SET title = ?, description = ?, category = ?, status = ?, publish_date = ?, image_url = ?, external_link = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [title, description, category, status, publish_date, image_url, external_link, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'News item not found' });
        }

        res.json({ message: 'News updated successfully' });
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM news WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'News item not found' });
        }

        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
