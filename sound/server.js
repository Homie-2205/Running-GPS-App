const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Active client connections array
let clients = [];

// 1. Root route to serve your frontend HTML file (or health check)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      // Fallback if you don't have an index.html file ready yet
      res.status(200).send('Server is running! SSE endpoint ready at /events');
    }
  });
});

// 2. Server-Sent Events endpoint
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  // Add client connection to the list
  clients.push(res);
  console.log(`Client connected. Total clients: ${clients.length}`);

  // Clean up on user disconnect
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    console.log(`Client disconnected. Total clients: ${clients.length}`);
  });
});

// 3. API endpoint to trigger a notification
app.post('/notify', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message payload is required' });
  }

  const sseFormattedData = `data: ${JSON.stringify({ message, timestamp: new Date() })}\n\n`;

  // Send message to all connected browsers
  clients.forEach(client => client.write(sseFormattedData));

  res.status(200).json({ success: true, sentTo: clients.length });
});

// 4. Start Server (Only called ONCE)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
