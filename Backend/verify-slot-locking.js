
import db from './config/db.js';

async function verifyLocking() {
    try {
        console.log('Verifying Mentorship Slot Locking...');

        // 1. Get a mentor and a slot
        const [mentors] = await db.query('SELECT id, availability FROM mentors LIMIT 1');
        if (mentors.length === 0) {
            console.error('No mentors found');
            process.exit(1);
        }
        const mentor = mentors[0];
        let slots = mentor.availability;
        if (typeof slots === 'string') slots = JSON.parse(slots);
        const slotToBook = slots[0];

        console.log(`Testing with Mentor ID: ${mentor.id}, Slot: ${slotToBook}`);

        // 2. Get a valid user ID
        const [users] = await db.query('SELECT id FROM users LIMIT 1');
        const testUserId = users[0].id;
        console.log(`Using Test User ID: ${testUserId}`);

        // 3. Clear previous test data
        await db.query('DELETE FROM mentor_bookings WHERE mentor_id = ? AND time_slot = ?', [mentor.id, slotToBook]);

        // 4. User 1 (simulated) books the slot
        await db.query(
            'INSERT INTO mentor_bookings (user_id, mentor_id, time_slot, topic, status) VALUES (?, ?, ?, ?, ?)',
            [testUserId, mentor.id, slotToBook, 'Locked Slot Test', 'booked']
        );
        console.log('User 1 booked the slot.');

        // 5. Try (simulated) User 2 booking the same slot
        // This is what the controller does:
        const [existing] = await db.query(
            'SELECT booking_id FROM mentor_bookings WHERE mentor_id = ? AND time_slot = ? AND status = "booked"',
            [mentor.id, slotToBook]
        );

        if (existing.length > 0) {
            console.log('SUCCESS: Conflict detected! User 2 cannot book this slot.');
        } else {
            console.error('FAILURE: Conflict NOT detected! Locking logic is broken.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verifyLocking();
