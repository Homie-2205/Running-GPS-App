import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OPTION 1: Expose an entire folder (e.g., "public") for static assets like MP3s, CSS, or JS
// Place your bill.mp3 inside a folder named "public" next to this script
app.use(express.static(path.join(__dirname, 'public')));

// Serve player.html when someone visits the main URL "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'player.html'));
});

// OPTION 2: Create a specific endpoint just for your MP3 file
// Place bill.mp3 in the same directory as this server file
app.get('/audio', (req, res) => {
    res.sendFile(path.join(__dirname, 'bill.mp3'));
});

// Render dynamically sets the PORT
const PORT = process.env.PORT || 3000;

// Listen on 0.0.0.0 to allow Render to route external traffic to your app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
