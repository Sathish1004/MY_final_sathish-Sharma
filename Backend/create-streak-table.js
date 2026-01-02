import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createStreakTable = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const query = `
            CREATE TABLE IF NOT EXISTS learning_streak (
                user_id INT PRIMARY KEY,
                current_streak INT DEFAULT 0,
                last_active_date DATE,
                max_streak INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await connection.query(query);
        console.log('learning_streak table created successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error creating learning_streak table:', error);
    }
};

createStreakTable();
