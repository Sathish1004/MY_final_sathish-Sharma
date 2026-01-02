
import axios from 'axios';

async function testFix() {
    const url = 'http://localhost:5000/api/auth/login'; // Assuming default port
    const payload = {
        email: 'srid52863@gmail.com',
        password: 'divya@10'
    };

    console.log(`Testing login for ${payload.email} with student password...`);
    try {
        const response = await axios.post(url, payload);
        console.log('Login successful!');
        console.log('User Data:', response.data.user);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

testFix();
