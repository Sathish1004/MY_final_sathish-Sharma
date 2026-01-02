
import db from './config/db.js';

async function fixData() {
    try {
        console.log('Fixing data and schema for bookings and projects...');

        // 1. Fix mentor_bookings
        const [mbCols] = await db.query('SHOW COLUMNS FROM mentor_bookings');
        const mbFields = mbCols.map(c => c.Field);

        if (!mbFields.includes('user_name')) {
            await db.query('ALTER TABLE mentor_bookings ADD COLUMN user_name VARCHAR(255) AFTER user_id');
            console.log('Added user_name to mentor_bookings');
        }
        if (!mbFields.includes('user_email')) {
            await db.query('ALTER TABLE mentor_bookings ADD COLUMN user_email VARCHAR(255) AFTER user_name');
            console.log('Added user_email to mentor_bookings');
        }

        // 2. Fix project_interests
        const [piCols] = await db.query('SHOW COLUMNS FROM project_interests');
        const piFields = piCols.map(c => c.Field);

        if (!piFields.includes('user_name')) {
            await db.query('ALTER TABLE project_interests ADD COLUMN user_name VARCHAR(255) AFTER user_id');
            console.log('Added user_name to project_interests');
        }
        if (!piFields.includes('user_email')) {
            await db.query('ALTER TABLE project_interests ADD COLUMN user_email VARCHAR(255) AFTER user_name');
            console.log('Added user_email to project_interests');
        }

        // 3. Fix project_submissions (it has 'name' and 'email' already usually)
        const [psCols] = await db.query('SHOW COLUMNS FROM project_submissions');
        const psFields = psCols.map(c => c.Field);

        if (!psFields.includes('name')) {
            await db.query('ALTER TABLE project_submissions ADD COLUMN name VARCHAR(255) AFTER user_id');
            console.log('Added name to project_submissions');
        }
        if (!psFields.includes('email')) {
            await db.query('ALTER TABLE project_submissions ADD COLUMN email VARCHAR(255) AFTER name');
            console.log('Added email to project_submissions');
        }

        // 4. Populate NULLs
        console.log('Populating NULL names and emails...');

        // Update mentor_bookings
        await db.query(`
            UPDATE mentor_bookings mb
            JOIN users u ON mb.user_id = u.id
            SET mb.user_name = u.name, mb.user_email = u.email
            WHERE mb.user_name IS NULL OR mb.user_name = '' OR mb.user_email IS NULL OR mb.user_email = ''
        `);

        // Update project_interests
        await db.query(`
            UPDATE project_interests pi
            JOIN users u ON pi.user_id = u.id
            SET pi.user_name = u.name, pi.user_email = u.email
            WHERE pi.user_name IS NULL OR pi.user_name = '' OR pi.user_email IS NULL OR pi.user_email = ''
        `);

        // Update project_submissions
        await db.query(`
            UPDATE project_submissions ps
            JOIN users u ON ps.user_id = u.id
            SET ps.name = u.name, ps.email = u.email
            WHERE ps.name IS NULL OR ps.name = '' OR ps.email IS NULL OR ps.email = ''
        `);

        console.log('All data populated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration/Fix failed:', error);
        process.exit(1);
    }
}

fixData();
