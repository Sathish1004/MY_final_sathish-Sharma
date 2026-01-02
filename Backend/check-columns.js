import db from './config/db.js';

async function checkColumns() {
    try {
        const [rows] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'mentor_bookings';
        `);
        console.log("Columns in mentor_bookings:");
        console.log(rows.map(r => r.COLUMN_NAME).join(', '));
        process.exit(0);
    } catch (error) {
        console.error("Error checking columns:", error);
        process.exit(1);
    }
}

checkColumns();
