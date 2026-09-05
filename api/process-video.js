import { spawn } from 'child_process';
import videoTasks from './tasks-store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Generate a unique ID for this specific FFmpeg job
  const taskId = `task_${Date.now()}`;
  
  // Initialize the task status
  videoTasks[taskId] = { status: 'processing', progress: 0, error: null, videoUrl: null };

  // 2. Define your FFmpeg arguments (Example: combining images or compressing)
  const ffmpegArgs = [
    '-i', 'input.mp4', 
    '-vf', 'scale=1280:720', // Example filter
    '-y', 'output.mp4'
  ];

  // 3. Spawn FFmpeg as a background child process
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  // 4. Read FFmpeg's console output to calculate progress
  ffmpeg.stderr.on('data', (data) => {
    const output = data.toString();
    
    // FFmpeg logs time duration (e.g., time=00:01:23.45). 
    // You can parse this text to calculate percentage.
    // For this example, we'll simulate an incremental progress update:
    if (videoTasks[taskId].progress < 95) {
      videoTasks[taskId].progress += 5; 
    }
  });

  // 5. Handle process completion
  ffmpeg.on('close', (code) => {
    if (code === 0) {
      videoTasks[taskId].status = 'completed';
      videoTasks[taskId].progress = 100;
      videoTasks[taskId].videoUrl = '/exports/output.mp4'; // Path to finished video
    } else {
      videoTasks[taskId].status = 'failed';
      videoTasks[taskId].error = 'FFmpeg exited with an error code.';
    }
  });

  // 6. IMMEDIATELY respond to frontend with the ID. Do not wait for FFmpeg to finish!
  return res.status(202).json({ 
    message: 'Video processing started in background.', 
    taskId: taskId 
  });
}
import { spawn } from 'child_process';
import videoTasks from './tasks-store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Generate a unique ID for this specific FFmpeg job
  const taskId = `task_${Date.now()}`;
  
  // Initialize the task status
  videoTasks[taskId] = { status: 'processing', progress: 0, error: null, videoUrl: null };

  // 2. Define your FFmpeg arguments (Example: combining images or compressing)
  const ffmpegArgs = [
    '-i', 'input.mp4', 
    '-vf', 'scale=1280:720', // Example filter
    '-y', 'output.mp4'
  ];

  // 3. Spawn FFmpeg as a background child process
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  // 4. Read FFmpeg's console output to calculate progress
  ffmpeg.stderr.on('data', (data) => {
    const output = data.toString();
    
    // FFmpeg logs time duration (e.g., time=00:01:23.45). 
    // You can parse this text to calculate percentage.
    // For this example, we'll simulate an incremental progress update:
    if (videoTasks[taskId].progress < 95) {
      videoTasks[taskId].progress += 5; 
    }
  });

  // 5. Handle process completion
  ffmpeg.on('close', (code) => {
    if (code === 0) {
      videoTasks[taskId].status = 'completed';
      videoTasks[taskId].progress = 100;
      videoTasks[taskId].videoUrl = '/exports/output.mp4'; // Path to finished video
    } else {
      videoTasks[taskId].status = 'failed';
      videoTasks[taskId].error = 'FFmpeg exited with an error code.';
    }
  });

  // 6. IMMEDIATELY respond to frontend with the ID. Do not wait for FFmpeg to finish!
  return res.status(202).json({ 
    message: 'Video processing started in background.', 
    taskId: taskId 
  });
}
