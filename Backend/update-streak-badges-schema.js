import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for dotenv path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'student_hub_db',
    multipleStatements: true
};

const updateSchema = async () => {
    let connection;
    try {
        console.log('Connecting to database:', dbConfig.database);
        connection = await mysql.createConnection(dbConfig);

        // 1. Add streak columns to users table
        console.log('Checking users table for streak columns...');
        const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'streak_count'");

        if (columns.length === 0) {
            console.log('Adding streak_count and last_activity_date to users...');
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN streak_count INT DEFAULT 0,
                ADD COLUMN last_activity_date TIMESTAMP NULL DEFAULT NULL
            `);
            console.log('SUCCESS: Users table updated.');
        } else {
            console.log('INFO: Users table already has streak columns.');
        }

        // 2. Create Badges Table
        console.log('Creating badges table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS badges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                icon VARCHAR(255),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Create User_Badges Table
        console.log('Creating user_badges table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_badges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                badge_id INT NOT NULL,
                awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_badge (user_id, badge_id)
            )
        `);

        console.log('SUCCESS: Badges tables created.');

        // 4. Seed some initial badges if empty
        const [badges] = await connection.query('SELECT count(*) as count FROM badges');
        if (badges[0].count === 0) {
            console.log('Seeding default badges...');
            await connection.query(`
                INSERT INTO badges (name, icon, description) VALUES
                ('Problem Solver', 'trophy', 'Solved your first problem'),
                ('Algo Master', 'brain', 'Solved 10 problems'),
                ('Streak Starter', 'zap', 'Maintained a 3-day streak')
             `);
            console.log('SUCCESS: Badges seeded.');
        }

    } catch (error) {
        console.error('ERROR:', error.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

updateSchema();
