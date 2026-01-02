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

const seedBadges = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const badges = [
            { name: "First Step", icon: "trophy", description: "Solved your first problem" },
            { name: "Streak Starter", icon: "zap", description: "3-Day Learning Streak" },
            { name: "Problem Hunter", icon: "target", description: "Solved 10 Problems" },
            { name: "Array Master", icon: "layout", description: "Complete the Arrays Kit" },
            { name: "String Wizard", icon: "code2", description: "Complete the Strings Kit" }
        ];

        for (const badge of badges) {
            // Check if exists
            const [rows] = await connection.execute('SELECT * FROM badges WHERE name = ?', [badge.name]);

            if (rows.length === 0) {
                console.log(`Inserting badge: ${badge.name}...`);
                await connection.execute(
                    'INSERT INTO badges (name, icon, description) VALUES (?, ?, ?)',
                    [badge.name, badge.icon, badge.description]
                );
            } else {
                console.log(`Badge exists: ${badge.name}`);
                // Optional: Update description?
                // await connection.execute('UPDATE badges SET description = ? WHERE name = ?', [badge.description, badge.name]);
            }
        }

        console.log("All badges ensured.");

    } catch (error) {
        console.error("Error seeding badges:", error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

seedBadges();
