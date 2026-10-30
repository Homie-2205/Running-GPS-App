const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Render dynamically provides a PORT variable. If it's missing, it defaults to 3000 locally.
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve restaurante.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'restaurante.html'));
});

// The API endpoint for your button click
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello World from Node.js!" });
});

// Start the server using Render's assigned port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
