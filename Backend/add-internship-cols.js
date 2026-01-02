
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Adding internship columns to projects table...');

        const [cols] = await db.query("SHOW COLUMNS FROM projects");
        const fields = cols.map(c => c.Field);

        if (!fields.includes('is_internship')) {
            await db.query("ALTER TABLE projects ADD COLUMN is_internship BOOLEAN DEFAULT FALSE");
            console.log('Added is_internship column');
        }

        if (!fields.includes('partner_name')) {
            await db.query("ALTER TABLE projects ADD COLUMN partner_name VARCHAR(255)");
            console.log('Added partner_name column');
        }

        if (!fields.includes('partner_logo')) {
            await db.query("ALTER TABLE projects ADD COLUMN partner_logo VARCHAR(255)");
            console.log('Added partner_logo column');
        }

        // Update specific projects to be internship opportunities (matching screenshot logic typically)
        // E-Commerce Platform -> Amazon
        await db.query(`
            UPDATE projects 
            SET is_internship = TRUE, partner_name = 'Amazon', partner_logo = 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg' 
            WHERE title = 'E-Commerce Platform'
        `);

        // AI Chatbot -> Google
        await db.query(`
            UPDATE projects 
            SET is_internship = TRUE, partner_name = 'Google', partner_logo = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' 
            WHERE title = 'AI Chatbot'
        `);

        // Task Management App -> Microsoft
        await db.query(`
            UPDATE projects 
            SET is_internship = TRUE, partner_name = 'Microsoft', partner_logo = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' 
            WHERE title = 'Task Management App'
        `);

        console.log('Migration and data update successful.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
