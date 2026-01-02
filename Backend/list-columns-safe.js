import db from './config/db.js';

async function listColumns() {
    try {
        const [rows] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'mentor_bookings';
        `);
        console.log("COLUMNS FOUND:");
        rows.forEach(r => console.log(r.COLUMN_NAME));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listColumns();
