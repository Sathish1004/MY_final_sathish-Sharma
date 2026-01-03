import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Get All Courses with Extras (Enrollments, Ratings)
export const getAllCourses = async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        let query = `
            SELECT c.*, 
            COUNT(DISTINCT e.id) as enrolled,
            COUNT(DISTINCT CASE WHEN e.progress = 100 THEN e.id END) as completed,
            IFNULL(AVG(cr.rating), 0) as rating,
            (SELECT COUNT(*) FROM course_modules WHERE course_id = c.id) as total_modules,
            (SELECT IFNULL(SUM(duration_seconds), 0) FROM course_modules WHERE course_id = c.id) as total_duration
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            LEFT JOIN course_ratings cr ON c.id = cr.course_id
            WHERE 1=1
        `;
        const queryParams = [];

        // Search
        if (req.query.search) {
            query += " AND (c.title LIKE ? OR c.instructor LIKE ?)";
            queryParams.push(`%${req.query.search}%`, `%${req.query.search}%`);
        }

        // Filters
        if (req.query.level && req.query.level !== 'all') {
            query += " AND c.level = ?";
            queryParams.push(req.query.level);
        }
        if (req.query.status && req.query.status !== 'all') {
            query += " AND c.status = ?";
            queryParams.push(req.query.status);
        }

        query += " GROUP BY c.id ORDER BY c.created_at DESC";

        const [courses] = await connection.execute(query, queryParams);
        await connection.end();

        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        try {
            const logPath = 'debug_controller_error.log';
            fs.writeFileSync(logPath, `TIMESTAMP: ${new Date().toISOString()}\nERROR: ${error.message}\nSTACK: ${error.stack}\n`);
        } catch (e) {
            console.error("Failed to write debug log", e);
        }
        res.status(500).json({ message: "Server error fetching courses", error: error.message });
    }
};

// @desc    Get Single Course
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            `SELECT c.*, 
            COUNT(DISTINCT up.id) as students,
            IFNULL(AVG(cr.rating), 0) as rating
            FROM courses c
            LEFT JOIN user_progress up ON c.id = up.course_id
            LEFT JOIN course_ratings cr ON c.id = cr.course_id
            WHERE c.id = ?
            GROUP BY c.id`,
            [id]
        );
        await connection.end();

        if (rows.length === 0) return res.status(404).json({ message: "Course not found" });

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create New Course
export const createCourse = async (req, res) => {
    const { title, description, instructor, thumbnail, category, level, price, status } = req.body;

    if (!title || !description || !instructor) {
        return res.status(400).json({ message: "Title, Description, and Instructor are required" });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            INSERT INTO courses (title, description, instructor, thumbnail, category, level, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            title,
            description,
            instructor,
            thumbnail || null,
            category || 'General',
            level || 'Beginner',
            price || 0.00,
            status || 'Draft'
        ]);

        await connection.end();

        res.status(201).json({ message: "Course created successfully", courseId: result.insertId });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Server error creating course" });
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, instructor, thumbnail, category, level, price, status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Build dynamic update query
        let updates = [];
        let params = [];

        if (title) { updates.push("title = ?"); params.push(title); }
        if (description) { updates.push("description = ?"); params.push(description); }
        if (instructor) { updates.push("instructor = ?"); params.push(instructor); }
        if (thumbnail) { updates.push("thumbnail = ?"); params.push(thumbnail); }
        if (category) { updates.push("category = ?"); params.push(category); }
        if (level) { updates.push("level = ?"); params.push(level); }
        if (price !== undefined) { updates.push("price = ?"); params.push(price); }
        if (status) { updates.push("status = ?"); params.push(status); }

        if (updates.length === 0) {
            await connection.end();
            return res.status(400).json({ message: "No fields to update" });
        }

        params.push(id);
        const query = `UPDATE courses SET ${updates.join(", ")} WHERE id = ?`;

        const [result] = await connection.execute(query, params);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course updated successfully" });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Server error updating course" });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute("DELETE FROM courses WHERE id = ?", [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server error deleting course" });
    }
};

// @desc    Get Course Analytics (Mocked for now)
// @route   GET /api/courses/:id/analytics
export const getCourseAnalytics = async (req, res) => {
    // Return dummy data for charts
    res.json({
        enrollmentGrowth: [
            { name: 'Week 1', value: 12 },
            { name: 'Week 2', value: 19 },
            { name: 'Week 3', value: 35 },
            { name: 'Week 4', value: 48 },
        ],
        completionStats: [
            { name: 'Completed', value: 65 },
            { name: 'In Progress', value: 25 },
            { name: 'Dropped', value: 10 },
        ]
    });
};

// @desc    Get Course Curriculum
// @route   GET /api/courses/:id/curriculum
export const getCourseCurriculum = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch Modules
        const [modules] = await connection.execute(
            "SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC",
            [id]
        );

        // Fetch Lessons for these modules
        // For simplicity, fetching all lessons for the course via join logic or just getting all lessons for course modules
        // A better way: Left join modules and lessons
        const [rows] = await connection.execute(`
            SELECT m.id as module_id, m.title as module_title, 
                   l.id as lesson_id, l.title as lesson_title, l.duration
            FROM course_modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            WHERE m.course_id = ?
            ORDER BY m.order_index, l.order_index
        `, [id]);

        await connection.end();

        // Grouping
        const curriculum = [];
        let currentModule = null;

        rows.forEach(row => {
            if (!currentModule || currentModule.id !== row.module_id) {
                currentModule = {
                    id: row.module_id,
                    title: row.module_title,
                    lessons: []
                };
                curriculum.push(currentModule);
            }
            if (row.lesson_id) {
                currentModule.lessons.push({
                    id: row.lesson_id,
                    title: row.lesson_title,
                    duration: row.duration
                });
            }
        });

        res.json(curriculum);

    } catch (error) {
        console.error("Error fetching curriculum:", error);
        res.status(500).json({ message: "Server error fetching curriculum" });
    }
};

// @desc    Get Course Students
// @route   GET /api/courses/:id/students
export const getCourseStudents = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Joining with user_progress instead of enrollments
        const [students] = await connection.execute(`
            SELECT u.id, u.name, u.email, u.status, up.last_accessed_at as enrolled_at, up.completion_percent as progress
            FROM user_progress up
            JOIN users u ON up.user_id = u.id
            WHERE up.course_id = ?
            ORDER BY up.last_accessed_at DESC
        `, [id]);
        await connection.end();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error fetching students" });
    }
};
// @desc    Enroll User in Course
// @route   POST /api/courses/:id/enroll
export const enrollUser = async (req, res) => {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Check if already enrolled (check user_progress)
        const [existing] = await connection.execute(
            "SELECT id FROM user_progress WHERE user_id = ? AND course_id = ?",
            [userId, courseId]
        );

        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Initialize user_progress
        const [result] = await connection.execute(
            `INSERT INTO user_progress 
            (user_id, course_id, completed_modules, total_modules, completion_percent, status, last_accessed_at) 
            VALUES (?, ?, 0, 0, 0, 'In Progress', NOW())`,
            [userId, courseId]
        );

        // Also log activity
        await connection.execute(
            `INSERT INTO learning_activity (user_id, course_id, time_spent_seconds, activity_date) VALUES (?, ?, 0, CURDATE())`,
            [userId, courseId]
        );

        await connection.end();

        res.status(201).json({ message: "Enrolled successfully", enrollmentId: result.insertId });

    } catch (error) {
        console.error("Error enrolling user:", error);
        res.status(500).json({ message: "Server error enrolling user" });
    }
};
// @desc    Update Course Progress (Legacy PUT /api/courses/:id/progress - kept for compatibility but updated logic)
// @route   PUT /api/courses/:id/progress
export const updateCourseProgress = async (req, res) => {
    const { id: courseId } = req.params;
    const { progress, status } = req.body;
    const userId = req.user.id;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Update user_progress
        // We assume progress is percentage here from frontend for now, or we calculate if modules provided
        // For simplicity reusing the frontend percentage if sent, but ideally we should calculate from modules

        await connection.execute(
            "UPDATE user_progress SET completion_percent = ?, status = ?, last_accessed_at = NOW() WHERE user_id = ? AND course_id = ?",
            [progress, status, userId, courseId]
        );

        await connection.end();
        res.json({ message: "Progress updated" });
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ message: "Server error updating progress" });
    }
};

// @desc    Detailed Progress Update (New POST /api/progress/update)
// @route   POST /api/progress/update
export const logProgress = async (req, res) => {
    const { courseId, completedModules, totalModules, status } = req.body;
    const userId = req.user.id;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        const newStatus = percent === 100 ? 'Completed' : (status || 'In Progress');

        // Upsert logic
        const query = `
            INSERT INTO user_progress (user_id, course_id, completed_modules, total_modules, completion_percent, status, last_accessed_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
            completed_modules = VALUES(completed_modules), 
            total_modules = VALUES(total_modules), 
            completion_percent = VALUES(completion_percent), 
            status = VALUES(status), 
            last_accessed_at = NOW(),
            updated_at = NOW()
        `;

        await connection.execute(query, [userId, courseId, completedModules, totalModules, percent, newStatus]);

        await connection.end();
        res.json({ message: "Progress logged successfully", percent, status: newStatus });
    } catch (error) {
        console.error("Error logging progress:", error);
        res.status(500).json({ message: "Server error logging progress" });
    }
};

// @desc    Get Student Enrollments (My Learning)
// @route   GET /api/courses/my-courses
export const getStudentEnrollments = async (req, res) => {
    const userId = req.user.id;
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Joining with user_progress
        const [enrollments] = await connection.execute(`
            SELECT up.course_id, up.completion_percent as progress, up.status, up.last_accessed_at as enrolled_at, 
                   c.title, c.thumbnail 
            FROM user_progress up
            JOIN courses c ON up.course_id = c.id
            WHERE up.user_id = ?
        `, [userId]);

        await connection.end();
        res.json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ message: "Server error fetching enrollments" });
    }
};
