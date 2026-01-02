import mysql from 'mysql2/promise';
import axios from 'axios';

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Map accessible languages to Piston versions (using common latest versions)
const pistonLanguages = {
    python: { language: "python", version: "3.10.0" },
    javascript: { language: "javascript", version: "18.15.0" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "c++", version: "10.2.0" },
    c: { language: "c", version: "10.2.0" }
};

export const getQuestions = async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch Questions
        const [questions] = await connection.execute('SELECT * FROM questions');

        // Fetch Visible Test Cases
        const [testCases] = await connection.execute('SELECT * FROM test_cases WHERE is_hidden = FALSE');

        await connection.end();

        // Map test cases to questions
        const questionsWithExamples = questions.map(q => {
            const examples = testCases
                .filter(tc => tc.question_id === q.id)
                .map(tc => ({
                    input: tc.input,
                    output: tc.expected_output,
                    explanation: "" // We didn't seed explanations, defaulting to empty
                }));

            return {
                ...q,
                template_code: typeof q.template_code === 'string' ? JSON.parse(q.template_code) : q.template_code,
                examples: examples,
                constraints: typeof q.constraints === 'string' ? JSON.parse(q.constraints) : (q.constraints || [])
            };
        });

        res.json(questionsWithExamples);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

export const runCode = async (req, res) => {
    const { code, language, input, testCases } = req.body;

    if (!pistonLanguages[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const langConfig = pistonLanguages[language];

    // Helper function to execute a single test case
    const executeCase = async (inputStr, expectedOutput = null) => {
        try {
            const payload = {
                language: langConfig.language,
                version: langConfig.version,
                files: [{ content: code }],
                stdin: inputStr || ""
            };

            const response = await axios.post(PISTON_API_URL, payload);
            const result = response.data;

            if (result.compile && result.compile.code !== 0) {
                return {
                    isError: true,
                    status: "Compilation Error",
                    output: result.compile.stderr || result.compile.output,
                };
            }

            const runOutput = (result.run.stdout || result.run.stderr || "No output").trim();
            const isError = result.run.code !== 0;

            let passed = null;
            if (expectedOutput) {
                const expected = expectedOutput.trim();
                passed = runOutput === expected;
            }

            return {
                isError: isError,
                status: isError ? "Runtime Error" : (passed === false ? "Wrong Answer" : "Accepted"),
                output: runOutput,
                expected_output: expectedOutput,
                passed: passed
            };
        } catch (error) {
            return {
                isError: true,
                status: "Execution Error",
                output: error.message
            };
        }
    };

    try {
        if (testCases && Array.isArray(testCases)) {
            // Batch Execution Mode (for "Run" button with multiple samples)
            const results = [];
            for (const tc of testCases) {
                const result = await executeCase(tc.input, tc.expected_output);
                results.push({
                    input: tc.input,
                    ...result
                });
            }
            res.json({ results });
        } else {
            // Single Execution Mode (Legacy / Custom Input)
            const result = await executeCase(input, req.body.expected_output);
            res.json(result);
        }

    } catch (error) {
        console.error('Piston execution error:', error.message);
        res.status(500).json({ error: 'Execution failed', details: error.message });
    }
};

export const submitCode = async (req, res) => {
    const { user_id, question_id, code, language } = req.body;

    if (!pistonLanguages[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch hidden test cases
        const [testCases] = await connection.execute('SELECT * FROM test_cases WHERE question_id = ?', [question_id]);

        if (testCases.length === 0) {
            await connection.end();
            return res.status(400).json({ error: 'No test cases found for this problem.' });
        }

        console.log(`[DEBUG] Submit: Fetched ${testCases.length} cases. Sample 0 keys:`, Object.keys(testCases[0]));
        console.log(`[DEBUG] Sample 0 Input: "${testCases[0].input}"`);

        let allPassed = true;
        let failedDetail = null;

        const langConfig = pistonLanguages[language];

        // Sequential execution against test cases
        for (const testCase of testCases) {
            try {
                const response = await axios.post(PISTON_API_URL, {
                    language: langConfig.language,
                    version: langConfig.version,
                    files: [{ content: code }],
                    stdin: testCase.input
                });

                const result = response.data;

                // Compilation Error Check
                if (result.compile && result.compile.code !== 0) {
                    allPassed = false;
                    failedDetail = {
                        input: testCase.input,
                        expected: testCase.expected_output,
                        actual: "Compilation Error",
                        error: result.compile.stderr
                    };
                    break;
                }

                // Runtime Error Check
                if (result.run.code !== 0) {
                    allPassed = false;
                    failedDetail = {
                        input: testCase.input,
                        expected: testCase.expected_output,
                        actual: "Runtime Error",
                        error: result.run.stderr
                    };
                    break;
                }

                const actual = (result.run.stdout || "").trim();
                const expected = (testCase.expected_output || "").trim();

                // Helper to normalize content for comparison
                const normalize = (val) => {
                    const v = val.toLowerCase();
                    if (v === 'true' || v === '1') return 'true';
                    if (v === 'false' || v === '0') return 'false';
                    return v; // Return lowercased string for general case-insensitive check? 
                    // Or keep strict for non-booleans? Let's assume strict for non-boolean but allow boolean flex.
                };

                // 1. Strict Check
                let match = actual === expected;

                // 2. If Strict fails, try Loose Boolean/Case Check
                if (!match) {
                    const normActual = normalize(actual);
                    const normExpected = normalize(expected);
                    if (normActual === normExpected) match = true;
                }

                if (!match) {
                    allPassed = false;
                    failedDetail = {
                        input: testCase.input !== undefined ? String(testCase.input) : "N/A",
                        expected: expected !== undefined ? String(expected) : "N/A",
                        actual: actual !== undefined ? String(actual) : "N/A",
                        error: null
                    };
                    break;
                }

            } catch (err) {
                console.error("Test case execution failed", err);
                allPassed = false;
                failedDetail = { error: "System Error during execution" };
                break;
            }
        }

        const status = allPassed ? 'Accepted' : 'Rejected';

        // Save submission
        await connection.execute(
            'INSERT INTO submissions (user_id, question_id, code, language, status, execution_time) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, question_id, code, language, status, 0] // Piston doesn't strictly provide easy total time in this structure, using 0 for now or sum details if available
        );

        if (allPassed) {
            await updateUserStreak(connection, user_id);
            // Check for badges based on solved count
            await checkAndAwardBadges(connection, user_id);
        }

        await connection.end();

        res.json({
            status,
            passed: allPassed,
            details: failedDetail
        });

    } catch (error) {
        console.error('Submission processing error:', error);
        res.status(500).json({ error: 'Submission processing failed' });
    }
};

// Helper to update streak
export const updateUserStreak = async (connection, userId) => {
    try {
        const [users] = await connection.execute('SELECT streak_count, last_activity_date FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return;

        const user = users[0];
        const lastActivity = user.last_activity_date ? new Date(user.last_activity_date) : null;
        const today = new Date();

        // Normalize dates to midnight for comparison
        today.setHours(0, 0, 0, 0);

        if (lastActivity) {
            lastActivity.setHours(0, 0, 0, 0);
        }

        let newStreak = user.streak_count || 0;

        if (!lastActivity) {
            // First activity ever
            newStreak = 1;
        } else {
            const diffTime = Math.abs(today - lastActivity);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                newStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
            }
            // If diffDays === 0, same day, do nothing
        }

        await connection.execute(
            'UPDATE users SET streak_count = ?, last_activity_date = NOW() WHERE id = ?',
            [newStreak, userId]
        );

    } catch (err) {
        console.error("Error updating streak:", err);
    }
};

const checkAndAwardBadges = async (connection, userId) => {
    try {
        // 1. Get User Stats (Streak)
        const [users] = await connection.execute('SELECT streak_count FROM users WHERE id = ?', [userId]);
        const streak = users.length > 0 ? users[0].streak_count : 0;

        // 2. Get Solved Count
        const [countRows] = await connection.execute(
            `SELECT COUNT(DISTINCT question_id) as count FROM submissions WHERE user_id = ? AND status = 'Accepted'`,
            [userId]
        );
        const solvedCount = countRows[0].count;

        // 3. Check for Hard Problem Solved
        const [hardRows] = await connection.execute(
            `SELECT COUNT(DISTINCT s.question_id) as count 
             FROM submissions s
             JOIN questions q ON s.question_id = q.id
             WHERE s.user_id = ? AND s.status = 'Accepted' AND q.difficulty = 'Hard'`,
            [userId]
        );
        const solvedHardCount = hardRows[0].count;

        // 4. Check Kit Completion (Arrays & Strings) - Simplified Logic
        //    (Ideally we fetch total questions per topic vs solved per topic)
        const checkKit = async (topic) => {
            const [totalQ] = await connection.execute('SELECT COUNT(*) as count FROM questions WHERE topic = ?', [topic]);
            const [solvedQ] = await connection.execute(
                `SELECT COUNT(DISTINCT s.question_id) as count 
                 FROM submissions s 
                 JOIN questions q ON s.question_id = q.id 
                 WHERE s.user_id = ? AND s.status = 'Accepted' AND q.topic = ?`,
                [userId, topic]
            );
            // Only award if there are actual questions and all are solved
            return totalQ[0].count > 0 && totalQ[0].count === solvedQ[0].count;
        };

        const isArrayMaster = await checkKit('Arrays');
        const isStringWizard = await checkKit('Strings');


        const badgesToAward = [];

        // Criteria 1: First Step (1 Solved)
        if (solvedCount >= 1) badgesToAward.push('First Step');

        // Criteria 2: Streak Starter (3 Day Streak)
        if (streak >= 3) badgesToAward.push('Streak Starter');

        // Criteria 3: Problem Hunter (10 Solved)
        if (solvedCount >= 10) badgesToAward.push('Problem Hunter');

        // Criteria 5: Kit Badges
        if (isArrayMaster) badgesToAward.push('Array Master');
        if (isStringWizard) badgesToAward.push('String Wizard');

        if (badgesToAward.length > 0) {
            for (const badgeName of badgesToAward) {
                // Ensure logic matches DB names.
                const [badgeRows] = await connection.execute('SELECT id FROM badges WHERE name = ?', [badgeName]);
                if (badgeRows.length > 0) {
                    const badgeId = badgeRows[0].id;
                    await connection.execute(
                        'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
                        [userId, badgeId]
                    );
                }
            }
        }
    } catch (err) {
        console.error("Error checking badges:", err);
    }
};

export const getUserProgress = async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Get User Streak and Badges
        const [userRows] = await connection.execute(
            'SELECT streak_count, last_activity_date FROM users WHERE id = ?',
            [user_id]
        );

        let streak = 0;
        if (userRows.length > 0) {
            const user = userRows[0];
            streak = user.streak_count || 0;
            const lastActivity = user.last_activity_date ? new Date(user.last_activity_date) : null;

            if (lastActivity) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                lastActivity.setHours(0, 0, 0, 0);

                const diffTime = Math.abs(today - lastActivity);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // If last activity was older than yesterday (diffDays > 1), streak is broken.
                // We return 0 here. Ideally we could update DB too, but display logic 
                // is sufficient for user experience.
                if (diffDays > 1) {
                    streak = 0;
                }
            } else {
                streak = 0;
            }
        }



        // 2. Get Total Questions per Difficulty
        const [totalRows] = await connection.execute(
            'SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty'
        );

        // 3. Get Solved Questions per Difficulty (Distinct questions solved by user)
        const [solvedRows] = await connection.execute(
            `SELECT q.difficulty, COUNT(DISTINCT s.question_id) as count 
             FROM submissions s
             JOIN questions q ON s.question_id = q.id
             WHERE s.user_id = ? AND s.status = 'Accepted'
             GROUP BY q.difficulty`,
            [user_id]
        );



        // Process Totals
        const totalStats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
        totalRows.forEach(row => {
            totalStats[row.difficulty] = row.count;
            totalStats.Total += row.count;
        });

        // Process Solved
        const solvedStats = { Easy: 0, Medium: 0, Hard: 0, Total: 0 };
        solvedRows.forEach(row => {
            solvedStats[row.difficulty] = row.count;
            solvedStats.Total += row.count;
        });

        // Check for badges
        const [userBadges] = await connection.execute('SELECT badge_id FROM user_badges WHERE user_id = ?', [user_id]);
        const badgeCount = userBadges.length;
        const ownedBadgeIds = userBadges.map(b => b.badge_id);

        // Get Solved Problem IDs for UI ticking
        const [solvedIdsRows] = await connection.execute(
            `SELECT DISTINCT question_id FROM submissions WHERE user_id = ? AND status = 'Accepted'`,
            [user_id]
        );
        const sortedSolvedIds = solvedIdsRows.sort((a, b) => a.question_id - b.question_id);
        const solvedProblemIds = sortedSolvedIds.map(row => row.question_id);

        // 4. Get Submission History (Last 60 Days)
        const [historyRows] = await connection.execute(
            `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count 
             FROM submissions 
             WHERE user_id = ? AND status = 'Accepted' AND created_at >= NOW() - INTERVAL 60 DAY 
             GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
             ORDER BY date ASC`,
            [user_id]
        );

        // 5. Get Language Stats
        const [languageRows] = await connection.execute(
            `SELECT language, COUNT(*) as count 
             FROM submissions 
             WHERE user_id = ? AND status = 'Accepted'
             GROUP BY language
             ORDER BY count DESC`,
            [user_id]
        );

        await connection.end();

        res.json({
            overall: {
                solved: solvedStats.Total,
                total: totalStats.Total,
                progressPercent: totalStats.Total > 0 ? Math.round((solvedStats.Total / totalStats.Total) * 100) : 0
            },
            difficulty: {
                easy: { solved: solvedStats.Easy, total: totalStats.Easy },
                medium: { solved: solvedStats.Medium, total: totalStats.Medium },
                hard: { solved: solvedStats.Hard, total: totalStats.Hard }
            },
            streak: streak,
            badges: badgeCount,
            ownedBadgeIds: ownedBadgeIds,
            solvedProblemIds: solvedProblemIds,
            submissionHistory: historyRows,
            languages: languageRows // Added
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};
