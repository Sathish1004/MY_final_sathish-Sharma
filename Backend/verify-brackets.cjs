
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

        console.log("Checking for Wrapped Arrays in Valid Parentheses:");

        // Check if input STARTS with [ indicating a JSON array wrapper like ["()"]
        // real input should start with (, ), {, }, [ (open char) but not be a JSON array of strings
        const [rows] = await connection.execute(`
            SELECT id, input 
            FROM test_cases 
            WHERE question_id = 3 AND input LIKE '[%' AND input NOT LIKE '()%' AND input NOT LIKE '(%'
        `);

        if (rows.length > 0) {
            console.log("Found potentially wrapped inputs:");
            console.table(rows);
        } else {
            console.log("No wrapped array inputs found. The '[' characters are likely valid input content.");
        }

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
