const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 👇 FIX: This explicitly tells the browser to render the file as HTML
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'restaurante.html'));
});

// The API endpoint for your button click
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello World from Node.js!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
