
import db from './config/db.js';

async function addScreenshotsColumn() {
    try {
        console.log('Adding screenshots column to project_submissions table...');

        // Check if column exists
        const [columns] = await db.query('SHOW COLUMNS FROM project_submissions LIKE "screenshots"');
        if (columns.length === 0) {
            await db.query('ALTER TABLE project_submissions ADD COLUMN screenshots JSON AFTER tech_stack');
            console.log('screenshots column added.');
        } else {
            console.log('screenshots column already exists.');
        }

        console.log('Database update completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Database update failed:', error);
        process.exit(1);
    }
}

addScreenshotsColumn();
