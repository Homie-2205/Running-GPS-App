const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let mediaRecorder;
let recordedChunks = [];
let screenStream;
let voiceStream;
let audioContext;

startBtn.addEventListener('click', async () => {
    recordedChunks = []; 
    
    try {
        // 1. Capturar pantalla con video y audio del sistema
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true, 
            audio: true 
        });

        // 2. Capturar micrófono
        try {
            voiceStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
        } catch (err) {
            console.warn("Microphone access denied. Recording screen only.", err);
        }

        const tracks = [...screenStream.getVideoTracks()];
        const audioTracksToMix = [];

        if (screenStream.getAudioTracks().length > 0) {
            audioTracksToMix.push(screenStream.getAudioTracks()[0]);
        }
        if (voiceStream && voiceStream.getAudioTracks().length > 0) {
            audioTracksToMix.push(voiceStream.getAudioTracks()[0]);
        }

        // 3. Mezclar audios en una sola pista destino
        if (audioTracksToMix.length > 0) {
            audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            audioTracksToMix.forEach(track => {
                const sourceStream = new MediaStream([track]);
                const sourceNode = audioContext.createMediaStreamSource(sourceStream);
                sourceNode.connect(destination);
            });

            // Agrega el track de audio mezclado al array de tracks final
            tracks.push(destination.stream.getAudioTracks()[0]);
        }

        const combinedStream = new MediaStream(tracks);

        // 4. Configurar formato MP4 compatible con el navegador
        let options = { mimeType: 'video/mp4; codecs=avc1.42E01E,mp4a.40.2' }; // H.264 + AAC
        
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/mp4' };
        }
        
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn("MP4 no es soportado nativamente en este navegador. Usando WebM como alternativa.");
            options = { mimeType: 'video/webm; codecs=vp8,opus' };
        }

        mediaRecorder = new MediaRecorder(combinedStream, options);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const isActualMp4 = mediaRecorder.mimeType.includes('video/mp4');
            const fileType = isActualMp4 ? 'video/mp4' : 'video/webm';
            const fileExt = isActualMp4 ? 'mp4' : 'webm';

            const blob = new Blob(recordedChunks, { type: fileType });
            const videoURL = URL.createObjectURL(blob);
            
            // Descarga automática
            const downloadLink = document.createElement('a');
            downloadLink.href = videoURL;
            downloadLink.download = `screen-recording-${Date.now()}.${fileExt}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            if (audioContext) audioContext.close();
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
        mediaRecorder.stop();
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

