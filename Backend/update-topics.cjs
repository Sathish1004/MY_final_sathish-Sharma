const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'student_hub_db'
};

const topicMapping = {
    "Two Sum": "Arrays",
    "Add Two Numbers": "Linked List",
    "Median of Two Sorted Arrays": "Arrays",
    "Longest Substring Without Repeating Characters": "Strings",
    "Reverse Integer": "Math",
    "Palindrome Number": "Math",
    "Longest Common Prefix": "Strings",
    "3Sum": "Arrays",
    "Valid Parentheses": "Strings",
    "Merge Two Sorted Lists": "Linked List",
    "Search in Rotated Sorted Array": "Arrays",
    "Valid Sudoku": "Matrix",
    "Group Anagrams": "Strings",
    "Maximum Subarray": "Arrays",
    "Climbing Stairs": "Dynamic Programming",
    "Word Search": "Strings", // Or Backtracking
    "Binary Tree Level Order Traversal": "Trees",
    "Kth Largest Element in an Array": "Arrays",
    "Course Schedule": "Graphs",
    "Merge k Sorted Lists": "Linked List"
};

const updateTopics = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        // 1. Ensure 'topic' column exists
        try {
            await connection.query("ALTER TABLE questions ADD COLUMN topic VARCHAR(255) DEFAULT ''");
            console.log("Added 'topic' column.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'topic' column already exists.");
            } else {
                throw err;
            }
        }

        // 2. Update topics
        console.log("Updating topics...");
        for (const [title, topic] of Object.entries(topicMapping)) {
            const [result] = await connection.execute(
                'UPDATE questions SET topic = ? WHERE title = ?',
                [topic, title]
            );
            if (result.matchedRows > 0) {
                console.log(`Updated "${title}" -> ${topic}`);
            } else {
                console.warn(`Problem "${title}" not found.`);
            }
        }

        console.log("All topics updated successfully.");

    } catch (error) {
        console.error("Error updating topics:", error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

updateTopics();
