
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Aligning database schema with user requirements...');

        // 1. Update project_interests
        const [interestCols] = await db.query('SHOW COLUMNS FROM project_interests');
        const interestFields = interestCols.map(c => c.Field);

        if (interestFields.includes('id') && !interestFields.includes('interest_id')) {
            await db.query('ALTER TABLE project_interests CHANGE COLUMN id interest_id INT AUTO_INCREMENT');
            console.log('Renamed id to interest_id in project_interests');
        }

        if (!interestFields.includes('status')) {
            await db.query("ALTER TABLE project_interests ADD COLUMN status ENUM('interested', 'submitted') DEFAULT 'interested' AFTER project_id");
            console.log('Added status column to project_interests');
        }

        // 2. Update project_submissions
        const [submissionCols] = await db.query('SHOW COLUMNS FROM project_submissions');
        const submissionFields = submissionCols.map(c => c.Field);

        if (submissionFields.includes('id') && !submissionFields.includes('submission_id')) {
            await db.query('ALTER TABLE project_submissions CHANGE COLUMN id submission_id INT AUTO_INCREMENT');
            console.log('Renamed id to submission_id in project_submissions');
        }

        if (submissionFields.includes('github_repo') && !submissionFields.includes('github_url')) {
            await db.query('ALTER TABLE project_submissions CHANGE COLUMN github_repo github_url VARCHAR(255)');
            console.log('Renamed github_repo to github_url');
        }

        if (submissionFields.includes('live_link') && !submissionFields.includes('live_demo_url')) {
            await db.query('ALTER TABLE project_submissions CHANGE COLUMN live_link live_demo_url VARCHAR(255)');
            console.log('Renamed live_link to live_demo_url');
        }

        if (submissionFields.includes('screenshots') && !submissionFields.includes('images')) {
            await db.query('ALTER TABLE project_submissions CHANGE COLUMN screenshots images JSON');
            console.log('Renamed screenshots to images');
        }

        if (submissionFields.includes('created_at') && !submissionFields.includes('submitted_at')) {
            await db.query('ALTER TABLE project_submissions CHANGE COLUMN created_at submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            console.log('Renamed created_at to submitted_at');
        }

        console.log('Database aligned successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
