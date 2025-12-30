const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS feature_flags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            feature_name VARCHAR(255) UNIQUE NOT NULL,
            is_enabled BOOLEAN DEFAULT FALSE,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating feature_flags table:', err);
            db.end();
            return;
        }
        console.log('feature_flags table created or already exists');

        const insertDefaultQuery = `
            INSERT INTO feature_flags (feature_name, is_enabled) 
            VALUES ('mentorship', FALSE) 
            ON DUPLICATE KEY UPDATE is_enabled = is_enabled
        `;

        db.query(insertDefaultQuery, (err, result) => {
            if (err) {
                console.error('Error inserting default feature flag:', err);
            } else {
                console.log('Default mentorship feature flag inserted/verified');
            }
            db.end();
        });
    });
});
