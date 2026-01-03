import db from './config/db.js';

const createPlacementsTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS placements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                student_email VARCHAR(255) NOT NULL,
                course VARCHAR(255) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                job_role VARCHAR(255) NOT NULL,
                placement_type ENUM('Internship', 'Full-time') NOT NULL,
                location VARCHAR(255),
                package VARCHAR(255),
                placement_date DATE NOT NULL,
                status ENUM('Placed', 'Offer Received', 'Joined') DEFAULT 'Placed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Placements table created successfully");
        process.exit();
    } catch (error) {
        console.error("Error creating placements table:", error);
        process.exit(1);
    }
};

createPlacementsTable();
