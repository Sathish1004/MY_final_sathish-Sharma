
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Adding user_name and user_email to mentor_bookings...');

        await db.query(`
            ALTER TABLE mentor_bookings 
            ADD COLUMN user_name VARCHAR(255) AFTER user_id,
            ADD COLUMN user_email VARCHAR(255) AFTER user_name
        `);

        console.log('Migration successful.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Columns already exist.');
            process.exit(0);
        }
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
