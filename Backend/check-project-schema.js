
import db from './config/db.js';

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE projects');
        console.log('projects columns:');
        rows.forEach(row => {
            console.log(`- ${row.Field}: ${row.Type}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

checkSchema();
