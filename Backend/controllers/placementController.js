import db from '../config/db.js';

export const addPlacement = async (req, res) => {
    try {
        const {
            student_name,
            student_email,
            course,
            company_name,
            job_role,
            placement_type,
            location,
            package: salary_package,
            placement_date,
            status,
            placement_story,
            interview_experience,
            technical_questions,
            // Fallback for manual URLs if no file is uploaded
            image_url,
            video_url,
            thumbnail_url
        } = req.body;

        // Handle File Uploads
        let finalImage = image_url;
        let finalVideo = video_url;

        if (req.files) {
            if (req.files.image) {
                finalImage = `/uploads/placements/${req.files.image[0].filename}`;
            }
            if (req.files.video) {
                finalVideo = `/uploads/placements/${req.files.video[0].filename}`;
            }
        }

        const query = `
            INSERT INTO placements 
            (student_name, student_email, course, company_name, job_role, placement_type, location, package, placement_date, status, placement_story, interview_experience, technical_questions, image_url, video_url, thumbnail_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(query, [
            student_name,
            student_email,
            course,
            company_name,
            job_role,
            placement_type,
            location,
            salary_package,
            placement_date,
            status || 'Placed',
            placement_story,
            interview_experience,
            technical_questions,
            finalImage,
            finalVideo,
            thumbnail_url // Thumbnail currently manual URL or could be generated
        ]);

        res.status(201).json({ message: 'Placement record added successfully' });
    } catch (error) {
        console.error('Error adding placement:', error);
        res.status(500).json({ message: 'Failed to add placement record' });
    }
};



export const getAllPlacements = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM placements ORDER BY placement_date DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching placements:', error);
        res.status(500).json({ message: 'Failed to fetch placements' });
    }
};

export const updatePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            student_name,
            student_email,
            course,
            company_name,
            job_role,
            placement_type,
            location,
            package: salary_package,
            placement_date,
            status,
            placement_story,
            interview_experience,
            technical_questions,
            image_url,
            video_url,
            thumbnail_url
        } = req.body;

        // Handle File Uploads (Updating only if new file provided)
        let finalImage = image_url;
        let finalVideo = video_url;

        if (req.files) {
            if (req.files.image) {
                finalImage = `/uploads/placements/${req.files.image[0].filename}`;
            }
            if (req.files.video) {
                finalVideo = `/uploads/placements/${req.files.video[0].filename}`;
            }
        }

        const query = `
            UPDATE placements 
            SET student_name = ?, student_email = ?, course = ?, company_name = ?, job_role = ?, placement_type = ?, location = ?, package = ?, placement_date = ?, status = ?,
            placement_story = ?, interview_experience = ?, technical_questions = ?, image_url = COALESCE(?, image_url), video_url = COALESCE(?, video_url), thumbnail_url = ?
            WHERE id = ?
        `;

        await db.query(query, [
            student_name,
            student_email,
            course,
            company_name,
            job_role,
            placement_type,
            location,
            salary_package,
            placement_date,
            status,
            placement_story,
            interview_experience,
            technical_questions,
            finalImage === image_url ? null : finalImage, // Pass null if no new file/url to allow COALESCE to keep existing
            finalVideo === video_url ? null : finalVideo,
            thumbnail_url,
            id
        ]);

        res.json({ message: 'Placement updated successfully' });
    } catch (error) {
        console.error('Error updating placement:', error);
        res.status(500).json({ message: 'Failed to update placement' });
    }
};

export const deletePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM placements WHERE id = ?', [id]);
        res.json({ message: 'Placement deleted successfully' });
    } catch (error) {
        console.error('Error deleting placement:', error);
        res.status(500).json({ message: 'Failed to delete placement' });
    }
};
