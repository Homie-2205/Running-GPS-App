const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS settings allowed for production environments
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Serve your local files (index2.html, player.html, and bill.mp3) 
app.use(express.static(__dirname));

// Route explicitly serving index2.html as the primary landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index2.html'));
});

// Route explicitly serving player.html
app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'player.html'));
});

io.on('connection', (socket) => {
    console.log('Device connected:', socket.id);

    // Listen for the play command from Device A (Controller)
    socket.on('send-play-signal', (data) => {
        console.log('Play signal received. Broadcasting to all devices...');
        // Broadcast the signal to Device B (Speaker)
        io.emit('receive-play-signal', data);
    });

    socket.on('disconnect', () => {
        console.log('Device disconnected:', socket.id);
    });
});

// CRITICAL FOR RENDER: Dynamically binds to Render's environment port or defaults to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
