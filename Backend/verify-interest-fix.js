
import db from './config/db.js';

async function verify() {
    try {
        console.log('Checking latest interest record...');
        const [rows] = await db.query('SELECT * FROM project_interests ORDER BY id DESC LIMIT 1');
        if (rows.length > 0) {
            console.log('Latest Interest Record:', JSON.stringify(rows[0], null, 2));
            if (rows[0].user_email) {
                console.log('SUCCESS: user_email is present.');
            } else {
                console.log('FAILURE: user_email is missing.');
            }
        } else {
            console.log('No interest records found.');
        }
    } catch (error) {
        console.error('Verification failed:', error.message);
    }
    process.exit();
}

verify();
