const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "company")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "index.html"));
});

app.get("/receiver", (req, res) => {
    res.sendFile(path.join(__dirname,  "receiver.html"));
});

io.on("connection", (socket) => {
    socket.on("register-samsung", () => {
        socket.join("samsung");
        socket.emit("receiver-status", "Samsung connected.");
    });
});

app.post("/open-mp3", (req, res) => {
    const receivers = io.sockets.adapter.rooms.get("samsung");

    if (!receivers || receivers.size === 0) {
        return res.status(404).json({
            success: false,
            message: "Your Samsung is not connected. Open the receiver page first."
        });
    }

    io.to("samsung").emit("open-mp3");

    res.json({
        success: true,
        message: "MP3 command sent to your connected Samsung."
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "online" });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
