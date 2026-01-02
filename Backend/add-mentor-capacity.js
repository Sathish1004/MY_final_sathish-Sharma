import db from './config/db.js';

async function addMentorCapacity() {
    try {
        // Add max_participants column to mentors table if it doesn't exist
        const query = `
            ALTER TABLE mentors
            ADD COLUMN max_participants INT DEFAULT 5 NOT NULL;
        `;

        await db.query(query);
        console.log("Successfully added max_participants column to mentors table.");
        process.exit(0);
    } catch (error) {
        // Check if error is because column already exists
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Column max_participants already exists.");
            process.exit(0);
        } else {
            console.error("Error updating table:", error);
            process.exit(1);
        }
    }
}

addMentorCapacity();
