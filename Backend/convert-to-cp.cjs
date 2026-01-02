
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const toCPFormat = (input) => {
    if (!input) return input;
    let s = input.trim();

    // 1. Unquote strings: "abc" -> abc
    if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
        // Only unquote if it looks like a single string
        // Be careful of "a" "b"
        // Regex to check if it is exactly one quoted string
        if (/^"[^"]*"$/.test(s)) {
            s = s.slice(1, -1);
        }
    }

    // 2. Unbracket arrays: [1,2,3] -> 1 2 3
    // Handle multiple lines:
    // [1,2,3]
    // [4,5,6] 
    // -> 
    // 1 2 3
    // 4 5 6

    // Split by newline
    let lines = s.split('\n');
    let convertedLines = lines.map(line => {
        line = line.trim();
        // Check if array [ ... ]
        if (line.startsWith('[') && line.endsWith(']')) {
            // Remove brackets
            let content = line.slice(1, -1);
            // Replace commas with spaces
            // Handle nested? [[1,2],[3,4]] 
            // content: [1,2],[3,4]
            // We can replace all ',' with ' ' and all '[' / ']' with '' in nested?
            // "1 2  3 4"
            // This flattens the input. Standard CP often flattens.
            // Let's replace delimiters with space
            return content.replace(/,/g, ' ').replace(/[\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
        }
        return line;
    });

    return convertedLines.join('\n');
};

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.execute('SELECT id, input FROM test_cases');

        let count = 0;
        for (const row of rows) {
            const original = row.input;
            const converted = toCPFormat(original);

            if (original !== converted) {
                console.log(`[ID ${row.id}] Converting:\n  From: ${original}\n  To:   ${converted}\n`);
                await connection.execute('UPDATE test_cases SET input = ? WHERE id = ?', [converted, row.id]);
                count++;
            }
        }

        console.log(`Converted ${count} test cases to CP format.`);
        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
