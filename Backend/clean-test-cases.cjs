
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const cleanInput = (input) => {
    if (!input) return input;

    let cleaned = input;

    // 1. Remove leading variable assignment (e.g., "nums = ")
    // Matches "word = " at start of string
    cleaned = cleaned.replace(/^[a-zA-Z0-9_]+\s*=\s*/, '');

    // 2. Remove subsequent variable assignments starting with comma (e.g., ", target = ")
    // Replace with newline to separate inputs
    cleaned = cleaned.replace(/,\s*[a-zA-Z0-9_]+\s*=\s*/g, '\n');

    // 3. Optional: Remove trailing semicolon if present (some formats have it)
    cleaned = cleaned.replace(/;$/, '');

    return cleaned.trim();
};

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Fetch inputs that look like assignments
        const [rows] = await connection.execute(`
            SELECT id, input, expected_output, question_id
            FROM test_cases 
            WHERE input LIKE '%=%'
        `);

        console.log(`Found ${rows.length} test cases to clean.`);

        let updatedCount = 0;
        for (const row of rows) {
            const original = row.input;
            const cleaned = cleanInput(original);

            if (original !== cleaned) {
                console.log(`\n[ID: ${row.id}] Cleaning:`);
                console.log(`  Origin: "${original}"`);
                console.log(`  Clean:  "${cleaned}"`);

                await connection.execute(
                    'UPDATE test_cases SET input = ? WHERE id = ?',
                    [cleaned, row.id]
                );
                updatedCount++;
            }
        }

        console.log(`\nSuccessfully updated ${updatedCount} test cases.`);
        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
