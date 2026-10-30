const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for smooth frontend-backend communication
app.use(cors());

// Serve your restaurante.html file at the root URL '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'restaurante.html'));
});

// The API endpoint your button clicks are fetching from
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello World from Node.js!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running! Open your browser at: http://localhost:${PORT}`);
});
