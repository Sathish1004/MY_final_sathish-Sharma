
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

        // 1. Find columns with "..." or "[...]"
        const [rows] = await connection.execute(`
            SELECT tc.id, tc.question_id, q.title, tc.input, tc.expected_output 
            FROM test_cases tc
            JOIN questions q ON q.id = tc.question_id
            WHERE tc.input LIKE '%...%' 
               OR tc.input LIKE '%[%' -- Check for leftover brackets too just in case
        `);

        if (rows.length === 0) {
            console.log("No corrupted inputs found.");
        } else {
            console.log(`Found ${rows.length} potentially corrupted inputs:`);
            rows.forEach(r => {
                console.log(`\n[ID: ${r.id}] Question: ${r.title}`);
                console.log(`Input: ${r.input}`);
                console.log(`Output: ${r.expected_output}`);
            });
        }

        // 2. Fix specific known bad content for "Word Search" (based on previous findings ID 29)
        // Correct Input for Word Search Example 1
        const correctBoard = `"A" "B" "C" "E" "S" "F" "C" "S" "A" "D" "E" "E"`;
        // 3x4 grid: A B C E / S F C S / A D E E
        // and word "ABCCED" matches

        // We will update ID 29 specifically if it matches
        // Actually, let's just Fix ALL Word Search inputs that are bad
        const [wsRows] = await connection.execute(`
            SELECT tc.id, tc.input 
            FROM test_cases tc
            JOIN questions q ON q.id = tc.question_id
            WHERE q.title = 'Word Search' AND (tc.input LIKE '%...%' OR tc.input LIKE '%[%')
        `);

        for (const row of wsRows) {
            // Check if it's the ABCCED case
            if (row.input.includes("ABCCED")) {
                const fixedInput = `${correctBoard}\n"ABCCED"`;
                console.log(`\nFixing Word Search ID ${row.id}...`);
                await connection.execute('UPDATE test_cases SET input = ? WHERE id = ?', [fixedInput, row.id]);
            }
        }

        // Also fix ID 25 "board = [...]" which had no word?
        // Let's verify what ID 25 belongs to (from previous logs it was distinct)

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
