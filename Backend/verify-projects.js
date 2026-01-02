
import db from './config/db.js';

async function verify() {
    try {
        console.log('--- Verification Started ---');

        // 1. Initial State
        const [projects] = await db.query('SELECT * FROM projects');
        console.log(`Loaded ${projects.length} projects.`);

        const [initialStats] = await db.query(`
            SELECT 
                (SELECT COUNT(DISTINCT p.id) FROM projects p JOIN project_interests i ON p.id = i.project_id WHERE p.status = 'active' OR i.id IS NOT NULL) as activeProjects,
                (SELECT COUNT(DISTINCT user_id) FROM project_interests) as activeDevelopers
        `);
        console.log('Initial Stats:', initialStats[0]);

        // 2. Simulate User Interest
        // Find a project that is 'open'
        const [openProject] = await db.query('SELECT id, title FROM projects WHERE status = "open" LIMIT 1');
        if (openProject.length > 0) {
            const p = openProject[0];
            const testUserId = 31; // Using valid user ID 31

            console.log(`Simulating interest for User ${testUserId} in project "${p.title}" (ID: ${p.id})`);

            // Check if already interested
            const [existing] = await db.query('SELECT * FROM project_interests WHERE user_id = ? AND project_id = ?', [testUserId, p.id]);
            if (existing.length === 0) {
                await db.query('INSERT INTO project_interests (user_id, project_id, project_title) VALUES (?, ?, ?)', [testUserId, p.id, p.title]);
                await db.query('UPDATE projects SET status = "active" WHERE id = ?', [p.id]);
                console.log('Interest recorded and project status updated.');
            } else {
                console.log('User already interested.');
            }
        }

        // 3. Final State
        const [finalStats] = await db.query(`
            SELECT 
                (SELECT COUNT(DISTINCT p.id) FROM projects p JOIN project_interests i ON p.id = i.project_id WHERE p.status = 'active' OR i.id IS NOT NULL) as activeProjects,
                (SELECT COUNT(DISTINCT user_id) FROM project_interests) as activeDevelopers
        `);
        console.log('Final Stats:', finalStats[0]);

        console.log('--- Verification Completed ---');
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verify();
