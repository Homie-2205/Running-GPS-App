const express = require('express');
const cors = require('cors'); 
const { ChatTokenBuilder } = require('agora-token');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) 
app.use(cors()); 

// Your exact Agora App ID and Certificate placed natively in the right variables
const APP_ID = "e4fd483a899746719051a0cfe66641c5";
const APP_CERTIFICATE = "f19c4cf8a16a4799815ec2add961133d";

// Health check endpoint to verify your Render server is up and running
app.get('/', (req, res) => {
    res.send('Agora Token Server is online!');
});

// The Token API Endpoint that your index.html will talk to
app.get('/api/chat-token', (req, res) => {
    const userId = req.query.userId;
    
    // Validate that a username/userId was sent in the request
    if (!userId) {
        return res.status(400).json({ error: 'userId parameter is required' });
    }

    if (!APP_ID || !APP_CERTIFICATE) {
        return res.status(500).json({ error: 'Server configuration missing. Check backend credentials.' });
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

// Bind to the dynamic port Render provides automatically
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
