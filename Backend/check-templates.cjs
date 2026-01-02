
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.execute(`
            SELECT id, title, template_code 
            FROM questions 
            WHERE title IN ('Two Sum', '3Sum')
        `);

        rows.forEach(r => {
            console.log(`\n=== Problem: ${r.title} (ID: ${r.id}) ===`);
            let tmpl = r.template_code;
            if (typeof tmpl === 'string') {
                try {
                    tmpl = JSON.parse(tmpl);
                } catch (e) { console.log("(Template is raw string)"); }
            }
            console.log(JSON.stringify(tmpl, null, 2));
        });

        await connection.end();
    } catch (err) {
        console.error(err);
    }
})();
