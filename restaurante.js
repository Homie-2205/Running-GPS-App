const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Check if the button sent a command request
    if (req.url === '/command') {
        console.log("📥 [COMMAND RECEIVED]: The user clicked the button on the restaurante HTML page!");
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Command successfully received by restaurante.js!');
        return;
    }

    // 2. Serve the restaurante.html file
    if (req.url === '/' || req.url === '/restaurante.html') {
        const filePath = path.join(__dirname, 'restaurante.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Internal Server Error: Missing restaurante.html file');
                return;
            }
            // CRITICAL FIX: Explicitly tell the browser this is an HTML website document
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
