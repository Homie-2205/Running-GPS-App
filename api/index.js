const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Tell fluent-ffmpeg to use the precompiled static binary
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const app = express();

// Health check endpoint
app.get('/', (req, res) => {
  res.send('FFmpeg server is running on Vercel!');
});

// Video to MP3 Conversion Endpoint
app.post('/api/convert', (req, res) => {
  // Config formidable to write incoming files to /tmp
  const form = formidable({
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing upload file.' });
    }

    const uploadedFile = files.file ? files.file[0] : null;
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const inputPath = uploadedFile.filepath;
    const outputPath = path.join('/tmp', output-${Date.now()}.mp3);

    // Run FFmpeg conversion
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => {
        // Send processed file back to client
        res.download(outputPath, 'converted.mp3', () => {
          // Clean up temp files from /tmp after download
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
      })
      .on('error', (ffmpegErr) => {
        console.error('FFmpeg Error:', ffmpegErr);
        // Clean up temp input file on error
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        res.status(500).json({
          error: 'FFmpeg conversion failed.',
          details: ffmpegErr.message,
        });
      })
      .save(outputPath);
  });
});

// Export app for Vercel Serverless Function deployment
module.exports = app;
