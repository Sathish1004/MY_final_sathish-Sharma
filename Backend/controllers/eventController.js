import db from '../config/db.js';

// Get all events
export const getEvents = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events' });
    }
};

// Create a new event
export const createEvent = async (req, res) => {
    const { title, type, date, time, location, prize, description, registration_link, image_url } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO events (title, type, date, time, location, prize, description, registration_link, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, type, date, time, location, prize, description, registration_link, image_url]
        );
        res.status(201).json({ id: result.insertId, message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error creating event' });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error deleting event' });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, type, date, time, location, prize, description, registration_link, image_url } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE events SET title=?, type=?, date=?, time=?, location=?, prize=?, description=?, registration_link=?, image_url=? WHERE id=?',
            [title, type, date, time, location, prize, description, registration_link, image_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error updating event' });
    }
};
