// server.js - Express + Socket.IO simple signaling server
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Serve the static client
app.use(express.static(path.join(__dirname, 'public_root')));

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    const otherCount = clients.length - 1;
    // If first in room: not initiator. Second becomes initiator? We decide initiator = (otherCount === 1) false/true
    // Simpler: let the first to join be initiator if other present logic reversed in client
    const isInitiator = (otherCount === 1) ? true : (otherCount === 0 ? false : false);
    // We will signal to the joiner that they've joined. If there is already someone there,
    // the joiner needs to start offer/answer exchange — we'll make the joiner the initiator (who creates offer).
    socket.emit('joined', otherCount >= 1); // send true if there is already someone => createOffer
    socket.to(room).emit('peer-joined'); // notify others
    console.log(`${socket.id} joined room ${room} (others: ${otherCount})`);
  });

  socket.on('offer', ({ room, offer }) => {
    socket.to(room).emit('offer', { offer });
  });

  socket.on('answer', ({ room, answer }) => {
    socket.to(room).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ room, candidate }) => {
    socket.to(room).emit('ice-candidate', { candidate });
  });

  socket.on('leave', (room) => {
    socket.leave(room);
    socket.to(room).emit('peer-left');
    console.log(`${socket.id} left room ${room}`);
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(r => {
      socket.to(r).emit('peer-left');
    });
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Signaling server running on http://localhost:${PORT}`));
