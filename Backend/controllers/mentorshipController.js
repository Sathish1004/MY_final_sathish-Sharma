import db from '../config/db.js';

export const getMentors = async (req, res) => {
    try {
        const [mentors] = await db.query('SELECT * FROM mentors ORDER BY name ASC');

        // Fetch all current booking counts grouped by mentor and slot
        const [bookings] = await db.query(
            'SELECT mentor_id, time_slot, COUNT(*) as count FROM mentor_bookings WHERE status = "booked" GROUP BY mentor_id, time_slot'
        );

        const isSlotInFuture = (slot) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const parts = slot.split(' ');
            if (parts.length < 3) return false;
            const [dayStr, timeStr, ampm] = parts;
            const now = new Date();
            const currentDay = now.getDay();
            const slotDay = days.indexOf(dayStr);

            // Simple next-occurrence logic (assuming slots are weekly recurring or similar)
            // If slot day is today or later in week
            let dayDiff = slotDay - currentDay;
            if (dayDiff < 0) dayDiff += 7; // next week

            let [hours, minutes] = timeStr.split(':').map(Number);
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;

            const slotTime = new Date(now);
            slotTime.setDate(now.getDate() + dayDiff);
            slotTime.setHours(hours, minutes, 0, 0);

            // If it's today and time passed, it's not future. 
            // If dayDiff was 0 (today), we need to check time.
            if (dayDiff === 0 && slotTime <= now) {
                // If today and passed, assume next week? 
                // Usually mentorship slots are "upcoming". If "Mon 10am" passed today, is it available for next Mon?
                // The current frontend logic is strict on "upcoming".
                // Let's stick to strict future check relative to NOW.
                return false;
            }
            return true;
        };

        const formattedMentors = mentors.map(m => {
            const skills = typeof m.skills === 'string' ? JSON.parse(m.skills) : m.skills;
            const availability = typeof m.availability === 'string' ? JSON.parse(m.availability) : m.availability;
            const max = m.max_participants || 5;

            // Check if every slot is either full or in the past
            const isFullyBooked = availability.every(slot => {
                if (!isSlotInFuture(slot)) return true; // Passed slots count as "unavailable"

                // Check if full
                const booking = bookings.find(b => b.mentor_id === m.id && b.time_slot === slot);
                const count = booking ? booking.count : 0;
                return count >= max;
            });

            return {
                ...m,
                skills,
                availability,
                is_fully_booked: isFullyBooked
            };
        });

        res.status(200).json(formattedMentors);
    } catch (error) {
        console.error("Error fetching mentors:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const bookSession = async (req, res) => {
    try {
        const { mentor_id, time_slot, topic } = req.body;
        const user_id = req.user.id;

        if (!mentor_id || !time_slot) {
            return res.status(400).json({ message: "Mentor and time slot are required" });
        }

        // Check if slot is in the future
        const isSlotInFuture = (slot) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const parts = slot.split(' ');
            if (parts.length < 3) return true;
            const [dayStr, timeStr, ampm] = parts;
            const now = new Date();
            const currentDay = now.getDay();
            const slotDay = days.indexOf(dayStr);

            if (slotDay < currentDay) return false;
            if (slotDay > currentDay) return true;

            let [hours, minutes] = timeStr.split(':').map(Number);
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;

            const slotTime = new Date(now);
            slotTime.setHours(hours, minutes, 0, 0);
            return slotTime > now;
        };

        if (!isSlotInFuture(time_slot)) {
            return res.status(400).json({ message: "You can only book sessions for upcoming time slots." });
        }

        // 1. Check if user already has a booking with this mentor AT THIS TIME
        // (Allow multiple bookings with same mentor diff times, but strict on same slot duplicate)
        const [existingUserBooking] = await db.query(
            'SELECT booking_id FROM mentor_bookings WHERE user_id = ? AND mentor_id = ? AND time_slot = ? AND status = "booked"',
            [user_id, mentor_id, time_slot]
        );

        if (existingUserBooking.length > 0) {
            return res.status(400).json({ message: "You have already joined this session." });
        }

        // 2. Check Capacity for this slot
        // Get mentor capacity and name
        const [mentorData] = await db.query('SELECT name, max_participants FROM mentors WHERE id = ?', [mentor_id]);

        if (mentorData.length === 0) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const maxParticipants = mentorData[0].max_participants || 5;
        const mentorName = mentorData[0].name;

        // Count current bookings
        const [currentBookings] = await db.query(
            'SELECT COUNT(*) as count FROM mentor_bookings WHERE mentor_id = ? AND time_slot = ? AND status = "booked"',
            [mentor_id, time_slot]
        );

        const participantCount = currentBookings[0]?.count || 0;

        if (participantCount >= maxParticipants) {
            return res.status(400).json({ message: "This session is full." });
        }

        // Fetch user details to store with booking
        const [userDetails] = await db.query('SELECT name, email FROM users WHERE id = ?', [user_id]);
        const userName = userDetails[0]?.name || 'Unknown';
        const userEmail = userDetails[0]?.email || 'Unknown';

        // 3. Create booking
        await db.query(
            'INSERT INTO mentor_bookings (user_id, user_name, user_email, mentor_id, time_slot, topic, status, created_at) VALUES (?, ?, ?, ?, ?, ?, "booked", NOW())',
            [user_id, userName, userEmail, mentor_id, time_slot, topic || '']
        );

        res.status(201).json({ message: "Session joined successfully" });
    } catch (error) {
        console.error("Error booking session:", error);
        // Log generic message to client but keep detailed log on server
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

export const getBookedSlots = async (req, res) => {
    try {
        const { mentor_id } = req.params;

        // Get mentor capacity
        const [mentorData] = await db.query('SELECT max_participants FROM mentors WHERE id = ?', [mentor_id]);
        const maxParticipants = mentorData[0]?.max_participants || 5;

        // Get counts for each slot
        const [bookings] = await db.query(
            'SELECT time_slot, COUNT(*) as count FROM mentor_bookings WHERE mentor_id = ? AND status = "booked" GROUP BY time_slot',
            [mentor_id]
        );

        // Map to object for easy lookup
        const slotStats = bookings.map(b => ({
            time_slot: b.time_slot,
            count: b.count,
            max: maxParticipants,
            is_full: b.count >= maxParticipants
        }));

        res.status(200).json(slotStats);
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserSessions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const query = `
            SELECT b.*, m.name as mentor_name
            FROM mentor_bookings b
            JOIN mentors m ON b.mentor_id = m.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `;
        const [rows] = await db.query(query, [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching user sessions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllSessions = async (req, res) => {
    try {
        const query = `
            SELECT b.*, m.name as mentor_name, u.name as user_name 
            FROM mentor_bookings b
            JOIN mentors m ON b.mentor_id = m.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Server error" });
    }
};
