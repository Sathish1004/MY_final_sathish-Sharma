
import db from './config/db.js';

async function refreshMentorship() {
    try {
        console.log('Refreshing Mentorship Schema...');

        // 1. Drop old mentor_bookings if exists
        await db.query('DROP TABLE IF EXISTS mentor_bookings');
        console.log('Dropped old mentor_bookings table');

        // 2. Drop mentors table if exists
        await db.query('DROP TABLE IF EXISTS mentors');
        console.log('Dropped old mentors table');

        // 3. Create mentors table
        await db.query(`
            CREATE TABLE mentors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                company VARCHAR(255),
                avatar VARCHAR(500),
                skills JSON,
                bio TEXT,
                detailed_bio TEXT,
                availability JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created mentors table');

        // 4. Create mentor_bookings table
        await db.query(`
            CREATE TABLE mentor_bookings (
                booking_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                user_name VARCHAR(255),
                user_email VARCHAR(255),
                mentor_id INT NOT NULL,
                time_slot VARCHAR(100) NOT NULL,
                topic TEXT,
                status ENUM('booked', 'completed', 'cancelled') DEFAULT 'booked',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (mentor_id) REFERENCES mentors(id)
            )
        `);
        console.log('Created mentor_bookings table');

        // 5. Seed mentors
        const mentors = [
            {
                name: 'Dr. Priya Sharma',
                role: 'Senior Software Engineer',
                company: 'Google',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                skills: JSON.stringify(['Frontend', 'React', 'System Design']),
                bio: 'Passionate about helping students break into tech.',
                detailed_bio: 'With over 12 years of experience in frontend engineering, I have led teams at Google and Uber. I am deeply passionate about building performant, accessible web applications and helping the next generation of developers master React and modern system design principles. My mentorship style is hands-on and focused on real-world engineering challenges.',
                availability: JSON.stringify(['Mon 10:00 AM', 'Wed 02:00 PM', 'Fri 04:00 PM'])
            },
            {
                name: 'Rajesh Kumar',
                role: 'Tech Lead',
                company: 'Microsoft',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                skills: JSON.stringify(['Backend', 'Cloud', 'Microservices']),
                bio: 'Helping developers master backend & cloud.',
                detailed_bio: 'Currently a Tech Lead at Microsoft, I specialize in building scalable microservices and cloud-native architectures using Azure and AWS. I have extensive experience in distributed systems, database optimization, and CI/CD pipelines. I can help you understand the end-to-end lifecycle of a backend application and how to design for high availability.',
                availability: JSON.stringify(['Tue 11:00 AM', 'Thu 03:00 PM', 'Sat 10:00 AM'])
            },
            {
                name: 'Sneha Patel',
                role: 'Data Scientist',
                company: 'Amazon',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                skills: JSON.stringify(['ML', 'Data Science', 'Python']),
                bio: 'Teaching ML and data science to beginners.',
                detailed_bio: 'As a Data Scientist at Amazon, I work on large-scale personalization models and recommendation systems. My background is in statistical modeling and machine learning. I enjoy simplifying complex mathematical concepts for beginners and helping students transition into data science careers through structured projects and rigorous practice.',
                availability: JSON.stringify(['Mon 03:00 PM', 'Wed 05:00 PM', 'Sat 02:00 PM'])
            }
        ];

        for (const mentor of mentors) {
            await db.query(
                'INSERT INTO mentors (name, role, company, avatar, skills, bio, detailed_bio, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [mentor.name, mentor.role, mentor.company, mentor.avatar, mentor.skills, mentor.bio, mentor.detailed_bio, mentor.availability]
            );
        }
        console.log('Seeded mentors table');

        console.log('Mentorship refresh complete.');
        process.exit(0);
    } catch (error) {
        console.error('Refresh failed:', error);
        process.exit(1);
    }
}

refreshMentorship();
