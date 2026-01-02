
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

const problemConstraints = {
    "Two Sum": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    "Add Two Numbers": ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "It is guaranteed that the list represents a number that does not have leading zeros."],
    "Median of Two Sorted Arrays": ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums1[i], nums2[i] <= 10^6"],
    "Longest Substring Without Repeating Characters": ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    "Reverse Integer": ["-2^31 <= x <= 2^31 - 1"],
    "Palindrome Number": ["-2^31 <= x <= 2^31 - 1"],
    "Longest Common Prefix": ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
    "3Sum": ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    "Valid Parentheses": ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    "Merge Two Sorted Lists": ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."],
    "Search in Rotated Sorted Array": ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique.", "nums is an ascending array that is possibly rotated.", "-10^4 <= target <= 10^4"],
    "Valid Sudoku": ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit 1-9 or '.'."],
    "Group Anagrams": ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    "Maximum Subarray": ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    "Climbing Stairs": ["1 <= n <= 45"],
    "Word Search": ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15", "board and word consists of only lowercase and uppercase English letters."],
    "Binary Tree Level Order Traversal": ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
    "Kth Largest Element in an Array": ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    "Course Schedule": ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses", "All the pairs prerequisites[i] are unique."],
    "Merge k Sorted Lists": ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order.", "The sum of lists[i].length will not exceed 10^4."]
};

const updateConstraints = async () => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected. Updating constraints...");

        for (const [title, constraints] of Object.entries(problemConstraints)) {
            const [result] = await connection.execute(
                'UPDATE questions SET constraints = ? WHERE title = ?',
                [JSON.stringify(constraints), title]
            );
            if (result.affectedRows > 0) {
                console.log(`Updated constraints for: ${title}`);
            } else {
                console.log(`Warning: Question not found: ${title}`);
            }
        }
        console.log("Constraints update complete.");

    } catch (e) {
        console.error("Error updating constraints:", e);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

updateConstraints();
