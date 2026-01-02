
import db from './config/db.js';

async function listTables() {
    try {
        const [rows] = await db.query('SHOW TABLES');
        const dbName = Object.keys(rows[0])[0];
        console.log(`Tables in ${dbName}:`);
        rows.forEach(row => {
            console.log(`- ${row[dbName]}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

listTables();
