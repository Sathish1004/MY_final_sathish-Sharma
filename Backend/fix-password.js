
import db from './config/db.js';
import bcrypt from 'bcryptjs';

const email = '310623104041@eec.srmrmp.edu.in';
const newPassword = 'divya@10';

async function fixPassword() {
    try {
        console.log(`Checking user: ${email}`);
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log('User NOT FOUND in database.');
            process.exit(1);
        }

        const user = users[0];
        console.log(`Found user ID: ${user.id}`);
        console.log(`Stored Password: '${user.password}'`);

        const isMatch = await bcrypt.compare(newPassword, user.password);
        console.log(`Bcrypt compare result (current): ${isMatch}`);

        if (isMatch) {
            console.log('Password is ALREADY CORRECT and valid.');
        } else {
            console.log('Password mismatch or invalid hash. Updating...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            console.log(`Password UPDATED to hash: ${hashedPassword}`);

            // Verify
            const isMatchNew = await bcrypt.compare(newPassword, hashedPassword);
            console.log(`Bcrypt compare result (new): ${isMatchNew}`);
        }
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixPassword();
