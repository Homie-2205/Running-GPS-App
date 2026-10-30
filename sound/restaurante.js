const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 1. API endpoint that provides the message
  if (req.url === '/api/message') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Hello World from Node.js!" }));
  } 
  // 2. Route to serve the HTML file
  else if (req.url === '/' || req.url === '/sound/restaurante.html') {
    fs.readFile(path.join(__dirname, 'sound', 'restaurante.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading restaurante.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  // 3. 404 handler
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
