import db from '../config/db.js';

// @desc    Get dashboard stats (KPIs)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');

        // 2. Active Users (Simulated as users logged in within last 24h or just total active status)
        // For now, let's use status = 'Active' if we had it, or just a placeholder since we don't track login time perfectly yet.
        // We'll trust the plan and return count of users

        // 3. Activity Feed (Recent 5)
        // const [recentActivity] = await db.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5');

        // 4. Enrollments Count
        const [enrollmentCount] = await db.query('SELECT COUNT(*) as count FROM enrollments');

        // 5. Course Completions
        const [completionCount] = await db.query('SELECT COUNT(*) as count FROM enrollments WHERE completed = TRUE');

        // 6. Total Courses
        const [courseCount] = await db.query('SELECT COUNT(*) as count FROM courses');


        res.json({
            totalUsers: userCount[0].count,
            activeUsers: Math.floor(userCount[0].count * 0.8), // Mocking active users as 80% of total for now
            totalEnrollments: enrollmentCount[0].count,
            courseCompletions: completionCount[0].count,
            totalCourses: courseCount[0].count
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get real-time activity feed
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getActivityFeed = async (req, res) => {
    try {
        const [activities] = await db.query(`
            SELECT a.*, u.name as user_name, u.email as user_email 
            FROM activity_logs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY a.created_at DESC 
            LIMIT 10
        `);
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get detailed chart data
// @route   GET /api/admin/charts
// @access  Private/Admin
export const getChartData = async (req, res) => {
    try {
        // 1. Course Enrollment Distribution
        const [courseDist] = await db.query(`
            SELECT c.title, COUNT(e.id) as students
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            GROUP BY c.id
        `);

        // 2. User Growth (Mocked for last 7 days as we don't have historical data generated yet)
        const userGrowth = [
            { date: 'Mon', users: 5 },
            { date: 'Tue', users: 8 },
            { date: 'Wed', users: 12 },
            { date: 'Thu', users: 15 },
            { date: 'Fri', users: 20 },
            { date: 'Sat', users: 25 },
            { date: 'Sun', users: 30 },
        ];

        res.json({
            courseDistribution: courseDist,
            userGrowth
        });

    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get top active users
// @route   GET /api/admin/top-users
// @access  Private/Admin
export const getTopActiveUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.name, u.email, u.status, u.role, COUNT(a.id) as activity_count
            FROM users u
            LEFT JOIN activity_logs a ON u.id = a.user_id
            GROUP BY u.id
            ORDER BY activity_count DESC
            LIMIT 5
        `);
        res.json(users);
    } catch (error) {
        console.error('Error fetching top users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
