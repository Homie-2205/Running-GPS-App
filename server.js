const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve files from the repo root so pages like index2.html and player.html load normally
app.use(express.static(path.join(__dirname)));

// Optional: expose common media folders explicitly for Render
app.use('/sound', express.static(path.join(__dirname, 'sound')));
app.use('/repartidor', express.static(path.join(__dirname, 'repartidor')));

// Health check for Render deployment
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music server is running' });
});

// Serve the mp3 file from whichever folder exists
app.get('/repartidor/bill.mp3', (req, res) => {
  const possibleFiles = [
    path.join(__dirname, 'repartidor', 'bill.mp3'),
    path.join(__dirname, 'sound', 'bill.mp3'),
    path.join(__dirname, 'bill.mp3')
  ];

  const filePath = possibleFiles.find((candidate) => {
    try {
      return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
    } catch (error) {
      return false;
    }
  });

  if (!filePath) {
    return res.status(404).json({
      error: 'bill.mp3 not found.',
      message: 'Place the file in /repartidor/bill.mp3, /sound/bill.mp3, or the repo root before loading the page.'
    });
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', fs.statSync(filePath).size);
  fs.createReadStream(filePath).pipe(res);
});

// Also allow direct access to the same file at /sound/bill.mp3 for browser audio tags
app.get('/sound/bill.mp3', (req, res) => {
  const filePath = [
    path.join(__dirname, 'sound', 'bill.mp3'),
    path.join(__dirname, 'repartidor', 'bill.mp3'),
    path.join(__dirname, 'bill.mp3')
  ].find((candidate) => fs.existsSync(candidate));

  if (!filePath) {
    return res.status(404).json({ error: 'bill.mp3 not found.' });
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', fs.statSync(filePath).size);
  fs.createReadStream(filePath).pipe(res);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
