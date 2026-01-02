const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const hiddenCases = {
    // 1. Two Sum (Check existing, adding one more just in case)
    "Two Sum": [
        { input: "3 3\n6", expected_output: "[0, 1]", is_hidden: true },
        { input: "1 2 3 4 5\n9", expected_output: "[3, 4]", is_hidden: true }
    ],
    "Add Two Numbers": [
        { input: "l1 = [0], l2 = [0]", expected_output: "[0]", is_hidden: true },
        { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", expected_output: "[8,9,9,9,0,0,0,1]", is_hidden: true }
    ],
    "Median of Two Sorted Arrays": [
        { input: "nums1 = [], nums2 = [1]", expected_output: "1.00000", is_hidden: true },
        { input: "nums1 = [2], nums2 = []", expected_output: "2.00000", is_hidden: true }
    ],
    "Longest Substring Without Repeating Characters": [
        { input: "s = \"bbbbb\"", expected_output: "1", is_hidden: true },
        { input: "s = \"pwwkew\"", expected_output: "3", is_hidden: true }
    ],
    "Reverse Integer": [
        { input: "x = 120", expected_output: "21", is_hidden: true },
        { input: "x = 0", expected_output: "0", is_hidden: true }
    ],
    "Palindrome Number": [
        { input: "x = 10", expected_output: "false", is_hidden: true },
        { input: "x = 0", expected_output: "true", is_hidden: true }
    ],
    "Longest Common Prefix": [
        { input: "strs = [\"dog\",\"racecar\",\"car\"]", expected_output: "\"\"", is_hidden: true },
        { input: "strs = [\"a\"]", expected_output: "\"a\"", is_hidden: true }
    ],
    "3Sum": [
        { input: "nums = [0,0,0]", expected_output: "[[0,0,0]]", is_hidden: true },
        { input: "nums = [0,1,1]", expected_output: "[]", is_hidden: true }
    ],
    "Valid Parentheses": [
        { input: "s = \"(]\"", expected_output: "false", is_hidden: true },
        { input: "s = \"{[]}\"", expected_output: "true", is_hidden: true }
    ],
    "Merge Two Sorted Lists": [
        { input: "list1 = [], list2 = []", expected_output: "[]", is_hidden: true },
        { input: "list1 = [], list2 = [0]", expected_output: "[0]", is_hidden: true }
    ],
    "Search in Rotated Sorted Array": [
        { input: "nums = [1], target = 0", expected_output: "-1", is_hidden: true },
        { input: "nums = [1,3], target = 3", expected_output: "1", is_hidden: true }
    ],
    "Valid Sudoku": [
        // Simplified input for seed, backend/runner logic handles parsing appropriately or this tests generic structure
        { input: "board = [[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]", expected_output: "false", is_hidden: true }
    ],
    "Group Anagrams": [
        { input: "strs = [\"a\"]", expected_output: "[[\"a\"]]", is_hidden: true },
        { input: "strs = [\"\"]", expected_output: "[[\"\"]]", is_hidden: true }
    ],
    "Maximum Subarray": [
        { input: "nums = [1]", expected_output: "1", is_hidden: true },
        { input: "nums = [5,4,-1,7,8]", expected_output: "23", is_hidden: true }
    ],
    "Climbing Stairs": [
        { input: "n = 2", expected_output: "2", is_hidden: true },
        { input: "n = 4", expected_output: "5", is_hidden: true }
    ],
    "Word Search": [
        { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"", expected_output: "false", is_hidden: true }
    ],
    "Binary Tree Level Order Traversal": [
        { input: "root = [1]", expected_output: "[[1]]", is_hidden: true },
        { input: "root = []", expected_output: "[]", is_hidden: true }
    ],
    "Kth Largest Element in an Array": [
        { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", expected_output: "4", is_hidden: true }
    ],
    "Course Schedule": [
        { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", expected_output: "false", is_hidden: true }
    ],
    "Merge k Sorted Lists": [
        { input: "lists = []", expected_output: "[]", is_hidden: true },
        { input: "lists = [[]]", expected_output: "[]", is_hidden: true }
    ]
};

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected to DB. Adding hidden cases...");

        for (const [title, cases] of Object.entries(hiddenCases)) {
            // Find Question ID
            const [rows] = await connection.execute('SELECT id FROM questions WHERE title = ?', [title]);

            if (rows.length === 0) {
                console.log(`⚠️ Question not found: ${title}`);
                continue;
            }

            const questionId = rows[0].id;
            console.log(`Processing ${title} (ID: ${questionId})...`);

            // Delete existing hidden cases to avoid duplicates/conflicts for this run (optional, but cleaner)
            // await connection.execute('DELETE FROM test_cases WHERE question_id = ? AND is_hidden = 1', [questionId]);

            // Insert new cases
            for (const c of cases) {
                // Check if identical case exists to prevent massive duplicate buildup if run multiple times
                const [existing] = await connection.execute(
                    'SELECT id FROM test_cases WHERE question_id = ? AND input = ? AND is_hidden = 1',
                    [questionId, c.input]
                );

                if (existing.length === 0) {
                    await connection.execute(
                        'INSERT INTO test_cases (question_id, input, expected_output, is_hidden) VALUES (?, ?, ?, ?)',
                        [questionId, c.input, c.expected_output, 1]
                    );
                    console.log(`   + Added hidden case`);
                } else {
                    console.log(`   . Case already exists`);
                }
            }
        }
        console.log("Done.");
        await connection.end();

    } catch (e) {
        console.error(e);
    }
})();
