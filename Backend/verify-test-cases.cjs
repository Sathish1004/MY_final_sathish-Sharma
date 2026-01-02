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

        // 1. Get all questions
        const [questions] = await connection.execute('SELECT id, title FROM questions');
        console.log(`Total Questions Found: ${questions.length}\n`);

        // 2. Get test cases count per question
        const [rows] = await connection.execute(`
            SELECT 
                question_id, 
                SUM(CASE WHEN is_hidden = 0 THEN 1 ELSE 0 END) as sample_count,
                SUM(CASE WHEN is_hidden = 1 THEN 1 ELSE 0 END) as hidden_count,
                COUNT(*) as total_count
            FROM test_cases
            GROUP BY question_id
        `);

        // Map counts to questions
        const questionsWithCounts = questions.map(q => {
            const stats = rows.find(r => r.question_id === q.id) || { sample_count: 0, hidden_count: 0, total_count: 0 };
            return {
                id: q.id,
                title: q.title,
                ...stats,
                is_valid: stats.sample_count > 0 && stats.hidden_count > 0
            };
        });

        console.table(questionsWithCounts.map(q => ({
            ID: q.id,
            Title: q.title,
            Sample: q.sample_count,
            Hidden: q.hidden_count,
            Status: q.is_valid ? 'OK' : 'MISSING CASES'
        })));

        const missing = questionsWithCounts.filter(q => !q.is_valid);
        if (missing.length > 0) {
            console.log(`\n❌ Issues found with ${missing.length} questions.`);
        } else {
            console.log("\n✅ All questions have at least 1 sample and 1 hidden test case.");
        }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
