import db from './config/db.js';

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE mentor_bookings');
        console.log("Schema for mentor_bookings:");
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error("Error checking schema:", error);
        process.exit(1);
    }
}

checkSchema();
