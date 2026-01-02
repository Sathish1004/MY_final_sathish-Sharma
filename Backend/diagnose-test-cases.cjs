
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

        console.log("Checking Test Case Coverage:");

        const [rows] = await connection.execute(`
            SELECT 
                q.id, 
                q.title, 
                COUNT(CASE WHEN tc.is_hidden = 0 THEN 1 END) as sample_count,
                COUNT(CASE WHEN tc.is_hidden = 1 THEN 1 END) as hidden_count,
                SUM(CASE WHEN tc.input LIKE '%=%' OR tc.input LIKE '%[%' THEN 1 ELSE 0 END) as bad_format_count
            FROM questions q
            LEFT JOIN test_cases tc ON q.id = tc.question_id
            GROUP BY q.id, q.title
            ORDER BY q.id ASC
        `);

        console.table(rows);

        const missingHidden = rows.filter(r => r.hidden_count === 0);
        if (missingHidden.length > 0) {
            console.log(`\nIssues Found: ${missingHidden.length} questions have NO hidden test cases.`);
        } else {
            console.log("\nAll questions have at least one hidden test case.");
        }

        const badFormat = rows.filter(r => r.bad_format_count > 0);
        if (badFormat.length > 0) {
            console.log(`\nIssues Found: ${badFormat.length} questions still have 'bad format' inputs (variables or JSON brackets).`);
        }

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
