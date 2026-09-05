import videoTasks from './tasks-store';

export default async function handler(req, res) {
  const { taskId } = req.query;

  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId parameter' });
  }

  const currentTask = videoTasks[taskId];

  // If the server restarted or ID is wrong
  if (!currentTask) {
    return res.status(404).json({ error: 'Task not found or expired' });
  }

  // Respond with the current progress and status
  return res.status(200).json({
    status: currentTask.status,     // 'processing' | 'completed' | 'failed'
    progress: currentTask.progress, // integer between 0 and 100
    videoUrl: currentTask.videoUrl, // null until completed
    error: currentTask.error        // null unless failed
  });
}
