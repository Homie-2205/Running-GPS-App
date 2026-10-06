require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { RtmTokenBuilder, RtmRole } = require('agora-access-token');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const rooms = new Map();
const AGORA_APP_ID = process.env.AGORA_APP_ID || 'e4fd483a899746719051a0cfe66641c5';
const AGORA_CERTIFICATE = process.env.AGORA_CERTIFICATE || 'f19c4cf8a16a4799815ec2add961133d';

app.get('/api/agora-config', (req, res) => {
  res.json({
    appId: AGORA_APP_ID,
    tokenEndpoint: '/api/agora-token'
  });
});

app.post('/api/agora-token', (req, res) => {
  const uid = String(req.body?.uid || '').trim();

  if (!uid) {
    return res.status(400).json({ message: 'uid is required' });
  }

  if (!AGORA_APP_ID || !AGORA_CERTIFICATE) {
    return res.status(500).json({
      message: 'Missing AGORA_APP_ID or AGORA_CERTIFICATE. Set them in your environment variables.'
    });
  }

  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + 3600;

    const token = RtmTokenBuilder.buildToken(
      AGORA_APP_ID,
      AGORA_CERTIFICATE,
      uid,
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    return res.json({ token });
  } catch (error) {
    console.error('Error generating RTM token:', error);
    return res.status(500).json({ message: 'Failed to generate Agora token' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatagora.html'));
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, callback) => {
    roomId = String(roomId || '').trim();

    if (!/^[A-Za-z0-9_-]{4,40}$/.test(roomId)) {
      return callback?.({ ok: false, error: 'Código de sala inválido.' });
    }

    const room = rooms.get(roomId) || new Set();

    if (room.size >= 2) {
      return callback?.({ ok: false, error: 'La sala ya tiene 2 personas.' });
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    room.add(socket.id);
    rooms.set(roomId, room);

    callback?.({ ok: true, users: room.size });

    socket.to(roomId).emit('peer-joined');
    io.to(roomId).emit('room-users', room.size);
  });

  socket.on('signal', ({ roomId, data }) => {
    if (socket.data.roomId === roomId) {
      socket.to(roomId).emit('signal', data);
    }
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.delete(socket.id);
    if (room.size === 0) rooms.delete(roomId);
    else io.to(roomId).emit('peer-left');

    if (room) io.to(roomId).emit('room-users', room.size);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
