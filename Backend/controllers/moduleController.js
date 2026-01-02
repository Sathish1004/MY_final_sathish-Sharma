
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getVideoDurationInSeconds } from 'get-video-duration';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Add a new module to a course
// @route   POST /api/modules
export const addModule = async (req, res) => {
    try {
        const { courseId, title, order } = req.body;
        const videoFile = req.file;

        if (!courseId || !title || !videoFile) {
            return res.status(400).json({ message: 'Course ID, Title, and Video are required.' });
        }

        const videoPath = videoFile.path.replace(/\\/g, '/'); // Normalize path for DB
        let duration = 0;

        try {
            duration = await getVideoDurationInSeconds(videoFile.path);
        } catch (err) {
            console.warn('Could not extract video duration:', err.message);
            // Fallback: If duration is sent in body (from frontend), use it
            if (req.body.duration) {
                duration = parseFloat(req.body.duration);
            }
        }

        const [result] = await db.query(
            `INSERT INTO course_modules (course_id, title, video_path, duration_seconds, order_index)
             VALUES (?, ?, ?, ?, ?)`,
            [courseId, title, videoPath, Math.round(duration), order || 0]
        );

        res.status(201).json({
            message: 'Module added successfully',
            moduleId: result.insertId,
            videoPath,
            duration
        });

    } catch (error) {
        console.error('Error adding module:', error);
        res.status(500).json({ message: 'Server error adding module' });
    }
};

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
export const getCourseModules = async (req, res) => {
    try {
        const { courseId } = req.params;
        const [modules] = await db.query(
            `SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC`,
            [courseId]
        );
        res.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Stream video
// @route   GET /api/modules/:id/video
export const streamVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT video_path FROM course_modules WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }

        const videoPath = rows[0].video_path;
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ message: 'Video file not found on server' });
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('Error leaking video:', error);
        res.sendStatus(500);
    }
};

// @desc    Update progress
// @route   POST /api/modules/:id/progress
export const updateModuleProgress = async (req, res) => {
    try {
        const { id: moduleId } = req.params;
        const { watchedSeconds, courseId } = req.body;
        const userId = req.user.id;

        // 1. Get module details
        const [moduleRows] = await db.query('SELECT duration_seconds, course_id FROM course_modules WHERE id = ?', [moduleId]);
        if (moduleRows.length === 0) return res.status(404).json({ message: 'Module not found' });

        const module = moduleRows[0];
        const duration = module.duration_seconds;
        const actualCourseId = module.course_id; // Use DB truth

        // 2. Determine Completion (90%)
        let isCompleted = false;
        if (duration > 0 && (watchedSeconds / duration) >= 0.9) {
            isCompleted = true;
        }

        // 3. Upsert Progress
        await db.query(`
            INSERT INTO student_video_progress (user_id, module_id, course_id, watched_seconds, is_completed, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            watched_seconds = GREATEST(watched_seconds, VALUES(watched_seconds)),
            is_completed = is_completed OR VALUES(is_completed),
            updated_at = NOW()
        `, [userId, moduleId, actualCourseId, watchedSeconds, isCompleted]);

        // 4. If completed, trigger Side Effects
        if (isCompleted) {
            // A. Update Course Progress
            // Count total modules inside this course
            const [countRes] = await db.query('SELECT COUNT(*) as total FROM course_modules WHERE course_id = ?', [actualCourseId]);
            const totalModules = countRes[0].total;

            const [completedRes] = await db.query(
                `SELECT COUNT(DISTINCT module_id) as completed 
                 FROM student_video_progress 
                 WHERE user_id = ? AND course_id = ? AND is_completed = TRUE`,
                [userId, actualCourseId]
            );
            const completedModules = completedRes[0].completed;

            const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
            const status = percent === 100 ? 'Completed' : 'In Progress';

            // Upsert User Course Progress
            await db.query(`
                INSERT INTO user_progress (user_id, course_id, completed_modules, total_modules, completion_percent, status, last_accessed_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE 
                completed_modules = VALUES(completed_modules), 
                total_modules = VALUES(total_modules), 
                completion_percent = VALUES(completion_percent), 
                status = VALUES(status), 
                last_accessed_at = NOW(),
                updated_at = NOW()
            `, [userId, actualCourseId, completedModules, totalModules, percent, status]);

            // B. Log Learning Activity (Streak)
            // Check if we already logged activity for this course today? Maybe just log generic time spent.
            // The activityController logic logs time spent.
            // Lets call logActivity logic logic here or replicate it. 
            // Replicating simple log:
            const today = new Date().toISOString().split('T')[0];
            await db.query(
                `INSERT INTO learning_activity (user_id, course_id, time_spent_seconds, activity_date) 
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE time_spent_seconds = time_spent_seconds + VALUES(time_spent_seconds)`,
                [userId, actualCourseId, 10, today] // logging generic 10s per update or calculate diff? 
                // Ideally frontend sends "delta" time. But for now invalidating streak is key.
            );

            // C. Update Streak Logic (Call the complex logic? Or assume generic 'activity' works)
            // Ideally we'd reuse activityController.logActivity code. 
            // For now, let's execute a manual streak check/update like in activity controller.

            // ... (Skipping full streak calc duplication for brevity, relying on learning_activity trigger if exists or simple logic)
            // Actually, to ensure streak updates, we should probably hit the streak table directly:
            const [streakRows] = await db.query("SELECT * FROM learning_streak WHERE user_id = ?", [userId]);
            // ... logic from activityController ...
            // Simplified: Just touching last_active_date if undefined.
            // Better: Move streak logic to a shared helper. 
            // Currently: I'll assume logging to learning_activity is enough if I had a trigger, but I don't.
            // I will implement a basic streak update here.

            // Check Streak Logic
            let currentStreak = 1;
            let maxStreak = 1;
            if (streakRows.length > 0) {
                const streakData = streakRows[0];
                const lastActive = streakData.last_active_date ? new Date(streakData.last_active_date).toISOString().split('T')[0] : null;
                if (lastActive === today) {
                    currentStreak = streakData.current_streak;
                    maxStreak = streakData.max_streak;
                } else {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];
                    if (lastActive === yesterdayStr) {
                        currentStreak = streakData.current_streak + 1;
                    } else {
                        currentStreak = 1;
                    }
                    maxStreak = Math.max(streakData.max_streak, currentStreak);
                }
            }
            await db.query(
                `INSERT INTO learning_streak (user_id, current_streak, last_active_date, max_streak)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                    current_streak = VALUES(current_streak),
                    last_active_date = VALUES(last_active_date),
                    max_streak = VALUES(max_streak)`,
                [userId, currentStreak, today, maxStreak]
            );
        }

        res.json({ message: 'Progress updated', isCompleted });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get User Progress for a Module
// @route   GET /api/modules/:id/progress
export const getModuleProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT watched_seconds, is_completed FROM student_video_progress WHERE user_id = ? AND module_id = ?',
            [userId, id]
        );
        res.json(rows[0] || { watched_seconds: 0, is_completed: false });
    } catch (error) {
        console.error('Error fetching module progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
