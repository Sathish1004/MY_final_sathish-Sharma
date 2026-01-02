
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

const addColumn = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const [rows] = await connection.execute(`
            SELECT COUNT(*) AS count 
            FROM information_schema.columns 
            WHERE table_schema = ? 
            AND table_name = 'questions' 
            AND column_name = 'constraints'
        `, [dbConfig.database]);

        if (rows[0].count === 0) {
            console.log("Adding 'constraints' column...");
            await connection.execute('ALTER TABLE questions ADD COLUMN constraints JSON');
            console.log("Column added successfully.");
        } else {
            console.log("'constraints' column already exists.");
        }

    } catch (e) {
        console.error("Error adding column:", e);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

addColumn();
