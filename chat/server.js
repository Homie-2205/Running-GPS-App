const express = require('express');
const { ChatTokenBuilder } = require('agora-token');

const app = express();

// 1. Enable Cross-Origin Resource Sharing (CORS) 
// This allows your frontend (index.html) to safely communicate with this backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 2. Fetch credentials safely from Render's Environment Variables
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Health check endpoint to verify your Render server is up and running
app.get('/', (req, res) => {
    res.send('Agora Token Server is online!');
});

// 3. The Token API Endpoint that your index.html will talk to
app.get('/api/chat-token', (req, res) => {
    const userId = req.query.userId;
    
    // Validate that a username/userId was sent in the request
    if (!userId) {
        return res.status(400).json({ error: 'userId parameter is required' });
    }

    if (!APP_ID || !APP_CERTIFICATE) {
        return res.status(500).json({ error: 'Server configuration missing. Check environment variables.' });
    }

    const expirationInSeconds = 86400; // Token valid for 24 hours

    try {
        // Build the cryptographic token using Agora's core algorithm
        const token = ChatTokenBuilder.buildUserToken(
            APP_ID,
            APP_CERTIFICATE,
            userId,
            expirationInSeconds
        );
        
        // Return the token securely back to the frontend
        return res.json({ token: token });
    } catch (error) {
        console.error('Error generating token:', error);
        return res.status(500).json({ error: 'Token generation failed' });
    }
});

// 4. CRUCIAL FOR RENDER: Bind to the dynamic port Render provides automatically
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
