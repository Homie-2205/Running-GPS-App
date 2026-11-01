const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Example backend notification
app.get('/send-test', (req, res) => {
  io.emit('notification', {
    title: 'Test Notification',
    message: 'This is a notification sent by the backend'
  });
  res.json({ success: true, message: 'Notification sent' });
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Example notification after client connects
  setTimeout(() => {
    socket.emit('notification', {
      title: 'Welcome',
      message: 'Connected to the sound server'
    });
  }, 1000);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
