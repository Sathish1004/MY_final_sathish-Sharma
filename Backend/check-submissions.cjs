
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Checking Recent Submissions:");

        const [rows] = await connection.execute(`
            SELECT id, user_id, question_id, status, created_at, execution_time 
            FROM submissions 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        console.table(rows);

        // Also check the specific query used for the calendar
        console.log("\nSimulating Calendar Query (Last 90 days):");
        const [history] = await connection.execute(`
             SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count 
             FROM submissions 
             WHERE status = 'Accepted' 
             GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
             ORDER BY date DESC
             LIMIT 5
        `);
        console.table(history);

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
