const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, callback) => {
    roomId = String(roomId || "").trim();

    if (!/^[A-Za-z0-9_-]{4,40}$/.test(roomId)) {
      return callback?.({ ok: false, error: "Código de sala inválido." });
    }

    const room = rooms.get(roomId) || new Set();

    if (room.size >= 2) {
      return callback?.({ ok: false, error: "La sala ya tiene 2 personas." });
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    room.add(socket.id);
    rooms.set(roomId, room);

    callback?.({ ok: true, users: room.size });

    socket.to(roomId).emit("peer-joined");
    io.to(roomId).emit("room-users", room.size);
  });

  socket.on("signal", ({ roomId, data }) => {
    if (socket.data.roomId === roomId) {
      socket.to(roomId).emit("signal", data);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.delete(socket.id);
    if (room.size === 0) rooms.delete(roomId);
    else io.to(roomId).emit("peer-left");

    if (room) io.to(roomId).emit("room-users", room.size);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
