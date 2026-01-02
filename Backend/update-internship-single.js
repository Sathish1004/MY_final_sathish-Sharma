
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function limitInternships() {
    try {
        // First, set all to false
        await pool.query('UPDATE projects SET is_internship = 0');
        console.log('Cleared all internship flags.');

        // Then set ID 1 (E-Commerce Platform) to true
        // Or find a project with a specific title if ID 1 isn't right.
        // Based on previous logs, ID 1 is E-Commerce.
        const [result] = await pool.query('UPDATE projects SET is_internship = 1, partner_name = "Amazon", partner_logo = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" WHERE id = 1');

        if (result.affectedRows > 0) {
            console.log('Set Project ID 1 as the single internship opportunity.');
        } else {
            console.log('Could not find Project ID 1.');
            // Try fallback to any project
            await pool.query('UPDATE projects SET is_internship = 1, partner_name = "Amazon" WHERE id = (SELECT id FROM (SELECT id FROM projects LIMIT 1) as t)');
            console.log('Set first available project as internship.');
        }

    } catch (error) {
        console.error('Error updating internships:', error);
    } finally {
        await pool.end();
    }
}

limitInternships();
