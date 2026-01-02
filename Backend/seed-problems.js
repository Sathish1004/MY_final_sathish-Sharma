// Backend/seed-problems.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'student_hub_db'
};

const problems = [
    {
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        template_code: {
            python: "def two_sum(nums, target):\n    # Write your code here\n    pass",
            javascript: "function twoSum(nums, target) {\n    // Write your code here\n}"
        },
        test_cases: [
            { input: "2 7 11 15\n9", expected_output: "[0, 1]", is_hidden: false },
            { input: "3 2 4\n6", expected_output: "[1, 2]", is_hidden: false },
            { input: "3 3\n6", expected_output: "[0, 1]", is_hidden: true }
        ]
    },
    {
        title: "Add Two Numbers",
        difficulty: "Medium",
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
        template_code: {
            python: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass"
        },
        test_cases: [
            { input: "l1 = [2,4,3], l2 = [5,6,4]", expected_output: "[7,0,8]", is_hidden: false }
        ]
    },
    {
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
        template_code: { python: "def findMedianSortedArrays(nums1, nums2):\n    pass" },
        test_cases: [
            { input: "nums1 = [1,3], nums2 = [2]", expected_output: "2.00000", is_hidden: false },
            { input: "nums1 = [1,2], nums2 = [3,4]", expected_output: "2.50000", is_hidden: false }
        ]
    },
    {
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        template_code: { python: "def lengthOfLongestSubstring(s):\n    pass" },
        test_cases: [
            { input: "s = \"abcabcbb\"", expected_output: "3", is_hidden: false }
        ]
    },
    {
        title: "Reverse Integer",
        difficulty: "Medium",
        description: "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
        template_code: { python: "def reverse(x):\n    pass" },
        test_cases: [
            { input: "x = 123", expected_output: "321", is_hidden: false },
            { input: "x = -123", expected_output: "-321", is_hidden: false }
        ]
    },
    {
        title: "Palindrome Number",
        difficulty: "Easy",
        description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
        template_code: { python: "def isPalindrome(x):\n    pass" },
        test_cases: [
            { input: "x = 121", expected_output: "true", is_hidden: false },
            { input: "x = -121", expected_output: "false", is_hidden: false }
        ]
    },
    {
        title: "Longest Common Prefix",
        difficulty: "Easy",
        description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
        template_code: { python: "def longestCommonPrefix(strs):\n    pass" },
        test_cases: [
            { input: "strs = [\"flower\",\"flow\",\"flight\"]", expected_output: "\"fl\"", is_hidden: false }
        ]
    },
    {
        title: "3Sum",
        difficulty: "Medium",
        description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
        template_code: { python: "def threeSum(nums):\n    pass" },
        test_cases: [
            { input: "nums = [-1,0,1,2,-1,-4]", expected_output: "[[-1,-1,2],[-1,0,1]]", is_hidden: false }
        ]
    },
    {
        title: "Valid Parentheses",
        difficulty: "Easy",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        template_code: { python: "def isValid(s):\n    pass" },
        test_cases: [
            { input: "s = \"()\"", expected_output: "true", is_hidden: false }
        ]
    },
    {
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list.",
        template_code: { python: "def mergeTwoLists(list1, list2):\n    pass" },
        test_cases: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", expected_output: "[1,1,2,3,4,4]", is_hidden: false }
        ]
    },
    {
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        description: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`.",
        template_code: { python: "def search(nums, target):\n    pass" },
        test_cases: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", expected_output: "4", is_hidden: false }
        ]
    },
    {
        title: "Valid Sudoku",
        difficulty: "Medium",
        description: "Determine if a 9 x 9 Sudoku board is valid.",
        template_code: { python: "def isValidSudoku(board):\n    pass" },
        test_cases: [
            { input: "board = [...]", expected_output: "true", is_hidden: false } // Simplified for seed
        ]
    },
    {
        title: "Group Anagrams",
        difficulty: "Medium",
        description: "Given an array of strings `strs`, group the anagrams together.",
        template_code: { python: "def groupAnagrams(strs):\n    pass" },
        test_cases: [
            { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expected_output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", is_hidden: false }
        ]
    },
    {
        title: "Maximum Subarray",
        difficulty: "Medium",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        template_code: { python: "def maxSubArray(nums):\n    pass" },
        test_cases: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expected_output: "6", is_hidden: false }
        ]
    },
    {
        title: "Climbing Stairs",
        difficulty: "Easy",
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        template_code: { python: "def climbStairs(n):\n    pass" },
        test_cases: [
            { input: "n = 3", expected_output: "3", is_hidden: false }
        ]
    },
    {
        title: "Word Search",
        difficulty: "Medium",
        description: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
        template_code: { python: "def exist(board, word):\n    pass" },
        test_cases: [
            { input: "board = [...], word = \"ABCCED\"", expected_output: "true", is_hidden: false }
        ]
    },
    {
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values.",
        template_code: { python: "def levelOrder(root):\n    pass" },
        test_cases: [
            { input: "root = [3,9,20,null,null,15,7]", expected_output: "[[3],[9,20],[15,7]]", is_hidden: false }
        ]
    },
    {
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        description: "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.",
        template_code: { python: "def findKthLargest(nums, k):\n    pass" },
        test_cases: [
            { input: "nums = [3,2,1,5,6,4], k = 2", expected_output: "5", is_hidden: false }
        ]
    },
    {
        title: "Course Schedule",
        difficulty: "Medium",
        description: "There are a total of `numCourses` courses you have to take, labeled from 0 to `numCourses - 1`. You are given an array `prerequisites`...",
        template_code: { python: "def canFinish(numCourses, prerequisites):\n    pass" },
        test_cases: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", expected_output: "true", is_hidden: false }
        ]
    },
    {
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
        template_code: { python: "def mergeKLists(lists):\n    pass" },
        test_cases: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", expected_output: "[1,1,2,3,4,4,5,6]", is_hidden: false }
        ]
    }
];

const seed = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected. Seeding problems...");

        for (const p of problems) {
            // Check if exists
            const [rows] = await connection.execute('SELECT id FROM questions WHERE title = ?', [p.title]);

            let questionId;
            if (rows.length > 0) {
                console.log(`Skipping ${p.title} (already exists)`);
                questionId = rows[0].id;
                // Ideally update test cases but skipping for simplicity if problem exists
                continue;
            } else {
                const [res] = await connection.execute(
                    'INSERT INTO questions (title, description, difficulty, template_code) VALUES (?, ?, ?, ?)',
                    [p.title, p.description, p.difficulty, JSON.stringify(p.template_code)]
                );
                questionId = res.insertId;
                console.log(`Inserted ${p.title} (ID: ${questionId})`);
            }

            // Insert Test Cases
            for (const tc of p.test_cases) {
                await connection.execute(
                    'INSERT INTO test_cases (question_id, input, expected_output, is_hidden) VALUES (?, ?, ?, ?)',
                    [questionId, tc.input, tc.expected_output, tc.is_hidden]
                );
            }
        }
        console.log("Seeding complete.");

    } catch (e) {
        console.error("Error Seeding:", e);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

seed();
