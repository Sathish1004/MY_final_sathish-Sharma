
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

        const [tables] = await connection.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log("Current Tables:", tableNames);

        // specific check
        if (tableNames.includes('job_applications')) {
            console.log("\nTable 'job_applications' exists. Describing...");
            const [columns] = await connection.execute('DESCRIBE job_applications');
            console.table(columns);
        } else {
            console.log("\nTable 'job_applications' does NOT exist.");
        }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
