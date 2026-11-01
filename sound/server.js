import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve player.html when someone visits the main URL "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'player.html'));
});

// Render dynamically sets the PORT
const PORT = process.env.PORT || 3000;

// Listen on 0.0.0.0 to allow Render to route external traffic to your app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
