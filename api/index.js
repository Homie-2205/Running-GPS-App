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

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing upload file.' });
    }

    // Formidable v3 wraps file properties in arrays
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const inputPath = uploadedFile.filepath;
    // FIXED: Added backticks for template literal evaluation
    const outputPath = path.join('/tmp', `output-${Date.now()}.mp3`);

    // Run FFmpeg conversion
    ffmpeg(inputPath)
      .toFormat('mp3')
      .audioBitrate('128k') // Ensures standard compression compatibility
      .on('end', () => {
        // Send processed file back to client
        res.download(outputPath, 'converted.mp3', (downloadErr) => {
          // Clean up temp files from /tmp after download finishes or errors
          try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          } catch (cleanupErr) {
            console.error('Cleanup Error:', cleanupErr);
          }
        });
      })
      .on('error', (ffmpegErr) => {
        console.error('FFmpeg Error:', ffmpegErr);
        // Clean up temp input file on error
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupErr) {
          console.error('Cleanup Error:', cleanupErr);
        }

        // Avoid sending headers twice if they are already sent
        if (!res.headersSent) {
          res.status(500).json({
            error: 'FFmpeg conversion failed.',
            details: ffmpegErr.message,
          });
        }
      })
      .save(outputPath);
  });
});

// Export app for Vercel Serverless Function deployment
module.exports = app;
