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
import studentRoutes from './routes/studentRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

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
app.use('/api/student', studentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/certificate', certificateRoutes);

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

// Track online users: Map<userId, socketId>
// Note: In a distributed system, use Redis. For single server, Map is fine.
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // extracting userId from query params if available
    const userId = socket.handshake.query.userId;

    if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} went online`);
        // Broadcast to admins (or everyone) that this user is online
        io.emit('user_status_update', { userId, status: 'Active' });
    }

    // Handle Admin requesting list of all online users
    socket.on('get_online_users', () => {
        const usersList = Array.from(onlineUsers.keys());
        socket.emit('online_users_list', usersList);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (userId) {
            onlineUsers.delete(userId);
            console.log(`User ${userId} went offline`);
            io.emit('user_status_update', { userId, status: 'Inactive' });
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(` My Server running on port ${PORT}`);
});