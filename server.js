const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir archivos de la aplicación
app.use(express.static(path.join(__dirname)));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Test FFmpeg
app.get('/ffmpeg-test', (req, res) => {
    ffmpeg.getAvailableCodecs((err, codecs) => {
        if (err) {
            console.error('FFmpeg error:', err);

            return res.status(500).json({
                success: false,
                error: 'FFmpeg is not detected or failing.',
                details: err.message
            });
        }

        res.json({
            success: true,
            status: 'FFmpeg is fully operational!',
            total_codecs_supported: Object.keys(codecs).length
        });
    });
});

app.listen(PORT, () => {
    console.log(Server is successfully listening on port ${PORT});
});
