
import db from './config/db.js';

async function checkUser() {
    const email = 'srid52863@gmail.com';
    try {
        console.log(`Checking admin table for ${email}...`);
        const [admins] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
        console.log('Admin Result:', JSON.stringify(admins, null, 2));

        console.log(`Checking users table for ${email}...`);
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log('User Result:', JSON.stringify(users, null, 2));

        if (users.length > 0) {
            const user = users[0];
            const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
            console.log('User password matches bcrypt hash pattern?', isBcrypt);
            if (!isBcrypt) {
                console.log('WARNING: User password is NOT hashed with bcrypt!');
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

checkUser();
