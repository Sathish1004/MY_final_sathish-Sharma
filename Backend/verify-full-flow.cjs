
const axios = require('axios');

const API_URL = 'http://localhost:5000';

const codeCpp = `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    while (cin >> n) {
        cout << n << " ";
    }
    return 0;
}`;

(async () => {
    try {
        // 1. Fetch Questions (mimicking Frontend fetchProblems)
        console.log("Fetching questions...");
        const res = await axios.get(`${API_URL}/api/coding/questions`);
        const questions = res.data;

        // 2. Find "Two Sum" or any problem with examples
        // Let's use "Two Sum" as it had the cleaned inputs
        const problem = questions.find(q => q.title === 'Two Sum');
        if (!problem) {
            console.error("Two Sum not found!");
            return;
        }

        console.log(`\nFound Problem: ${problem.title} (ID: ${problem.id})`);
        console.log(`Examples count: ${problem.examples.length}`);

        // 3. Inspect Examples (Verify they are cleaned)
        problem.examples.forEach((ex, i) => {
            console.log(`\n--- Example ${i + 1} ---`);
            console.log(`Input (Raw):\n${JSON.stringify(ex.input)}`);
            // We expect "2 7 11 15\n9" (clean) not "nums = ... "
        });

        // 4. Construct Payload for Run (mimicking handleRunCode)
        const testCases = problem.examples.map(ex => ({
            input: ex.input,
            expected_output: ex.output
        }));

        const payload = {
            code: codeCpp,
            language: 'cpp',
            testCases: testCases
        };

        console.log("\nSending /run payload...");
        const runRes = await axios.post(`${API_URL}/api/coding/run`, payload);

        // 5. Check Results
        const results = runRes.data.results;
        console.log("\nRun Results:");
        results.forEach((r, i) => {
            console.log(`\n--- Result ${i + 1} ---`);
            console.log(`Input Used: ${JSON.stringify(r.input)}`);
            console.log(`Output: ${JSON.stringify(r.output)}`);
            console.log(`Status: ${r.status} (Passed: ${r.passed})`);
        });

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
})();
