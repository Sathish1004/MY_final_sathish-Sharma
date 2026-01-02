import db from './config/db.js';

async function fixSchema() {
    try {
        const query = `
            ALTER TABLE mentor_bookings
            ADD COLUMN user_id INT,
            ADD COLUMN mentor_id INT;
        `;
        await db.query(query);
        console.log("Successfully added user_id and mentor_id columns to mentor_bookings table.");
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Columns already exist.");
            process.exit(0);
        }
        console.error("Error updating table:", error);
        process.exit(1);
    }
}

fixSchema();
