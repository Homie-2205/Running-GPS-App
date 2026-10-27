const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Check if the HTML button sent a request to '/command'
    if (req.url === '/command') {
        console.log("📥 [COMMAND RECEIVED]: The user clicked the button on the HTML page!");
        
        // Respond back to the browser
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Command successfully received by server.js!');
        return;
    }

    // 2. Otherwise, serve the standard HTML file as usual
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        // Handle pages that don't exist
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
