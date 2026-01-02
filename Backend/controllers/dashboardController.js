import db from '../config/db.js';

// @desc    Get dashboard stats (KPIs)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');

        // 2. Active Users (Users who have logged activity in the last 30 days)
        const [activeUserCount] = await db.query('SELECT COUNT(DISTINCT user_id) as count FROM learning_activity WHERE activity_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)');

        // 3. Activity Feed (Recent 5) - Handled by distinct API usually but can leave here if needed or comment out as per orig

        // 4. Enrollments Count (Total records in user_progress)
        const [enrollmentCount] = await db.query('SELECT COUNT(*) as count FROM user_progress');

        // 5. Course Completions
        const [completionCount] = await db.query("SELECT COUNT(*) as count FROM user_progress WHERE status = 'Completed'");

        // 6. Total Courses
        const [courseCount] = await db.query('SELECT COUNT(*) as count FROM courses');


        res.json({
            totalUsers: userCount[0].count,
            activeUsers: activeUserCount[0].count,
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

        // 2. User Growth (Last 7 Days)
        const [growth] = await db.query(`
            SELECT DATE(created_at) as date, COUNT(*) as users 
            FROM users 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Format for Chart (ensure all days are present)
        const userGrowth = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = growth.find(g => {
                const gDate = new Date(g.date).toISOString().split('T')[0];
                return gDate === dateStr;
            });

            // Format Day Name (Mon, Tue...)
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            userGrowth.push({
                date: dayName,
                users: found ? found.users : 0
            });
        }

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
