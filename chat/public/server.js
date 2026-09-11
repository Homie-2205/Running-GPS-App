const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Servir los archivos estáticos (guarda tu HTML como index.html en una carpeta llamada 'public')
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let currentRoom = null;

  // 1. Gestión de ingreso a la sala
  socket.on('join-room', (roomId, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    // Límite estricto de 2 personas por sala
    if (numClients >= 2) {
      return callback({ ok: false, error: "La sala está llena (Máximo 2 personas)." });
    }

    currentRoom = roomId;
    socket.join(roomId);

    // Confirmar éxito al cliente actual
    callback({ ok: true });

    // Notificar al cliente existente (si hay uno) para que inicie WebRTC
    socket.to(roomId).emit('peer-joined');

    // Enviar el conteo actualizado de usuarios en la sala
    io.to(roomId).emit('room-users', numClients + 1);
  });

  // 2. Retransmisión de señales WebRTC (ofertas, respuestas e ICE candidates)
  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal', data);
  });

  // 3. Control de salida manual o desconexión abrupta
  socket.on('disconnect', () => {
    if (currentRoom) {
      socket.to(currentRoom).emit('peer-left');
      
      const room = io.sockets.adapter.rooms.get(currentRoom);
      const remainingUsers = room ? room.size : 0;
      io.to(currentRoom).emit('room-users', remainingUsers);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
