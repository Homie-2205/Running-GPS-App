const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main route
app.get('/', (req, res) => {
    res.send('Video processing server is running online!');
});

// Test route to verify FFmpeg works on Render
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
            status: "FFmpeg is fully operational on Render!", 
            total_codecs_supported: Object.keys(codecs).length 
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is successfully listening on port ${PORT}`);
});
