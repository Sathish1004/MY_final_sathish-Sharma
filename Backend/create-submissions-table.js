
import db from './config/db.js';

async function createTable() {
    try {
        console.log('Creating project_submissions table...');
        const query = `
            CREATE TABLE IF NOT EXISTS project_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                project_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                github_repo VARCHAR(255) NOT NULL,
                live_link VARCHAR(255),
                description TEXT,
                status ENUM('Pending', 'In Review', 'Approved', 'Rejected') DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )
        `;
        await db.query(query);
        console.log('Table created successfully!');
    } catch (error) {
        console.error('Error creating table:', error.message);
    }
    process.exit();
}

createTable();
