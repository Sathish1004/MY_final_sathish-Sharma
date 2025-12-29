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
        const [rows] = await connection.execute('SELECT * FROM questions');
        await connection.end();

        const questions = rows.map(q => ({
            ...q,
            template_code: typeof q.template_code === 'string' ? JSON.parse(q.template_code) : q.template_code
        }));

        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

export const runCode = async (req, res) => {
    const { code, language, input } = req.body;

    if (!pistonLanguages[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    try {
        const payload = {
            language: pistonLanguages[language].language,
            version: pistonLanguages[language].version,
            files: [
                {
                    content: code
                }
            ],
            stdin: input || ""
        };

        const response = await axios.post(PISTON_API_URL, payload);
        const result = response.data;

        // Check for compilation or runtime errors
        if (result.compile && result.compile.code !== 0) {
            return res.json({
                output: result.compile.stderr || result.compile.output,
                status: "Compilation Error",
                isError: true
            });
        }

        const runOutput = result.run.stdout || result.run.stderr || "No output";
        const isError = result.run.code !== 0;

        res.json({
            output: runOutput,
            status: isError ? "Runtime Error" : "Accepted",
            isError: isError
        });

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

                if (actual !== expected) {
                    allPassed = false;
                    failedDetail = {
                        input: testCase.input,
                        expected: expected,
                        actual: actual,
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
