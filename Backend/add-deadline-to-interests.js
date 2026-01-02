
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Adding submission_deadline to project_interests...');

        // 1. Rename created_at to interest_date
        const [cols] = await db.query('SHOW COLUMNS FROM project_interests');
        const fields = cols.map(c => c.Field);

        if (fields.includes('created_at') && !fields.includes('interest_date')) {
            await db.query('ALTER TABLE project_interests CHANGE COLUMN created_at interest_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            console.log('Renamed created_at to interest_date');
        }

        // 2. Add submission_deadline
        if (!fields.includes('submission_deadline')) {
            await db.query('ALTER TABLE project_interests ADD COLUMN submission_deadline DATETIME AFTER interest_date');
            console.log('Added submission_deadline column');
        }

        // 3. Update status ENUM to include 'expired'
        await db.query("ALTER TABLE project_interests MODIFY COLUMN status ENUM('interested', 'submitted', 'expired') DEFAULT 'interested'");
        console.log('Updated status ENUM to include expired');

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
