const express = require('express');
const path = require('path');
const app = express();

// Render sets process.env.PORT automatically. Fall back to 3000 for local testing.
const PORT = process.env.PORT || 3000; 

// Serve your static HTML file automatically
app.use(express.static(__dirname));

// The API endpoint your frontend script fetches
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello World from Node.js!" });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
