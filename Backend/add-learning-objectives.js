
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Adding learning_objectives column to projects table...');

        // Check if column exists
        const [columns] = await db.query('SHOW COLUMNS FROM projects LIKE "learning_objectives"');
        if (columns.length === 0) {
            await db.query('ALTER TABLE projects ADD COLUMN learning_objectives JSON AFTER tech_stack');
            console.log('Column added.');
        } else {
            console.log('Column already exists.');
        }

        const defaultObjectives = [
            "Understand the core concepts behind the project and how they work in real-world applications",
            "Improve problem-solving skills by implementing features step by step",
            "Learn how to structure and organize frontend code efficiently",
            "Gain hands-on experience with the technologies used in this project",
            "Build confidence in developing and testing real-world applications"
        ];

        const projectSpecificObjectives = {
            'E-Commerce Platform': [
                "Understand how e-commerce payment flows work",
                "Learn state management with Redux in a complex app",
                "Build secure user authentication systems",
                "Integrate third-party payment gateways like Stripe",
                "Design scalable database schemas for orders and products"
            ],
            'AI Chatbot': [
                "Learn the basics of Natural Language Processing",
                "Understand how to integrate AI models into web apps",
                "Manage conversation context and state",
                "Work with intent recognition and classification",
                "Build modern conversational user interfaces"
            ],
            'Task Management App': [
                "Understand how task-based applications work",
                "Learn component-based UI design using React",
                "Manage application state efficiently",
                "Build clean and responsive layouts",
                "Practice implementing real-world UI logic"
            ],
            'Weather Dashboard': [
                "Learn how to fetch and process real-time API data",
                "Understand data visualization using D3.js or Chart.js",
                "Implement geolocation and maps in web apps",
                "Build dynamic and responsive dashboards",
                "Practice working with asynchronous data flows"
            ]
        };

        // Update existing projects
        const [projects] = await db.query('SELECT title FROM projects');
        for (const project of projects) {
            const objectives = projectSpecificObjectives[project.title] || defaultObjectives;
            await db.query('UPDATE projects SET learning_objectives = ? WHERE title = ?', [JSON.stringify(objectives), project.title]);
            console.log(`Updated objectives for ${project.title}`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
