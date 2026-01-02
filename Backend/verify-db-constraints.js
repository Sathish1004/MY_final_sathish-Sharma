
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'student_hub_db'
};

const verifyConstraints = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT title, constraints FROM questions LIMIT 5');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) await connection.end();
    }
};

verifyConstraints();
