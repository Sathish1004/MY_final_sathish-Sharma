
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
    try {
        // 1. Check DB
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM jobs');
        console.log(`DB Check: Found ${rows[0].count} jobs in the database.`);

        if (rows[0].count > 0) {
            const [sample] = await connection.execute('SELECT job_title, status FROM jobs LIMIT 1');
            console.log("Sample Job:", sample[0]);
        }

        await connection.end();

        // 2. Check API (Health)
        try {
            const res = await axios.get('http://localhost:5000/api/jobs');
            console.log(`API Check: /api/jobs returned ${res.data.length} jobs.`);
        } catch (apiErr) {
            console.error("API Check Failed: /api/jobs is not reachable or errored.");
            console.error("Error:", apiErr.message);
            if (apiErr.response) {
                console.error("Status:", apiErr.response.status);
            }
        }

    } catch (err) {
        console.error("DB Connection Failed:", err);
    }
})();
