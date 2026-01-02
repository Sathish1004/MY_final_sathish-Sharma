
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'divyasri@6655',
    database: 'student_hub_db'
};

const email = '310623104041@eec.srmrmp.edu.in';
const newPassword = 'divya@10';

async function fixPassword() {
    console.log('Connecting to DB...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        console.log(`Checking user: ${email}`);
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

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

            await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            console.log(`Password UPDATED to hash: ${hashedPassword}`);
        }
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
}

fixPassword();
