const express = require('express');
const path = require('path');
const app = express();

// Render dynamically assigns an available port via process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CRITICAL UPDATE: Serves static assets directly from your "sound" folder
app.use(express.static(path.join(__dirname, 'sound')));

// Array to track active Server-Sent Events (SSE) connections
let clients = [];

// Real-time server events streaming route
app.get('/events', (req, res) => {
    // Standard streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // CRITICAL FOR RENDER: Disables proxy response buffering 
    // This forces Render's Nginx layer to send events instantly instead of bundling them
    res.setHeader('X-Accel-Buffering', 'no');

    // Add this active connection to our broadcasting pool
    clients.push(res);

    // Keep the connection alive on Render infrastructure by sending a subtle initial comment heartbeat
    res.write(': ok\n\n');

    // Safely remove connection pool items when a user closes a browser tab or navigates away
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// Endpoint to trigger a brand-new notification event broadcast
app.post('/trigger-notification', (req, res) => {
    const message = req.body.message || "New Notification Event!";
    
    // Efficiently dispatch payload out to all connected clients
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify({ message })}\n\n`);
    });
    
    res.status(200).json({ success: true, clientsNotified: clients.length });
});

// Explicitly route anything else back to your client template interface inside the sound folder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'sound', 'index.html'));
});

// Listen on the dynamic platform port instead of a hardcoded local host value
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Notification backend successfully initialized and listening on port ${PORT}`);
});
