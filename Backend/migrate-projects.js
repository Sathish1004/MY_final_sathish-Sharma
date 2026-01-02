
import db from './config/db.js';

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Drop and Create Projects Table with full schema
        await db.query("DROP TABLE IF EXISTS project_interests");
        await db.query("DROP TABLE IF EXISTS projects");

        await db.query(`
            CREATE TABLE projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                detailed_description TEXT,
                tech_stack JSON,
                requirements JSON,
                tasks JSON,
                team_members JSON,
                status ENUM('open', 'active', 'closed') DEFAULT 'open',
                difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
                duration VARCHAR(100),
                submission_link VARCHAR(255),
                invite_link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Projects table created.');

        // 2. Re-create project_interests table
        await db.query(`
            CREATE TABLE project_interests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_name VARCHAR(255),
                project_id INT NOT NULL,
                project_title VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_interest (user_id, project_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        `);
        console.log('Project interests table created.');

        // 3. Seed initial projects with all fields (all JSON keys also in snake_case internally where possible)
        const initialProjects = [
            {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
                detailed_description: 'Build a complete e-commerce solution from scratch. The platform should include user authentication, product catalog, shopping cart, payment gateway integration (Stripe), admin dashboard, and order management system. Focus on creating a responsive design and implementing secure payment processing.',
                tech_stack: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'Redux', 'JWT']),
                requirements: JSON.stringify([
                    'Must have user authentication',
                    'Responsive design for mobile',
                    'Payment gateway integration',
                    'Admin dashboard',
                    'Product reviews and ratings'
                ]),
                tasks: JSON.stringify([
                    { id: 1, title: 'User Authentication System', description: 'Implement JWT-based authentication with email verification', completed: true },
                    { id: 2, title: 'Product Catalog', description: 'Create product listing with filters and search', completed: true },
                    { id: 3, title: 'Shopping Cart', description: 'Implement cart functionality with local storage', completed: false },
                    { id: 4, title: 'Payment Integration', description: 'Integrate Stripe for payment processing', completed: false },
                    { id: 5, title: 'Admin Dashboard', description: 'Build dashboard for order and product management', completed: false },
                ]),
                team_members: JSON.stringify([
                    { id: 1, name: 'Alex Johnson', role: 'Frontend Lead', avatar: '👨‍💻' },
                    { id: 2, name: 'Sarah Miller', role: 'Backend Lead', avatar: '👩‍💻' },
                    { id: 3, name: 'David Chen', role: 'UI/UX Designer', avatar: '🎨' },
                ]),
                status: 'active',
                difficulty: 'Intermediate',
                duration: '2-3 weeks',
                submission_link: 'https://forms.google.com/project1',
                invite_link: 'https://collab.invite/project1'
            },
            {
                title: 'AI Chatbot',
                description: 'Build an intelligent chatbot using natural language processing and machine learning.',
                detailed_description: 'Develop a conversational AI chatbot using modern NLP techniques. The chatbot should understand user intent, maintain conversation context, and provide intelligent responses. Implement both rule-based and ML-based approaches for better accuracy.',
                tech_stack: JSON.stringify(['Python', 'TensorFlow', 'Flask', 'NLP', 'NLTK', 'DialogFlow']),
                requirements: JSON.stringify([
                    'Intent recognition',
                    'Context preservation',
                    'Multi-language support',
                    'Error handling',
                    'API documentation'
                ]),
                tasks: JSON.stringify([
                    { id: 1, title: 'Dataset Collection', description: 'Collect and clean training data', completed: true },
                    { id: 2, title: 'Model Training', description: 'Train NLP model with TensorFlow', completed: false },
                    { id: 3, title: 'API Development', description: 'Create Flask API for chatbot', completed: false },
                    { id: 4, title: 'UI Interface', description: 'Build web interface for chatbot', completed: false },
                ]),
                team_members: JSON.stringify([
                    { id: 1, name: 'Priya Sharma', role: 'ML Engineer', avatar: '🤖' },
                    { id: 2, name: 'Mike Brown', role: 'Full Stack', avatar: '👨‍💻' },
                ]),
                status: 'active',
                difficulty: 'Advanced',
                duration: '3-4 weeks',
                submission_link: 'https://forms.google.com/project2',
                invite_link: 'https://collab.invite/project2'
            },
            {
                title: 'Task Management App',
                description: 'A collaborative task management application with real-time updates and team features.',
                detailed_description: 'Create a Trello-like task management application with real-time collaboration features. Include drag-and-drop functionality, team management, notifications, and progress tracking.',
                tech_stack: JSON.stringify(['React', 'Firebase', 'TypeScript', 'Socket.io', 'Tailwind']),
                requirements: JSON.stringify([
                    'Real-time collaboration',
                    'Drag and drop functionality',
                    'Team invitations',
                    'Progress charts',
                    'Mobile responsive'
                ]),
                tasks: JSON.stringify([
                    { id: 1, title: 'Task Board UI', description: 'Design drag-drop task board', completed: true },
                    { id: 2, title: 'Real-time Updates', description: 'Implement Socket.io for live updates', completed: false },
                    { id: 3, title: 'User Authentication', description: 'Add Firebase authentication', completed: false },
                ]),
                team_members: JSON.stringify([]),
                status: 'open',
                difficulty: 'Intermediate',
                duration: '2 weeks',
                submission_link: 'https://forms.google.com/project3',
                invite_link: 'https://collab.invite/project3'
            },
            {
                title: 'Weather Dashboard',
                description: 'Create a weather dashboard with data visualization and location-based forecasts.',
                detailed_description: 'Build a weather application that displays current weather, forecasts, and historical data with beautiful visualizations. Include map integration and location-based services.',
                tech_stack: JSON.stringify(['React', 'D3.js', 'Weather API', 'Leaflet', 'Chart.js']),
                requirements: JSON.stringify([
                    'Real-time weather data',
                    'Interactive charts',
                    'Location detection',
                    'Multiple city support',
                    'Dark/light theme'
                ]),
                tasks: JSON.stringify([
                    { id: 1, title: 'API Integration', description: 'Connect to weather API', completed: true },
                    { id: 2, title: 'Data Visualization', description: 'Create charts with D3.js', completed: false },
                    { id: 3, title: 'Map Integration', description: 'Add interactive map', completed: false },
                ]),
                team_members: JSON.stringify([
                    { id: 1, name: 'Emma Wilson', role: 'Frontend Dev', avatar: '👩‍💻' },
                ]),
                status: 'active',
                difficulty: 'Beginner',
                duration: '1 week',
                submission_link: 'https://forms.google.com/project4',
                invite_link: 'https://collab.invite/project4'
            }
        ];

        for (const project of initialProjects) {
            await db.query(`
                INSERT INTO projects (title, description, detailed_description, tech_stack, requirements, tasks, team_members, status, difficulty, duration, submission_link, invite_link)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [project.title, project.description, project.detailed_description, project.tech_stack, project.requirements, project.tasks, project.team_members, project.status, project.difficulty, project.duration, project.submission_link, project.invite_link]);
        }
        console.log('Seeded initial projects.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
