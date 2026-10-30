const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from the backend on Render!\n');
});

// Render provides the PORT dynamically, defaulting to 10000 if local
const PORT = process.env.PORT || 10000; 

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
