
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Adding user_email column to project_interests...');
        await db.query('ALTER TABLE project_interests ADD COLUMN user_email VARCHAR(255) AFTER user_name');
        console.log('Migration successful!');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column user_email already exists.');
        } else {
            console.error('Migration failed:', error.message);
        }
    }
    process.exit();
}

migrate();
