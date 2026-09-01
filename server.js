const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Node + FFmpeg server is running');
});

// Import and use other files
const someModule = require('./someModule');

// Example endpoint using another file
app.get('/process', (req, res) => {
  const result = someModule.doSomething();
  res.json({ result });
});

// Start server on Render port
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
