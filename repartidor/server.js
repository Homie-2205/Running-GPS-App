const express = require('express');
const path = require('path');
const app = express();

// Render dynamically assigns a port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// In-memory variable to hold the status
let currentStatus = 'unavailable';

app.use("/repartidor", express.static(__dirname));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// In-memory variable to store the status
let globalStatus = 'available';

// The 3-digit security code configuration
const SECRET_PIN = "220"; 

// GET endpoint to fetch current status
app.get('/api/get-status', (req, res) => {
    res.json({ status: globalStatus });
});

// POST endpoint to toggle/update status with PIN validation
app.post('/api/update-status', (req, res) => {
    const { status, pin } = req.body;
    
    // 1. Validate the specific 3-digit security code
    if (pin !== SECRET_PIN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid security code.' });
    }

    // 2. Validate input values
    if (status === 'available' || status === 'unavailable') {
        globalStatus = status;
        return res.status(200).json({ message: 'Status updated successfully', status: globalStatus });
    }
    
    res.status(400).json({ error: 'Invalid status value' });
});

// Fallback route to explicitly serve repartidor.html from the root folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

