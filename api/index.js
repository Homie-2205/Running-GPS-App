const ffmpeg = require('fluent-ffmpeg');

// Convert an AVI file to MP4 format
ffmpeg('input.avi')
  .output('output.mp4')
  .on('end', () => {
    console.log('Processing finished successfully!');
  })
  .on('error', (err) => {
    console.error('Error: ' + err.message);
  })
  .run();
