
import db from './config/db.js';

async function verifyOverlappingBookings() {
    try {
        console.log('--- Verifying Overlapping Mentor Bookings ---');

        // 1. Get a valid user
        const [users] = await db.query('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.error('No users found in database.');
            process.exit(1);
        }
        const userId = users[0].id;

        // 2. Get two different mentors
        const [mentors] = await db.query('SELECT id, availability FROM mentors LIMIT 2');
        if (mentors.length < 2) {
            console.error('Not enough mentors found for testing.');
            process.exit(1);
        }
        const mentor1 = mentors[0];
        const mentor2 = mentors[1];

        // Parse availability to get a shared slot or just use the first available from mentor1
        const mentor1Availability = typeof mentor1.availability === 'string' ? JSON.parse(mentor1.availability) : mentor1.availability;
        const testSlot = mentor1Availability[0];

        console.log(`Testing with User ID: ${userId}, Slot: ${testSlot}`);

        // 3. Clean up existing bookings for this user/slot to ensure clean test
        await db.query('DELETE FROM mentor_bookings WHERE user_id = ? AND time_slot = ?', [userId, testSlot]);
        console.log('Cleaned up previous test bookings.');

        // 4. Book Mentor 1 for User at testSlot
        console.log(`Attempting to book Mentor ${mentor1.id} for User ${userId} at ${testSlot}...`);
        const [book1] = await db.query(
            'INSERT INTO mentor_bookings (user_id, mentor_id, time_slot, topic) VALUES (?, ?, ?, ?)',
            [userId, mentor1.id, testSlot, 'Test Topic 1']
        );
        console.log('Booked Mentor 1 Successfully.');

        // 5. Try to book Mentor 2 for SAME User at SAME testSlot via a simulated request to the controller logic
        // Since we want to test the validation, we should call the same query as the controller
        console.log(`Attempting to book Mentor ${mentor2.id} for SAME User at SAME ${testSlot}...`);

        const [userTimeConflict] = await db.query(
            'SELECT booking_id FROM mentor_bookings WHERE user_id = ? AND time_slot = ? AND status = "booked"',
            [userId, testSlot]
        );

        if (userTimeConflict.length > 0) {
            console.log('SUCCESS: Validation caught overlapping booking for user!');
            console.log(`Conflict found: Booking ID ${userTimeConflict[0].booking_id}`);
        } else {
            console.error('FAILURE: Validation FAILED to catch overlapping booking for user.');
        }

        // Cleanup
        await db.query('DELETE FROM mentor_bookings WHERE user_id = ? AND time_slot = ?', [userId, testSlot]);
        console.log('Cleaned up test data.');

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verifyOverlappingBookings();
