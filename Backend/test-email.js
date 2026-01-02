
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for .env loading in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Email Configuration...');
console.log('User:', process.env.SMTP_USER);
console.log('Pass:', process.env.SMTP_PASS ? '********' : 'Not Set');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
    tls: {
        rejectUnauthorized: false
    }
});

async function sendTestEmail() {
    try {
        console.log('Attempting to check connection...');
        await transporter.verify();
        console.log('SMTP Connection verified successfully!');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.APP_EMAIL_FROM,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Email from Debugger',
            text: 'If you receive this, your email configuration is working.',
        });
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('FAILED to send email:');
        console.error(error);
    }
}

sendTestEmail();
