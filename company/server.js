const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve all static files from the repo root so the site loads normally
app.use(express.static(path.join(__dirname)));

// Serve the audio file in /repartidor/bill.mp3
app.get('/repartidor/bill.mp3', (req, res) => {
  const filePath = path.join(__dirname, 'repartidor', 'bill.mp3');

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return res.status(404).json({
        error: 'bill.mp3 not found.',
        message: 'Place the file at /repartidor/bill.mp3 before loading this page.'
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
