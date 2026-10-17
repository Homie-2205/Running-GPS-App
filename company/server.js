const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// Configure these two environment variables in Render.
const ACCESS_KEY = process.env.ACCESS_KEY;
const OWNER_KEY = process.env.OWNER_KEY;

if (!ACCESS_KEY || !OWNER_KEY) {
    console.error("Set ACCESS_KEY and OWNER_KEY in Render.");
    process.exit(1);
}

const ownerRoom = "private-owner-" +
    crypto.createHash("sha256")
        .update(OWNER_KEY)
        .digest("hex");

app.get("/health", (req, res) => {
    res.json({
        status: "online",
        service: "compani"
    });
});

io.on("connection", (socket) => {

    console.log("Device connected:", socket.id);

    socket.on("register-owner", (key) => {
        if (
            typeof key !== "string" ||
            key.length !== OWNER_KEY.length ||
            !crypto.timingSafeEqual(
                Buffer.from(key),
                Buffer.from(OWNER_KEY)
            )
        ) {
            socket.emit("registration-error", "Invalid owner key.");
            return;
        }

        socket.join(ownerRoom);
        socket.data.isOwner = true;

        socket.emit("owner-ready");
        console.log("Owner phone registered.");
    });

    socket.on("play-on-owner", (key) => {
        if (
            typeof key !== "string" ||
            key.length !== ACCESS_KEY.length ||
            !crypto.timingSafeEqual(
                Buffer.from(key),
                Buffer.from(ACCESS_KEY)
            )
        ) {
            socket.emit("command-result", {
                success: false,
                message: "Invalid access key."
            });
            return;
        }

        const receivers = io.sockets.adapter.rooms.get(ownerRoom);

        if (!receivers || receivers.size === 0) {
            socket.emit("command-result", {
                success: false,
                message: "Owner phone is not connected."
            });
            return;
        }

        io.to(ownerRoom).emit("play-mp3");

        socket.emit("command-result", {
            success: true,
            message: "Playback command sent to the owner phone."
        });
    });

    socket.on("disconnect", () => {
        console.log("Device disconnected:", socket.id);
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Compani server running on port ${PORT}`);
});