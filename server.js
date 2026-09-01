const express = require("express");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Node.js + FFmpeg server is running!");
});

app.get("/ffmpeg-test", (req, res) => {
    ffmpeg.getAvailableCodecs((err, codecs) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "FFmpeg is working!",
            codecs: Object.keys(codecs).length
        });
    });
});

app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
