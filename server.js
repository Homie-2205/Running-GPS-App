const express = require('express');
const multer  = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
const upload = multer({ dest: '/tmp/' }); // Render's temporary directory

app.post('/api/convert', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `/tmp/output-${Date.now()}.mp4`;

  ffmpeg(inputPath)
    .outputOptions([
      '-preset ultrafast', // Saves RAM and CPU
      '-threads 1',         // Prevents overloading the free tier CPU
      '-vf scale=480:-1'    // Lowers resolution to prevent OOM crash
    ])
    .output(outputPath)
    .on('end', () => {
      // Stream the finished file back to the browser user
      res.download(outputPath, 'converted.mp4', () => {
        // Always clean up files to keep RAM/disk clear
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Conversion failed due to resource limits.');
    })
    .run();
});

app.listen(process.env.PORT || 3000);
