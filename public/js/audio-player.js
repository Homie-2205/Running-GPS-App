/**
 * Universal Audio Player Script
 * Plays audio across multiple devices: smartphones, tablets, and desktops
 * Handles different browser compatibility and device types
 */

class UniversalAudioPlayer {
  constructor(audioSource = 'iamm.mp3') {
    this.audioSource = audioSource;
    this.audio = null;
    this.isPlaying = false;
    this.volume = 1;
    this.initAudio();
  }

  /**
   * Initialize audio element with cross-device support
   */
  initAudio() {
    try {
      // Create audio element
      this.audio = new Audio();
      this.audio.src = this.audioSource;
      this.audio.preload = 'auto';

      // Add event listeners
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.onAudioEnd();
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Audio Error:', e);
        this.onAudioError();
      });

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.onAudioPlay();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.onAudioPause();
      });

      console.log('✓ Audio player initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Play audio with device detection
   */
  play() {
    if (!this.audio) {
      console.error('Audio not initialized');
      return;
    }

    // Detect device type
    const deviceType = this.detectDevice();
    console.log(`📱 Playing on device: ${deviceType}`);

    // Handle mobile autoplay restrictions
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✓ Audio playback started');
        })
        .catch((error) => {
          console.warn('Autoplay prevented. User interaction required:', error);
          this.showPlayButton();
        });
    }
  }

  /**
   * Pause audio playback
   */
  pause() {
    if (this.audio) {
      this.audio.pause();
      console.log('⏸ Audio paused');
    }
  }

  /**
   * Stop audio and reset
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      console.log('⏹ Audio stopped');
    }
  }

  /**
   * Set volume level (0 to 1)
   */
  setVolume(volume) {
    if (this.audio && volume >= 0 && volume <= 1) {
      this.audio.volume = volume;
      this.volume = volume;
      console.log(`🔊 Volume set to: ${Math.round(volume * 100)}%`);
    }
  }

  /**
   * Detect device type
   */
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/iphone|ipod|ipad|ios/.test(userAgent)) {
      return 'iOS Device';
    } else if (/android/.test(userAgent)) {
      return 'Android Device';
    } else if (/tablet|ipad|playbook|silk/.test(userAgent)) {
      return 'Tablet';
    } else if (/mobile|phone|android/.test(userAgent)) {
      return 'Mobile Phone';
    } else {
      return 'Desktop';
    }
  }

  /**
   * Check if device has audio support
   */
  supportsAudio() {
    const audio = document.createElement('audio');
    return (
      typeof audio.canPlayType === 'function' &&
      audio.canPlayType('audio/mpeg') !== ''
    );
  }

  /**
   * Show play button if autoplay is blocked
   */
  showPlayButton() {
    const existingButton = document.getElementById('manualPlayBtn');
    if (existingButton) return;

    const button = document.createElement('button');
    button.id = 'manualPlayBtn';
    button.textContent = '🔊 Tap to Play Audio';
    button.style.cssText = `
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #ff6b6b;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    `;

    button.addEventListener('click', () => {
      this.play();
      button.remove();
    });

    document.body.appendChild(button);
  }

  /**
   * Callback when audio starts playing
   */
  onAudioPlay() {
    console.log('🎵 Audio is now playing');
  }

  /**
   * Callback when audio pauses
   */
  onAudioPause() {
    console.log('⏸ Audio paused');
  }

  /**
   * Callback when audio ends
   */
  onAudioEnd() {
    console.log('✓ Audio playback finished');
  }

  /**
   * Callback on audio error
   */
  onAudioError() {
    console.error('❌ Audio playback error occurred');
  }

  /**
   * Get current playback time
   */
  getCurrentTime() {
    return this.audio ? this.audio.currentTime : 0;
  }

  /**
   * Get total audio duration
   */
  getDuration() {
    return this.audio ? this.audio.duration : 0;
  }

  /**
   * Check if currently playing
   */
  getIsPlaying() {
    return this.isPlaying;
  }
}

// Create global instance
const audioPlayer = new UniversalAudioPlayer('/audio/iamm.mp3');

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversalAudioPlayer;
}
