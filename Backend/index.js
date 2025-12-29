import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes imports
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import shareRoutes from './routes/shareRoutes.js';


import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Share io instance with routes/controllers if needed (via app.set or middleware)
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', shareRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Test DB connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ message: 'Database connected successfully', result: rows });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(` My Server running on port ${PORT}`);
});