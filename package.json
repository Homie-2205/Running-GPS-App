const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Set FFmpeg path (optional, if FFmpeg is not in your PATH)
// ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
// ffmpeg.setFfprobePath('/usr/bin/ffprobe');

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FFmpeg Video Processing Server' });
});

// Example: Convert video format
app.post('/convert', (req, res) => {
  const { inputFile, outputFile, format } = req.body;

  ffmpeg(inputFile)
    .output(outputFile)
    .on('end', () => {
      res.json({ success: true, message: 'Video converted successfully', outputFile });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// Example: Compress video
app.post('/compress', (req, res) => {
  const { inputFile, outputFile } = req.body;

  ffmpeg(inputFile)
    .output(outputFile)
    .videoCodec('libx264')
    .audioCodec('aac')
    .on('end', () => {
      res.json({ success: true, message: 'Video compressed successfully', outputFile });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
