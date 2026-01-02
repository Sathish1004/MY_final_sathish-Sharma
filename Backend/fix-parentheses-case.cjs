
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

        console.log("Standardizing Valid Parentheses expected outputs to lowercase...");

        await connection.execute(`
            UPDATE test_cases 
            SET expected_output = LOWER(expected_output)
            WHERE question_id = 3
        `);

        console.log("Update complete.");

        // Check "Bad Format" count again for ID 3
        const [rows] = await connection.execute(`
            SELECT 
                SUM(CASE WHEN input LIKE '%=%' OR input LIKE '%[%' THEN 1 ELSE 0 END) as bad_format_count
            FROM test_cases
            WHERE question_id = 3
        `);
        console.log("Remaining bad formats for ID 3:", rows[0].bad_format_count);

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
