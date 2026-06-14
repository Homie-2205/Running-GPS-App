const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const preview = document.getElementById('preview');

let mediaRecorder;
let recordedChunks = [];
let screenStream;
let voiceStream;

startBtn.addEventListener('click', async () => {
    recordedChunks = []; 
    
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true, 
            audio: true 
        });

        try {
            voiceStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
        } catch (err) {
            console.warn("Microphone access denied. Recording screen only.", err);
        }

        const tracks = [...screenStream.getVideoTracks()];
        
        if (voiceStream && voiceStream.getAudioTracks().length > 0) {
            tracks.push(voiceStream.getAudioTracks()[0]);
        }
        if (screenStream.getAudioTracks().length > 0) {
            tracks.push(screenStream.getAudioTracks()[0]);
        }

        const combinedStream = new MediaStream(tracks);
        preview.srcObject = combinedStream;

        const options = { mimeType: 'video/webm; codecs=vp8,opus' };
        mediaRecorder = new MediaRecorder(combinedStream, options);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        // This triggers right after mediaRecorder.stop() is run below
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const videoURL = URL.createObjectURL(blob);
            
            // 1. Preview the playback
            preview.srcObject = null;
            preview.src = videoURL;
            preview.controls = true;
            
            // 2. FIXED: Automatically trigger file download
            const downloadLink = document.createElement('a');
            downloadLink.href = videoURL;
            downloadLink.download = `screen-recording-${Date.now()}.mp4`; // Dynamic file name
            document.body.appendChild(downloadLink);
            downloadLink.click(); // Programmatically clicks the link hidden in the background
            document.body.removeChild(downloadLink); // Cleans up the DOM
        };
        
        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (err) {
        console.error("Error starting capture:", err);
    }
});

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop(); // This calls mediaRecorder.onstop above
    }

    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
    }
    if (voiceStream) {
        voiceStream.getTracks().forEach(track => track.stop());
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;
});
