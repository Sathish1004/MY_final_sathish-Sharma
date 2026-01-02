
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

        console.log("Creating job_applications table...");

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS job_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                job_id INT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
                UNIQUE KEY unique_application (user_id, job_id)
            )
        `);

        console.log("Table created successfully.");
        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
