import db from '../config/db.js';

// @desc    Get student's activity feed
// @route   GET /api/student/activity
// @access  Private (Student)
export const getStudentActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const [activities] = await db.query(`
            SELECT * FROM activity_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        `, [userId]);

        res.json(activities);
    } catch (error) {
        console.error('Error fetching student activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log a new activity
// @route   POST /api/student/activity/log
// @access  Private (Student)
export const logStudentActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { action, details, ip_address } = req.body;

        if (!action) {
            return res.status(400).json({ message: 'Action is required' });
        }

        await db.query(`
            INSERT INTO activity_logs (user_id, action, details, ip_address)
            VALUES (?, ?, ?, ?)
        `, [userId, action, details || '', ip_address || req.ip]);

        res.status(201).json({ message: 'Activity logged' });
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get student stats (Streak, Minutes, Counts)
// @route   GET /api/student/stats
// @access  Private (Student)
export const getStudentStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Minutes (from learning_activity)
        const [activities] = await db.query(
            "SELECT SUM(time_spent_seconds) as total_seconds FROM learning_activity WHERE user_id = ?",
            [userId]
        );
        const totalMinutes = Math.round((activities[0].total_seconds || 0) / 60);

        // Calculate Streak (from learning_streak table)
        const [streakRows] = await db.query(
            "SELECT current_streak FROM learning_streak WHERE user_id = ?",
            [userId]
        );
        const streak = streakRows.length > 0 ? streakRows[0].current_streak : 0;

        // 2. Course Counts (from user_progress)
        const [progressRows] = await db.query(
            "SELECT status FROM user_progress WHERE user_id = ?",
            [userId]
        );

        let completedCourses = 0;
        let activeCourses = 0;
        progressRows.forEach(row => {
            if (row.status === 'Completed') completedCourses++;
            else if (row.status === 'In Progress') activeCourses++;
        });

        // 3. Not Started Courses
        // Logic: Total Available Courses - Enrolled Courses (where status is anything)
        // Or if 'Not Started' is a status in user_progress?
        // Enrolled usually creates a 'Not Started' or 'In Progress' record.
        // Let's assume 'Not Started' count is Total Courses in platform - (Active + Completed) 
        // OR simply Courses user hasn't enrolled in?
        // Let's stick to what the Context originally did: defined set of courses minus enrolled ones.
        // We'll fetch total courses count.
        const [totalCoursesRes] = await db.query("SELECT COUNT(*) as count FROM courses");
        const totalCourses = totalCoursesRes[0].count;
        const enrolledCount = progressRows.length;
        const notStartedCourses = Math.max(0, totalCourses - enrolledCount);
        // Note: This logic assumes 'Not Started' = Unenrolled or Enrolled-but-0-progress (if distinct).
        // If user_progress has 'Not Started' status, we should count that too.
        // Let's assume user_progress records start as 'In Progress' (0%) or 'Not Started'.
        // My logProgress logic uses 'In Progress' default.

        res.json({
            totalMinutes,
            streak,
            completedCourses,
            activeCourses,
            notStartedCourses
        });

    } catch (error) {
        console.error('Error fetching student stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get calendar activity data
// @route   GET /api/student/calendar
// @access  Private (Student)
export const getCalendarData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch learning sessions (time spent)
        const [learningRows] = await db.query(`
            SELECT activity_date, time_spent_seconds, course_id
            FROM learning_activity 
            WHERE user_id = ?
            ORDER BY activity_date DESC
        `, [userId]);

        // Fetch activity logs (events like completion)
        const [logRows] = await db.query(`
            SELECT created_at, action, details
            FROM activity_logs
            WHERE user_id = ?
        `, [userId]);

        // Merge Data by Date (YYYY-MM-DD)
        const calendarMap = {};

        // Process Learning Time
        learningRows.forEach(row => {
            const date = row.activity_date.toISOString().split('T')[0];
            if (!calendarMap[date]) {
                calendarMap[date] = { date, timeSpent: 0, actions: [], courses: new Set() };
            }
            calendarMap[date].timeSpent += row.time_spent_seconds;
        });

        // Process Logs
        logRows.forEach(row => {
            const date = row.created_at.toISOString().split('T')[0];
            if (!calendarMap[date]) {
                calendarMap[date] = { date, timeSpent: 0, actions: [], courses: new Set() };
            }
            calendarMap[date].actions.push(row.details);
        });

        // Convert Map to Array
        const result = Object.values(calendarMap).map(day => ({
            ...day,
            courses: Array.from(day.courses) // Convert Set to Array
        }));

        res.json(result);

    } catch (error) {
        console.error('Error fetching calendar data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
