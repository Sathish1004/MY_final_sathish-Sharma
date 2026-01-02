
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

        const [rows] = await connection.execute(`
            SELECT q.title, tc.input, tc.expected_output, tc.is_hidden 
            FROM test_cases tc
            JOIN questions q ON q.id = tc.question_id
            WHERE q.title LIKE '%Median%'
            LIMIT 20
        `);

        console.log("Test Cases for Median Problem:");
        rows.forEach((row, i) => {
            console.log(`\n-- - Case ${i + 1} (${row.is_hidden ? 'Hidden' : 'Sample'})--- `);
            console.log(`Input: "${row.input}"`);
            console.log(`Expected: "${row.expected_output}"`);
        });

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
