
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

        // We suspected "Add Two Numbers" (likely title contains that) or based on previous logs.
        // Let's search for questions with bracketed inputs in samples but maybe unbracketed in hidden?

        // Let's look at "Add Two Numbers" specifically if possible, or just dump a few pairs.
        const [rows] = await connection.execute(`
            SELECT q.title, tc.is_hidden, tc.input 
            FROM test_cases tc
            JOIN questions q ON q.id = tc.question_id
            WHERE q.title IN ('Add Two Numbers', 'Longest Substring Without Repeating Characters', 'Two Sum')
            ORDER BY q.title, tc.is_hidden, tc.id
        `);

        console.log("Comparing Inputs (Sample vs Hidden):");

        let currentTitle = "";
        rows.forEach(r => {
            if (r.title !== currentTitle) {
                console.log(`\n=== ${r.title} ===`);
                currentTitle = r.title;
            }
            const type = r.is_hidden ? "HIDDEN" : "SAMPLE";
            // Truncate long inputs
            const inp = r.input.length > 50 ? r.input.substring(0, 50) + "..." : r.input;
            console.log(`[${type}] ${inp}`);
        });

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
