
const axios = require('axios');
const API_URL = 'http://localhost:5000';

const codeCpp = `#include <iostream>
using namespace std;
int main() {
    int n, m;
    // Just fail immediately to check error details
    return 0;
}`;

(async () => {
    try {
        console.log("Fetching Median problem...");
        const res = await axios.get(`${API_URL}/api/coding/questions`);
        // Assuming "Median..." is ID 4 or we search for it.
        // Or "Two Sum" validation is fine too, as long as we trigger submit logic.
        // Let's use "Two Sum" (ID 1) as we know inputs are there.
        const problem = res.data.find(q => q.title === 'Two Sum');

        console.log("Submitting code specifically to fail...");
        const submitRes = await axios.post(`${API_URL}/api/coding/submit`, {
            user_id: 1, // Mock
            question_id: problem.id,
            code: codeCpp,
            language: 'cpp'
        });

        console.log("Submit Response:", JSON.stringify(submitRes.data, null, 2));

    } catch (err) {
        if (err.response) {
            console.error("Submit Error:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    }
})();
