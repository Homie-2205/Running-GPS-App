const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const receivers = new Set();

app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    receivers.add(res);

    req.on("close", () => {
        receivers.delete(res);
    });
});

app.post("/open-mp3", (req, res) => {
    for (const receiver of receivers) {
        receiver.write("data: OPEN_MP3\n\n");
    }

    res.json({
        success: true,
        message: "Request sent to connected receivers."
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});