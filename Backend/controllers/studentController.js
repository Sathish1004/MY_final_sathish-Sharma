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

        // Calculate Streak (Dynamic & Accurate from Calendar Data)
        // 1. Fetch all distinct activity dates
        const [activityDates] = await db.query(
            "SELECT DISTINCT activity_date FROM learning_activity WHERE user_id = ? ORDER BY activity_date DESC",
            [userId]
        );

        let streak = 0;
        if (activityDates.length > 0) {
            const today = new Date(); // Local server time, careful with TZ. UTC usually best.
            // Normalize current dates to YYYY-MM-DD
            const todayStr = today.toISOString().split('T')[0];

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let currentDate = new Date(activityDates[0].activity_date);
            let currentDateStr = currentDate.toISOString().split('T')[0];

            // Check if chain starts today or yesterday
            if (currentDateStr === todayStr || currentDateStr === yesterdayStr) {
                streak = 1;

                // Iterate backwards
                for (let i = 0; i < activityDates.length - 1; i++) {
                    const prevDate = new Date(activityDates[i].activity_date);
                    const nextDate = new Date(activityDates[i + 1].activity_date);

                    // Diff in days
                    const diffTime = Math.abs(prevDate - nextDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break; // Chain broken
                    }
                }
            }
        }

        // Update the cache table (optional, but keeps it synced)
        await db.query(`
            INSERT INTO learning_streak (user_id, current_streak, last_active_date, max_streak)
            VALUES (?, ?, DATE(NOW()), ?)
            ON DUPLICATE KEY UPDATE current_streak = VALUES(current_streak)
        `, [userId, streak, streak]);

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
        const [totalCoursesRes] = await db.query("SELECT COUNT(*) as count FROM courses");
        const totalCourses = totalCoursesRes[0].count;
        const enrolledCount = progressRows.length;
        const notStartedCourses = Math.max(0, totalCourses - enrolledCount);

        // --- EXTENDED PREMIUM METRICS ---

        // 4. Problems Solved (Coding)
        let problemsSolved = 0;
        try {
            const [codingRows] = await db.query("SELECT COUNT(*) as count FROM coding_submissions WHERE user_id = ? AND status = 'Accepted'", [userId]);
            problemsSolved = codingRows[0].count;
        } catch (e) { /* Table might not exist */ }

        // 5. Projects Submitted
        let projectsSubmitted = 0;
        try {
            const [projectRows] = await db.query("SELECT COUNT(*) as count FROM project_submissions WHERE user_id = ?", [userId]);
            projectsSubmitted = projectRows[0].count;
        } catch (e) { /* Table might not exist */ }

        // 6. Badges Earned (Logic: 1 per Course + 1 per 5 Problems + 1 per 10 Hours)
        const timeBadges = Math.floor(totalMinutes / 600); // 600 mins = 10 hours
        const badgesEarned = completedCourses + Math.floor(problemsSolved / 5) + timeBadges;

        // 7. Jobs Applied
        let jobsApplied = 0;
        try {
            const [jobRows] = await db.query("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ?", [userId]);
            jobsApplied = jobRows[0].count;
        } catch (e) { /* Table might not exist */ }

        // 8. Mentor Bookings (Upcoming)
        let mentorBookings = 0;
        let nextSession = null;
        try {
            const [mentorRows] = await db.query("SELECT COUNT(*) as count FROM mentor_appointments WHERE student_id = ? AND status = 'Scheduled'", [userId]);
            mentorBookings = mentorRows[0].count;
            // Get next session details if any
            const [nextSess] = await db.query("SELECT * FROM mentor_appointments WHERE student_id = ? AND status = 'Scheduled' ORDER BY schedule_time ASC LIMIT 1", [userId]);
            if (nextSess.length > 0) nextSession = nextSess[0];
        } catch (e) { /* Table might not exist */ }

        res.json({
            totalMinutes,
            streak,
            completedCourses,
            activeCourses,
            notStartedCourses,
            // Premium Metrics
            problemsSolved,
            projectsSubmitted,
            badgesEarned,
            jobsApplied,
            mentorBookings,
            nextSession
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
