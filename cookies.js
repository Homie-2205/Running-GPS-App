const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000; // Render provides the port automatically
const FILE_PATH = path.join(__dirname, 'file.html');

let isAvailable = true;

function getHtmlTemplate(status, embeddedHtml) {
  const statusText = status ? 'AVAILABLE' : 'UNAVAILABLE';
  const badgeColor = status ? '#22c55e' : '#ef4444';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Status Board</title>
      <style>
        body { font-family: sans-serif; background-color: #f3f4f6; padding: 2rem; margin: 0; }
        .status-container { display: flex; justify-content: space-between; align-items: center; background: white; padding: 1rem 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .badge { padding: 0.5rem 1.5rem; font-weight: bold; color: white; border-radius: 50px; background-color: ${badgeColor}; }
        .btn { padding: 0.5rem 1rem; background: #4b5563; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .content-area { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="status-container">
        <div>Current Status: <span class="badge">${statusText}</span></div>
        <form action="/toggle" method="POST" style="margin: 0;">
          <button type="submit" class="btn">Toggle Status</button>
        </form>
      </div>
      <div class="content-area">
        ${embeddedHtml}
      </div>
    </body>
    </html>
  `;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/toggle') {
    isAvailable = !isAvailable;
    res.writeHead(303, { 'Location': '/' });
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(FILE_PATH, 'utf8', (err, htmlContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error loading file.html from root directory.');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getHtmlTemplate(isAvailable, htmlContent));
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
