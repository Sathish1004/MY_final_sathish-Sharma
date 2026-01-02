
import db from './config/db.js';

async function checkSchema() {
    try {
        const [interests] = await db.query('DESCRIBE project_interests');
        const [submissions] = await db.query('DESCRIBE project_submissions');
        console.log('--- project_interests ---');
        interests.forEach(c => console.log(`${c.Field} (${c.Type})`));
        console.log('\n--- project_submissions ---');
        submissions.forEach(c => console.log(`${c.Field} (${c.Type})`));
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

checkSchema();
