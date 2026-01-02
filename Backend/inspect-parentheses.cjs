
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

        console.log("Inspecting Valid Parentheses (ID 3) Inputs:");

        const [rows] = await connection.execute(`
            SELECT id, input, expected_output, is_hidden 
            FROM test_cases 
            WHERE question_id = 3
        `);

        rows.forEach(row => {
            console.log(`ID: ${row.id} [${row.is_hidden ? 'Hidden' : 'Sample'}]`);
            console.log(`Input: "${row.input}"`);
            console.log(`Expected: "${row.expected_output}"`);
            console.log('---');
        });

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
