
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prolync_platform_db',
};

async function migrateUsersTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // Check if profile_picture column exists
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_picture'
        `, [dbConfig.database]);

        if (columns.length === 0) {
            console.log('Adding profile_picture column...');
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL;
            `);
            console.log('profile_picture column added.');
        } else {
            console.log('profile_picture column already exists.');
        }

        // Check if resume_path column exists (mentioned in query too)
        const [resumeCols] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'resume_path'
        `, [dbConfig.database]);

        if (resumeCols.length === 0) {
            console.log('Adding resume_path column...');
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN resume_path VARCHAR(255) DEFAULT NULL;
            `);
            console.log('resume_path column added.');
        } else {
            console.log('resume_path column already exists.');
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrateUsersTable();
