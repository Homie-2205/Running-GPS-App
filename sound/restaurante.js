const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 1. When the button asks the server for the message data
  if (req.url === '/api/message') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Hello World from Node.js!" }));
  } 
  // 2. When you first load http://localhost:3000/
  else if (req.url === '/' || req.url === '/restaurante.html') {
    fs.readFile(path.join(__dirname, 'restaurante.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading restaurante.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  // 3. If someone looks for a page that doesn't exist
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
