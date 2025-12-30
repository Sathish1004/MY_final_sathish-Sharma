import db from '../config/db.js';

export const bookSession = async (req, res) => {
    try {
        const { student_name, student_email, mentor_name, slot_time, topic } = req.body;

        // Map frontend fields to backend schema
        const user_name = student_name;
        const email = student_email;
        // status defaults to 'Pending'
        // booking_date needs to be a date. Since we only have "Mon 10:00 AM", we'll default to current date for now 
        // or we could try to calculate the next occurrence of that day. For simplicity, we use CURDATE().
        const booking_date = new Date();

        if (!user_name || !email || !mentor_name || !slot_time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = `
            INSERT INTO mentor_bookings (user_name, email, mentor_name, slot_time, topic, booking_date, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending')
        `;

        await db.query(query, [user_name, email, mentor_name, slot_time, topic || '', booking_date]);

        res.status(201).json({ message: "Session booked successfully" });
    } catch (error) {
        console.error("Error booking session:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllSessions = async (req, res) => {
    try {
        const query = `SELECT * FROM mentor_bookings ORDER BY created_at DESC`;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Server error" });
    }
};
