
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

        console.log("Adding clicks column to jobs table...");

        try {
            await connection.execute(`
                ALTER TABLE jobs
                ADD COLUMN clicks INT DEFAULT 0
            `);
            console.log("Column 'clicks' added successfully.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Column 'clicks' already exists.");
            } else {
                throw err;
            }
        }

        await connection.end();

    } catch (err) {
        console.error(err);
    }
})();
