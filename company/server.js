const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const OWNER_KEY = process.env.OWNER_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;

let ownerSocket = null;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    socket.on("register-owner", (key) => {
        if (!OWNER_KEY || key !== OWNER_KEY) return;

        if (ownerSocket && ownerSocket !== socket.id) {
            const previous = io.sockets.sockets.get(ownerSocket);
            if (previous) previous.disconnect(true);
        }

        ownerSocket = socket.id;
        socket.emit("status", "Your phone is connected!");
    });

    socket.on("open-mp3", (key) => {
        if (!ACCESS_KEY || key !== ACCESS_KEY) return;

        if (!ownerSocket || !io.sockets.sockets.has(ownerSocket)) {
            socket.emit("status", "Your phone is not connected.");
            return;
        }

        io.to(ownerSocket).emit("open-mp3-on-phone");
        socket.emit("status", "Request sent to your phone.");
    });

    socket.on("disconnect", () => {
        if (ownerSocket === socket.id) {
            ownerSocket = null;
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});