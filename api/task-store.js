// Check if the global videoTasks object already exists; if not, initialize it.
// This prevents the store from being wiped during local development hot-reloads.
global.videoTasks = global.videoTasks || {};

// Export the reference so it can be cleanly imported into your API routes.
const videoTasks = global.videoTasks;

export default videoTasks;
