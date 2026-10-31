const express = require('express');
const path = require('path');
const app = express();

// Render dynamically assigns a port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// In-memory variable to hold the status
let currentStatus = 'unavailable';

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Endpoint: Get current status
app.get('/api/get-status', (req, res) => {
    res.json({ status: currentStatus });
});

// API Endpoint: Update status
app.post('/api/update-status', (req, res) => {
    const { status } = req.body;
    
    if (status === 'available' || status === 'unavailable') {
        currentStatus = status;
        console.log(`Status updated to: ${currentStatus}`);
        res.json({ success: true, status: currentStatus });
    } else {
        res.status(400).json({ error: 'Invalid status' });
    }
});

// Explicitly bind to 0.0.0.0 for Render deployment compatibility
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
