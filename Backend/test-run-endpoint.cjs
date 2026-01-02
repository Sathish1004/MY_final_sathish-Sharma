
const axios = require('axios');

async function testRun() {
    try {
        const payload = {
            code: "#include <iostream>\nusing namespace std;\nint main() { int a, b; cin >> a; while(cin >> b) a+=b; cout << a; return 0; }",
            language: "cpp",
            testCases: [
                { input: "2 7 11 15\n9", expected_output: "44" } // Sum of all numbers just to test input reading
            ]
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        const res = await axios.post('http://localhost:5000/api/coding/run', payload);
        console.log("Response:", JSON.stringify(res.data, null, 2));

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

testRun();
