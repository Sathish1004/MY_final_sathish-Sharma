import db from './config/db.js';

async function getTableDef() {
    try {
        const [rows] = await db.query('SHOW CREATE TABLE mentor_bookings');
        console.log(rows[0]['Create Table']);
        process.exit(0);
    } catch (error) {
        console.error("Error getting table def:", error);
        process.exit(1);
    }
}

getTableDef();
