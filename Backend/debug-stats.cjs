const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const user_id = 1; // Assuming test user ID 1

        // 1. Get Total Questions per Difficulty
        console.log("Fetching totals...");
        const [totalRows] = await connection.execute(
            'SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty'
        );
        console.log("Total Rows:", totalRows);

        // 2. Get Solved Questions per Difficulty
        console.log("Fetching solved...");
        const [solvedRows] = await connection.execute(
            `SELECT q.difficulty, COUNT(DISTINCT s.question_id) as count 
             FROM submissions s
             JOIN questions q ON s.question_id = q.id
             WHERE s.user_id = ? AND s.status = 'Accepted'
             GROUP BY q.difficulty`,
            [user_id]
        );
        console.log("Solved Rows:", solvedRows);

        // Process Totals
        const totalStats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
        totalRows.forEach(row => {
            const key = row.difficulty.trim();
            if (totalStats[key] !== undefined) {
                totalStats[key] = row.count;
            } else {
                console.log(`Warning: Unknown difficulty key '${key}'`);
            }
            totalStats.Total += row.count;
        });
        console.log("Processed Total Stats:", totalStats);

        const response = {
            difficulty: {
                easy: { total: totalStats.Easy },
                medium: { total: totalStats.Medium },
                hard: { total: totalStats.Hard }
            }
        };

        console.log("Final Response Partial:", JSON.stringify(response, null, 2));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
