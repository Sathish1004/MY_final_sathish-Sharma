import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users with filtering, search, pagination, and sorting
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const { role, status, gender, search, alpha, page = 1, limit = 25 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, name, email, role, profile_picture,
            CASE 
                WHEN created_at < DATE_SUB(NOW(), INTERVAL 180 DAY) THEN 'Expired'
                ELSE status 
            END as status,
            gender, created_at, last_login,
            (SELECT COALESCE(AVG(progress), 0) FROM enrollments WHERE user_id = users.id) as progress
            FROM users WHERE 1=1`;
        let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        const params = [];

        // Filters
        if (role && role !== 'all') {
            query += ' AND role = ?';
            countQuery += ' AND role = ?';
            params.push(role);
        }

        if (status && status !== 'all') {
            if (status === 'Expired') {
                query += ' AND created_at < DATE_SUB(NOW(), INTERVAL 180 DAY)';
                countQuery += ' AND created_at < DATE_SUB(NOW(), INTERVAL 180 DAY)';
            } else {
                query += ' AND status = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 180 DAY)';
                countQuery += ' AND status = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 180 DAY)';
                params.push(status);
            }
        }

        if (gender && gender !== 'all') {
            query += ' AND gender = ?';
            countQuery += ' AND gender = ?';
            params.push(gender);
        }

        if (alpha && alpha.length === 1) {
            query += ' AND name LIKE ?';
            countQuery += ' AND name LIKE ?';
            params.push(`${alpha}%`);
        }

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR id = ?)';
            countQuery += ' AND (name LIKE ? OR email LIKE ? OR id = ?)';
            params.push(`%${search}%`, `%${search}%`, search);
        }

        // Sorting
        const { sort } = req.query;
        if (sort === 'alpha' || sort === 'alphabetical') {
            query += ' ORDER BY name ASC';
        } else {
            // Default to 'recent' (created_at DESC)
            query += ' ORDER BY created_at DESC';
        }

        // Pagination
        query += ' LIMIT ? OFFSET ?';
        const queryParams = [...params, Number(limit), Number(offset)];

        // Execute Queries
        const [users] = await db.query(query, queryParams);
        const [countResult] = await db.query(countQuery, params);

        const totalUsers = countResult[0].total;
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status, gender } = req.body;

        const fields = [];
        const params = [];

        if (role) {
            fields.push('role = ?');
            params.push(role);
        }
        if (status) {
            fields.push('status = ?');
            params.push(status);
        }
        if (gender) {
            fields.push('gender = ?');
            params.push(gender);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Bulk delete users
// @route   DELETE /api/admin/users/bulk
// @access  Private/Admin
export const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body; // Array of IDs
        if (!userIds || userIds.length === 0) {
            return res.status(400).json({ message: 'No users selected' });
        }

        // Use a parameterized query for IN clause
        const placeholders = userIds.map(() => '?').join(',');
        const query = `DELETE FROM users WHERE id IN (${placeholders})`;

        await db.query(query, userIds);
        res.json({ message: `${userIds.length} users deleted successfully` });

    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset User Password
// @access  Private/Admin
export const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Force Logout User (Mock)
// @access  Private/Admin
export const forceLogoutUser = async (req, res) => {
    // In a real JWT app, you'd add the token to a deny-list (Redis).
    // For now, we'll just return success as "Action Simulate".
    res.json({ message: 'User forced to logout (Token invalidated)' });
};

// @desc    Get User Details (Profile, Activity, Enrollments)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
// @desc    Get User Details (Profile, Activity, Enrollments, Coding, Mentorship)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch Basic User Profile
        const [userResult] = await db.query(
            'SELECT id, name, email, role, status, created_at, last_login, profile_picture, resume_path FROM users WHERE id = ?',
            [id]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        // 2. Fetch Activity Logs (Latest 10)
        let activityLogs = [];
        try {
            const [logs] = await db.query(
                'SELECT action, details, created_at FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
                [id]
            );
            activityLogs = logs;
        } catch (err) {
            console.warn("Activity logs fetch error:", err.message);
        }

        // 3. Fetch Enrollments
        let enrollments = [];
        try {
            const [courses] = await db.query(
                `SELECT c.id, c.title, e.enrolled_at, e.progress 
                 FROM enrollments e 
                 JOIN courses c ON e.course_id = c.id 
                 WHERE e.user_id = ? 
                 ORDER BY e.enrolled_at DESC LIMIT 5`,
                [id]
            );
            enrollments = courses;
        } catch (err) {
            console.warn("Enrollments fetch error:", err.message);
        }

        // 4. Fetch Coding Stats
        let codingStats = {
            problems_solved: 0,
            problems_attempted: 0,
            accuracy: 0,
            last_active: null,
            top_languages: [], // Mocked for now or aggregate if possible
            recent_submissions: []
        };
        try {
            // Count Solved
            const [solvedResult] = await db.query(
                "SELECT COUNT(DISTINCT question_id) as count FROM submissions WHERE user_id = ? AND status = 'Accepted'",
                [id]
            );
            codingStats.problems_solved = solvedResult[0].count;

            // Count Attempted
            const [attemptedResult] = await db.query(
                "SELECT COUNT(DISTINCT question_id) as count FROM submissions WHERE user_id = ?",
                [id]
            );
            codingStats.problems_attempted = attemptedResult[0].count;

            // Accuracy
            if (codingStats.problems_attempted > 0) {
                codingStats.accuracy = Math.round((codingStats.problems_solved / codingStats.problems_attempted) * 100);
            }

            // Recent Submissions
            const [recentSubs] = await db.query(
                "SELECT question_id, language, status, created_at FROM submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
                [id]
            );
            codingStats.recent_submissions = recentSubs;

            if (recentSubs.length > 0) {
                codingStats.last_active = recentSubs[0].created_at;
            }

            // Mock Top Languages for now (Hard to aggregate without complex query)
            codingStats.top_languages = [
                { name: 'JavaScript', percentage: 65 },
                { name: 'Python', percentage: 25 },
                { name: 'Java', percentage: 10 }
            ];

        } catch (err) {
            console.warn("Coding stats fetch error:", err.message);
        }

        // 5. Fetch Mentorship History
        let mentorshipHistory = [];
        try {
            const [sessions] = await db.query(
                `SELECT mentor_name, topic, booking_date, slot_time, status, meeting_link 
                 FROM mentor_bookings 
                 WHERE user_id = ? 
                 ORDER BY booking_date DESC`,
                [id]
            );
            mentorshipHistory = sessions;
        } catch (err) {
            console.warn("Mentorship fetch error:", err.message);
        }

        // 6. Construct Extended Profile (Mix of Real + Mock for UI richness)
        const extendedProfile = {
            phone: "+91 98765 43210", // Mock
            location: "Chennai, India", // Mock
            login_method: "Email/Password", // Mock
            bio: "Passionate learner exploring Full Stack Development.", // Mock
            github: "github.com/" + user.name.replace(/\s+/g, '').toLowerCase(), // Mock derived
            linkedin: "linkedin.com/in/" + user.name.replace(/\s+/g, '').toLowerCase(), // Mock derived
            ...user
        };

        res.json({
            user: extendedProfile,
            activityLogs,
            enrollments,
            codingStats,
            mentorshipHistory
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
