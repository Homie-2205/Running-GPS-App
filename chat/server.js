const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { ChatTokenBuilder } = require('agora-token'); 

const app = express();
const server = http.createServer(app);

// Serve the frontend static assets inside public/
app.use(express.static(path.join(__dirname, '../public')));

// Read configurations securely from the backend environment layer
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

// Secure endpoint to distribute credentials safely to the client side
app.get('/api/get-chat-credentials', (req, res) => {
    try {
        // If your App Certificate is active, generate a dynamic token. 
        // Otherwise, fall back safely to your provided static token parameter.
        let chatToken = config.STATIC_TOKEN;

        if (config.APP_CERTIFICATE && config.APP_CERTIFICATE !== "YOUR_AGORA_APP_CERTIFICATE_SECRET") {
            const expirationInSeconds = 86400; // Token valid for 24 Hours
            chatToken = ChatTokenBuilder.buildAppToken(
                config.APP_ID, 
                config.APP_CERTIFICATE, 
                expirationInSeconds
            );
        }

        res.json({
            appId: config.APP_ID,
            token: chatToken,
            apiKey: config.API_KEY
        });
    } catch (error) {
        console.error("Agora Token configuration fallback error:", error);
        res.status(500).json({ error: "Failed to parse local communication parameters" });
    }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Agora node signaling backend listening on port ${PORT}`));
