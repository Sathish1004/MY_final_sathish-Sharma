
import db from './config/db.js';

async function updateSubmissionsTable() {
    try {
        console.log('Updating project_submissions table schema...');

        // Add tech_stack column
        const [techStackCol] = await db.query('SHOW COLUMNS FROM project_submissions LIKE "tech_stack"');
        if (techStackCol.length === 0) {
            await db.query('ALTER TABLE project_submissions ADD COLUMN tech_stack TEXT AFTER live_link');
            console.log('tech_stack column added.');
        }

        // Add is_original_work column
        const [originalWorkCol] = await db.query('SHOW COLUMNS FROM project_submissions LIKE "is_original_work"');
        if (originalWorkCol.length === 0) {
            await db.query('ALTER TABLE project_submissions ADD COLUMN is_original_work BOOLEAN DEFAULT FALSE AFTER tech_stack');
            console.log('is_original_work column added.');
        }

        console.log('Schema update completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Schema update failed:', error);
        process.exit(1);
    }
}

updateSubmissionsTable();
