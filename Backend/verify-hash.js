
import bcrypt from 'bcryptjs';

async function verify() {
    const password = 'divya@10';
    const hash = '$2b$10$4nIDXsHi.NJNngiDItTYqOEsGQdN6dhLYkfcg1KsHjjrX3RC88Q2u';
    const match = await bcrypt.compare(password, hash);
    console.log(`Password 'divya@10' matches hash? ${match}`);
}

verify();
