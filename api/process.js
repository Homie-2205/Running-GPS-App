import { execFile } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Expect external URLs to bypass Vercel's 4.5MB payload limit
  const { inputUrl, outputS3Url } = req.body; 

  if (!inputUrl) {
    return res.status(400).json({ error: 'Missing inputUrl' });
  }

  // Example command: Extract a 5-second thumbnail from a video URL
  const args = [
    '-ss', '00:00:02', 
    '-i', inputUrl, 
    '-vframes', '1', 
    '-q:v', '2', 
    '-f', 'image2pipe', 
    'pipe:1'
  ];

  execFile(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, details: stderr });
    }
    
    // Return or stream the processed buffer (if under 4.5MB)
    res.setHeader('Content-Type', 'image/jpeg');
    return res.status(200).send(stdout);
  });
}
