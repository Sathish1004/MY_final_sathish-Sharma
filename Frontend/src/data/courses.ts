
export interface Course {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    instructor: string;
    duration: string;
    difficulty: string;
    totalVideos: number;
    progress: number;
    description?: string; // Added description field
    status?: string;
    isEnrolled?: boolean;
    learn?: string[];
    requirements?: string[];
    total_modules?: number; // Backend provided
    total_duration?: number; // Backend provided (seconds)
}

export const COURSES_DATA: Course[] = [
    // --- FRONTEND (10 Courses) ---
    {
        id: 1,
        title: 'React.js Complete Guide',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
        instructor: 'John Smith',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Build modern, reactive web apps with React', 'Master Hooks and Functional Components', 'State Management with Context API & Redux', 'Routing with React Router', 'Deploying React Apps to Production'],
        requirements: ['Basic HTML, CSS, and JavaScript knowledge', 'A computer with internet access', 'No prior React experience needed']
    },
    {
        id: 2,
        title: 'Advanced CSS & Sass',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop',
        instructor: 'Emily blunt',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Master Flexbox and Grid', 'Responsive Design principles', 'SASS/SCSS pre-processing', 'CSS Animations and Transitions', 'Modern CSS architecture (BEM)'],
        requirements: ['Basic understanding of HTML tags', 'Interest in UI/UX design', 'Code editor installed (VS Code recommended)']
    },
    {
        id: 3,
        title: 'Modern JavaScript Bootcamp',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
        instructor: 'Michael Brown',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['ES6+ features deeply explained', 'Async JavaScript (Promises, Async/Await)', 'DOM Manipulation and Events', 'Object-Oriented Programming (OOP) in JS', 'Modules and Tooling (Webpack, Babel)'],
        requirements: ['No prior coding experience required', 'Logical thinking', 'A modern web browser (Chrome/Firefox)']
    },
    {
        id: 4,
        title: 'Vue.js 3: The Complete Guide',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=400&h=225&fit=crop',
        instructor: 'Sarah Wilson',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Build powerful Vue.js applications', 'Vue Router and Vuex (Pinia)', 'Options API vs Composition API', 'Forms and Validation', 'Authentication with Firebase'],
        requirements: ['Basic JavaScript knowledge', 'Understanding of HTML/CSS', 'Desire to build Single Page Applications']
    },
    {
        id: 5,
        title: 'Angular - The Complete Guide',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=400&h=225&fit=crop',
        instructor: 'David Miller',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Master TypeScript for Angular', 'Components, Directives, and Pipes', 'Dependency Injection & Services', 'Angular Forms (Template-driven & Reactive)', 'RxJS and Observables'],
        requirements: ['Basic JS knowledge', 'Understanding of OOP concepts helps', 'Node.js installed locally']
    },
    {
        id: 6,
        title: 'Tailwind CSS From Scratch',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=225&fit=crop',
        instructor: 'Chris Evans',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Utility-first CSS methodology', 'Responsive layouts with Tailwind', 'Customizing Tailwind configuration', 'Dark mode implementation', 'Optimizing for production'],
        requirements: ['Basic HTML and CSS knowledge', 'Familiarity with command line', 'Text editor']
    },
    {
        id: 7,
        title: 'Next.js & React - The Complete Guide',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1653387137517-fbc54d488fa8?w=400&h=225&fit=crop',
        instructor: 'Maximilian S.',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Server-Side Rendering (SSR) & Static Generation (SSG)', 'File-based Routing', 'API Routes in Next.js', 'Image Optimization', 'Fullstack App Deployment (Vercel)'],
        requirements: ['Solid React.js knowledge', 'Basic modern JavaScript', 'Understanding of APIs']
    },
    {
        id: 8,
        title: 'Web Design for Developers',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=225&fit=crop',
        instructor: 'Jonas S.',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Color Theory and Typography', 'Layout composition and spacing', 'Designing for User Experience (UX)', 'Creating wireframes and mockups', 'Visual hierarchy'],
        requirements: ['No design background needed', 'Interest in making things look good', 'Pen and paper for sketching']
    },
    {
        id: 9,
        title: 'TypeScript for Beginners',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1629904853716-600abd17529c?w=400&h=225&fit=crop',
        instructor: 'Stephen Grider',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Strict typing with TypeScript', 'Interfaces, Types, and Enums', 'Generics and Utility Types', 'Configuring the TS Compiler', 'Integrating TS with JS libraries'],
        requirements: ['Basic understanding of JavaScript', 'Code editor (VS Code recommended)', 'Node.js installed']
    },
    {
        id: 10,
        title: 'Frontend Interview Preparation',
        category: 'Frontend',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
        instructor: 'Akshay Saini',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Master common JS interview questions', 'DSA for Frontend (Arrays, Strings, Trees)', 'System Design for Frontend', 'Performance Optimization techniques', 'Behavioral Interview tips'],
        requirements: ['Intermediate Frontend knowledge', 'Experience building web apps', 'Resume ready for review']
    },

    // --- BACKEND (10 Courses) ---
    {
        id: 11,
        title: 'Node.js & Express Masterclass',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
        instructor: 'Sarah Johnson',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Build REST APIs with Node.js and Express', 'Understand Event Loop and Asynchronous JS', 'Authentication and Authorization (JWT)', 'Middleware and Error Handling', 'Integration with Databases (MongoDB/SQL)'],
        requirements: ['Basic JavaScript knowledge', 'Command line basics', 'Computer with Node.js installed']
    },
    {
        id: 12,
        title: 'Python Django - The Practical Guide',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
        instructor: 'Brad Traversy',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Fullstack development with Django', 'MVT Architecture', 'Django ORM and Database Management', 'User Authentication and Admin Panel', 'Building REST APIs with Django Rest Framework'],
        requirements: ['Python fundamentals', 'Basic HTML/CSS', 'Code editor installed']
    },
    {
        id: 13,
        title: 'Java Spring Boot Microservices',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
        instructor: 'Chad Darby',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Microservices Architecture patterns', 'Spring Boot fundamentals', 'Service Discovery and API Gateway', 'Containerization with Docker', 'Communication via REST and Messaging (Kafka)'],
        requirements: ['Strong Java knowledge', 'Basic Spring framework understanding', 'Maven/Gradle knowledge']
    },
    {
        id: 14,
        title: 'Go: The Complete Developer\'s Guide',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=400&h=225&fit=crop',
        instructor: 'Stephen Grider',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Master Go syntax and idioms', 'Concurrency with Goroutines and Channels', 'Building robust CLI tools', 'Web development with Go', 'Testing and Benchmarking'],
        requirements: ['Experience in any programming language', 'Willingness to learn a new paradigm', 'Terminal/Command Prompt']
    },
    {
        id: 15,
        title: 'SQL & Database Design A-Z',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
        instructor: 'Kirill Eremenko',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Database Normalization (1NF, 2NF, 3NF)', 'Complex SQL Queries and Joins', 'Indexing and Performance optimization', 'Transactions and ACID properties', 'ER Diagramming'],
        requirements: ['No prior database experience required', 'Basic computer skills', 'PostgreSQL or MySQL installed']
    },
    {
        id: 16,
        title: 'Docker & Kubernetes: The Practical Guide',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
        instructor: 'Maximilian S.',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Containerize applications with Docker', 'Manage multi-container apps with Docker Compose', 'Kubernetes Architecture and Objects', 'Deploying to Kubernetes Clusters', 'CI/CD Pipelines'],
        requirements: ['Basic development knowledge', 'Terminal/Command Line usage', 'Linux basics help but not required']
    },
    {
        id: 17,
        title: 'NestJS - A Progressive Node.js Framework',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1610986603166-f78428624e76?w=400&h=225&fit=crop',
        instructor: 'Kamil Mysliwiec',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Architecting scalable Node.js apps', 'Dependency Injection in Node', 'Modules, Controllers, and Providers', 'TypeORM integration', 'Unit and E2E Testing'],
        requirements: ['Solid Node.js and TypeScript knowledge', 'Understanding of backend concepts', 'VS Code']
    },
    {
        id: 18,
        title: 'Rust Programming for Beginners',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1535551951406-a19828b8e76b?w=400&h=225&fit=crop',
        instructor: 'Nathan Stocks',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Memory Safety without Garbage Collection', 'Ownership, Borrowing, and Lifetimes', 'Pattern Matching and Error Handling', 'Systems programming concepts', 'Cargo package manager'],
        requirements: ['Basic programming logic', 'C/C++ knowledge helps but not required', 'A curious mind']
    },
    {
        id: 19,
        title: 'GraphQL with Node.js',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=225&fit=crop',
        instructor: 'Andrew Mead',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['GraphQL Query Language', 'Designing Schemas and Types', 'Writing Resolvers effectively', 'Apollo Server and Client', 'Real-time updates with Subscriptions'],
        requirements: ['Node.js basics', 'Experience with REST APIs', 'JavaScript/ES6']
    },
    {
        id: 20,
        title: 'MongoDB - The Complete Developer\'s Guide',
        category: 'Backend',
        thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop',
        instructor: 'Maximilian S.',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['NoSQL Database concepts', 'CRUD Operations in MongoDB', 'Aggregation Framework', 'Indexing and Performance', 'Replication and Sharding'],
        requirements: ['Basic JavaScript helpful', 'JSON data format knowledge', 'Computer for installation']
    },

    // --- AI/ML (10 Courses) ---
    {
        id: 21,
        title: 'Machine Learning A-Z',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
        instructor: 'Kirill Eremenko',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Master Machine Learning Algorithms (Regression to Reinforcement)', 'Data Preprocessing and Cleaning', 'Model Evaluation and Validation', 'Scikit-learn and Python', 'Real-world case studies'],
        requirements: ['High school level mathematics', 'Basic Python knowledge', 'Environment setup (Anaconda/Jupyter)']
    },
    {
        id: 22,
        title: 'Deep Learning Specialization',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=225&fit=crop',
        instructor: 'Andrew Ng',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Neural Networks and Deep Learning', 'Hyperparameter tuning and Regularization', 'Convolutional Neural Networks (CNNs)', 'Sequence Models (RNN/LSTM)', 'Transformers and Attention Mechanisms'],
        requirements: ['Strong Python skills', 'Basic Machine Learning knowledge', 'Linear Algebra & Calculus basics']
    },
    {
        id: 23,
        title: 'Python for Data Science and ML Bootcamp',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        instructor: 'Jose Portilla',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Use Python for Data Science (NumPy, Pandas)', 'Data Visualization with Matplotlib & Seaborn', 'Statistical Analysis', 'Machine Learning with Scikit-Learn', 'Deploying ML models'],
        requirements: ['No prior programming experience needed', 'Computer with internet', 'Analytical mindset']
    },
    {
        id: 24,
        title: 'Artificial Intelligence Support',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        instructor: 'Hadelin de Ponteves',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Intro to AI concepts', 'AI ethics and societal impact', 'Building basic AI agents', 'Search algorithms', 'AI in business applications'],
        requirements: ['Basic computer literacy', 'Interest in Artificial Intelligence', 'No coding required']
    },
    {
        id: 25,
        title: 'Natural Language Processing with Python',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1655720031554-a929595ff968?w=400&h=225&fit=crop',
        instructor: 'Jose Portilla',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Text Preprocessing and Tokenization', 'Sentiment Analysis', 'Part-of-Speech Tagging', 'Topic Modeling', 'Deep Learning for NLP (BERT/GPT)'],
        requirements: ['Intermediate Python', 'Basic ML understanding', 'Experience with pandas/numpy']
    },
    {
        id: 26,
        title: 'TensorFlow Developer Certificate',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1617791160588-241658c0f566?w=400&h=225&fit=crop',
        instructor: 'Daniel Bourke',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Pass the TensorFlow Certification Exam', 'Computer Vision with TensorFlow', 'NLP with TensorFlow', 'Time Series Forecasting', 'Model deployment in browser/mobile'],
        requirements: ['Python proficiency', 'Basic ML theory', 'Google Colab usage']
    },
    {
        id: 27,
        title: 'Computer Vision with OpenCV',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
        instructor: 'Joseph Santarcangelo',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Image processing fundamentals', 'Face detection and recognition', 'Object tracking', 'Image segmentation', 'Deep Learning for Vision'],
        requirements: ['Python programming', 'High school math', 'Webcam for projects']
    },
    {
        id: 28,
        title: 'Data Analysis with Pandas',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        instructor: 'Boris P.',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['DataFrames and Series manipulation', 'Cleaning and Handling Missing Data', 'Grouping and Aggregating', 'Merging and Joining datasets', 'Time Series analysis'],
        requirements: ['Basic Python syntax', 'Excel knowledge is helpful', 'Jupyter Notebook installed']
    },
    {
        id: 29,
        title: 'Reinforcement Learning Guide',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=400&h=225&fit=crop',
        instructor: 'Phil Tabor',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Q-Learning and Deep Q-Networks (DQN)', 'Policy Gradients', 'Actor-Critic methods', 'OpenAI Gym environments', 'Building AI for games'],
        requirements: ['Strong Python', 'PyTorch or TensorFlow', 'Deep Learning basics']
    },
    {
        id: 30,
        title: 'Generative AI Fundamentals',
        category: 'AI/ML',
        thumbnail: 'https://images.unsplash.com/photo-1684369176170-4663e63564d7?w=400&h=225&fit=crop',
        instructor: 'Google Cloud',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Large Language Models (LLMs) explained', 'Generative Image Models', 'Prompt Engineering basics', 'Transformers architecture high-level', 'Ethics of GenAI'],
        requirements: ['General tech interest', 'No coding required', 'Google account']
    },

    // --- APTITUDE (10 Courses) ---
    {
        id: 31,
        title: 'Aptitude & Logical Reasoning',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
        instructor: 'Emily Davis',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Fundamental aptitude concepts', 'Logical reasoning shortcuts', 'Problem-solving speed improvement', 'Common exam patterns', 'Critical thinking skills'],
        requirements: ['Basic arithmetic', 'Pen and paper', 'Regular practice']
    },
    {
        id: 32,
        title: 'Quantitative Aptitude Mastery',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop',
        instructor: 'Robert Wilson',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Number Systems and HCF/LCM', 'Time, Speed, and Distance', 'Profit, Loss, and Discount', 'Permutation and Combination', 'Probability'],
        requirements: ['Strong multiplication table knowledge', 'High school math basics', 'Daily practice habit']
    },
    {
        id: 33,
        title: 'Verbal Ability & Reading Comprehension',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=225&fit=crop',
        instructor: 'Sarah Thompson',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Vocabulary building techniques', 'Grammar rules and correction', 'Reading speed and comprehension', 'Para-jumbles and sentence completion', 'Idioms and Phrases'],
        requirements: ['Basic English proficiency', 'Reading habit', 'Dictionary app']
    },
    {
        id: 34,
        title: 'Data Interpretation & Analysis',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        instructor: 'Arun Sharma',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Table and Chart analysis', 'Bar Graphs and Pie Charts', 'Line Graphs and Mixed Graphs', 'Caselets and Data Sufficiency', 'Calculation shortcuts'],
        requirements: ['Basic calculation speed', 'Attention to detail', 'Understanding of percentages/ratios']
    },
    {
        id: 35,
        title: 'Completing the Series & Analogies',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb1971d2?w=400&h=225&fit=crop',
        instructor: 'R.S. Aggarwal',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Number Series completion', 'Alphabet Series', 'Visual Analogies', 'Pattern recognition', 'Classification (Odd One Out)'],
        requirements: ['Observational skills', 'Logic basics', 'Practice mindset']
    },
    {
        id: 36,
        title: 'Interview Puzzles & Brain Teasers',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400&h=225&fit=crop',
        instructor: 'George Summers',
        duration: '2 Hours',
        difficulty: 'Intermediate',
        totalVideos: 8,
        progress: 0,
        learn: ['Common interview riddles', 'Lateral thinking puzzles', 'Mathematical brain teasers', 'Situational puzzles', 'Developing a structured thought process'],
        requirements: ['Curiosity', 'Patience', 'Flexible thinking']
    },
    {
        id: 37,
        title: 'Speed Math Techniques',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1632571401004-47b2c589b344?w=400&h=225&fit=crop',
        instructor: 'Vedic Math Academy',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Vedic Math Sutras', 'Mental addition and subtraction', 'Fast multiplication tricks', 'Square roots and Cube roots in seconds', 'Division shortcuts'],
        requirements: ['Knowledge of numbers 1-100', 'Willingness to unlearn traditional slow methods', 'Practice']
    },
    {
        id: 38,
        title: 'Critical Thinking & Deductive Logic',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1571442463969-234656832dbb?w=400&h=225&fit=crop',
        instructor: 'Dr. Edward de Bono',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Syllogisms and Venn Diagrams', 'Statement and Assumption', 'Course of Action', 'Cause and Effect', 'Blood Relations'],
        requirements: ['Open mind', 'Reading comprehension', 'Logical clarity']
    },
    {
        id: 39,
        title: 'Coding Interview Algorithms',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=225&fit=crop',
        instructor: 'Gayle Laakmann',
        duration: '2 Hours',
        difficulty: 'Advanced',
        totalVideos: 8,
        progress: 0,
        learn: ['Big O Notation', 'Sorting and Searching Algorithms', 'Recursion and Dynamic Programming', 'Graph traversal (BFS/DFS)', 'Greedy Algorithms'],
        requirements: ['Any programming language (Java/Python/C++)', 'Data Structures basics', 'Problem-solving attitude']
    },
    {
        id: 40,
        title: 'General Knowledge & Current Affairs',
        category: 'Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=225&fit=crop',
        instructor: 'Manorama Year Book',
        duration: '2 Hours',
        difficulty: 'Beginner',
        totalVideos: 8,
        progress: 0,
        learn: ['Current Global Events', 'History and Geography basics', 'Economic terms and updates', 'Science and Technology news', 'Sports and Awards'],
        requirements: ['Reading habit (Newspapers/Blogs)', 'General curiosity', 'Memory retention techniques']
    },
];
