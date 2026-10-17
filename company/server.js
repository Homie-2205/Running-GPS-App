const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "render-mp3-receiver" });
});

io.on("connection", (socket) => {
  socket.on("owner:join", () => {
    socket.join("owner-receivers");
    socket.emit("server:status", "Este celular está conectado como receptor.");
  });

  socket.on("visitor:call", () => {
    const room = io.sockets.adapter.rooms.get("owner-receivers");
    const receiverConnected = !!room && room.size > 0;

    io.to("owner-receivers").emit("owner:play-sound", {
      requestedAt: new Date().toISOString()
    });

    socket.emit("visitor:result", {
      receiverConnected,
      message: receiverConnected
        ? "Solicitud enviada al celular receptor."
        : "No hay un celular receptor conectado. Abre la página en tu celular y activa el modo receptor."
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
