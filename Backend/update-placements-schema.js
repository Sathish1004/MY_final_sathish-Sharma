import db from './config/db.js';

const alterTable = async () => {
    try {
        const queries = [
            "ALTER TABLE placements ADD COLUMN placement_story LONGTEXT",
            "ALTER TABLE placements ADD COLUMN interview_experience LONGTEXT",
            "ALTER TABLE placements ADD COLUMN technical_questions LONGTEXT",
            "ALTER TABLE placements ADD COLUMN image_url VARCHAR(255)",
            "ALTER TABLE placements ADD COLUMN Video_url VARCHAR(255)",
            "ALTER TABLE placements ADD COLUMN thumbnail_url VARCHAR(255)"
        ];

        for (const query of queries) {
            try {
                await db.query(query);
                console.log(`Executed: ${query}`);
            } catch (err) {
                // Ignore if column exists
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${query}`);
                } else {
                    console.error(`Error executing ${query}:`, err.message);
                }
            }
        }

        console.log("Placements table updated successfully.");
        process.exit();
    } catch (error) {
        console.error("Error updating table:", error);
        process.exit(1);
    }
};

alterTable();
