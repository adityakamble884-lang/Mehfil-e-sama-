/**
 * ============================================================================
 * MEHFIL - YOUTUBE IFRAME AUDIO ENGINE & PLAYER CONTROLLER
 * ============================================================================
 * 
 * Manages the YouTube IFrame Player API, state management, queue,
 * Media Session API, keyboard shortcuts, sleep timer, and persistence.
 */

class MehfilPlayer {
  constructor() {
    // Player state
    this.ytPlayer = null;
    this.isReady = false;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = parseInt(localStorage.getItem('mehfil_volume') || MEHFIL_CONFIG.defaultVolume, 10);
    this.currentPlaylistKey = localStorage.getItem('mehfil_playlist') || MEHFIL_CONFIG.defaultPlaylist;
    this.currentTrackIndex = parseInt(localStorage.getItem('mehfil_track_index') || '0', 10);
    this.isShuffled = localStorage.getItem('mehfil_shuffle') === 'true';
    this.loopMode = localStorage.getItem('mehfil_loop') || 'playlist'; // 'off' | 'track' | 'playlist'
    this.playRequested = false;
    this.isInitializingAPI = false;
    
    // Playlists & Queue
    this.playlists = PLAYLISTS_DATA;
    this.activeTracks = [];
    this.shuffledIndices = [];
    this.shufflePointer = 0;
    
    // Progress tracking
    this.progressInterval = null;
    this.duration = 0;
    this.currentTime = 0;
    this.isScrubbing = false;

    // Sleep timer
    this.sleepTimerTimeout = null;
    this.sleepTimerInterval = null;
    this.sleepTimerSecondsLeft = 0;

    // Callbacks for UI updates
    this.onTrackChangeListeners = [];
    this.onStateChangeListeners = [];
    this.onTimeUpdateListeners = [];
    this.onQueueUpdateListeners = [];

    // Initialize list
    this.loadPlaylist(this.currentPlaylistKey, false);

    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Initializes the YouTube IFrame API script tag.
   */
  initYouTubeAPI() {
    if (this.isReady) return Promise.resolve();
    if (this.isInitializingAPI) return Promise.resolve();
    this.isInitializingAPI = true;

    return new Promise((resolve) => {
      // Safety timeout: never hang more than 4 seconds
      const timeout = setTimeout(() => {
        console.warn("YouTube API init timed out, continuing gracefully...");
        resolve();
      }, 4000);

      const done = () => {
        clearTimeout(timeout);
        resolve();
      };

      // If API is already loaded
      if (window.YT && window.YT.Player) {
        this.createYTPlayer().then(done).catch(done);
        return;
      }

      // Check if tag exists
      const existingTag = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingTag) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Set global callback required by YouTube
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        this.createYTPlayer().then(done).catch(done);
      };
    });
  }

  /**
   * Instantiates the YT.Player instance.
   */
  createYTPlayer() {
    return new Promise((resolve) => {
      if (this.ytPlayer) {
        resolve();
        return;
      }

      const currentTrack = this.getCurrentTrack();
      const initialVideoId = currentTrack ? currentTrack.videoId : "a18py61_F_w";

      // Configure playerVars safely for all environments including file://
      const playerVars = {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        enablejsapi: 1,
        iv_load_policy: 3
      };

      // YouTube rejects origin: "null" when opened via file:// protocol
      if (
        window.location.protocol.startsWith('http') &&
        window.location.origin &&
        window.location.origin !== 'null'
      ) {
        playerVars.origin = window.location.origin;
      }

      // Safety timeout for onReady
      const readyTimeout = setTimeout(() => {
        console.warn("YouTube Player onReady delayed. Continuing anyway...");
        resolve();
      }, 3500);

      try {
        this.ytPlayer = new YT.Player('yt-player-frame', {
          height: '100%',
          width: '100%',
          videoId: initialVideoId,
          playerVars: playerVars,
          events: {
            'onReady': (event) => {
              clearTimeout(readyTimeout);
              this.isReady = true;
              this.setVolume(this.volume);
              if (this.isMuted) this.ytPlayer.mute();
              this.updateMediaSession();
              resolve();

              // If playback was already requested while waiting for YouTube to connect
              if (this.playRequested) {
                this.play();
              }
            },
            'onStateChange': (event) => this.onPlayerStateChange(event),
            'onError': (event) => this.onPlayerError(event)
          }
        });
      } catch (err) {
        console.warn("Failed to instantiate YT.Player:", err);
        clearTimeout(readyTimeout);
        resolve();
      }
    });
  }

  /**
   * Switches the active playlist.
   */
  loadPlaylist(playlistKey, autoPlay = true) {
    if (playlistKey === 'all') {
      this.currentPlaylistKey = 'all';
      this.activeTracks = getCombinedMehfilTracks();
    } else if (this.playlists[playlistKey]) {
      this.currentPlaylistKey = playlistKey;
      this.activeTracks = [...this.playlists[playlistKey].tracks];
    } else {
      this.currentPlaylistKey = 'coke-studio';
      this.activeTracks = [...this.playlists['coke-studio'].tracks];
    }

    localStorage.setItem('mehfil_playlist', this.currentPlaylistKey);

    // Build shuffled index map if shuffle is enabled
    this.refreshShuffleOrder();

    // Reset or bound track index
    if (this.currentTrackIndex >= this.activeTracks.length) {
      this.currentTrackIndex = 0;
    }

    this.notifyQueueUpdate();
    this.notifyTrackChange();

    if (autoPlay && this.isReady) {
      this.playTrackByIndex(this.currentTrackIndex);
    }
  }

  /**
   * Refreshes or creates random sequence for shuffle mode.
   */
  refreshShuffleOrder() {
    const len = this.activeTracks.length;
    this.shuffledIndices = Array.from({ length: len }, (_, i) => i);
    
    if (this.isShuffled) {
      // Fisher-Yates shuffle
      for (let i = len - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.shuffledIndices[i], this.shuffledIndices[j]] = [this.shuffledIndices[j], this.shuffledIndices[i]];
      }
      this.shufflePointer = 0;
    }
  }

  /**
   * Returns current playing track metadata object.
   */
  getCurrentTrack() {
    if (!this.activeTracks || this.activeTracks.length === 0) return null;
    return this.activeTracks[this.currentTrackIndex] || this.activeTracks[0];
  }

  /**
   * Starts playback on the current or newly selected track.
   */
  playTrackByIndex(index) {
    if (index < 0 || index >= this.activeTracks.length) index = 0;
    this.currentTrackIndex = index;
    localStorage.setItem('mehfil_track_index', this.currentTrackIndex.toString());

    const track = this.getCurrentTrack();
    if (!track) return;

    this.notifyTrackChange();

    if (!this.isReady || !this.ytPlayer || typeof this.ytPlayer.loadVideoById !== 'function') {
      this.playRequested = true;
      return;
    }

    try {
      this.ytPlayer.loadVideoById({
        videoId: track.videoId,
        startSeconds: 0
      });
      this.isPlaying = true;
      this.consecutiveErrors = 0;
      this.startProgressTicker();
      this.notifyStateChange();
      this.updateMediaSession();
    } catch (e) {
      console.warn("Error calling loadVideoById:", e);
    }
  }

  /**
   * Plays track by its unique ID.
   */
  playTrackById(trackId) {
    const index = this.activeTracks.findIndex(t => t.id === trackId);
    if (index !== -1) {
      this.playTrackByIndex(index);
    } else {
      // Check in all tracks if from another playlist
      const all = getCombinedMehfilTracks();
      const found = all.find(t => t.id === trackId);
      if (found) {
        this.loadPlaylist('all', false);
        const newIndex = this.activeTracks.findIndex(t => t.id === trackId);
        this.playTrackByIndex(newIndex !== -1 ? newIndex : 0);
      }
    }
  }

  /**
   * Toggle Play / Pause.
   */
  togglePlay() {
    if (!this.isReady || !this.ytPlayer) return;

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.playRequested = true;
    if (!this.isReady || !this.ytPlayer) {
      // Audio engine is still connecting; will auto-start as soon as onReady fires
      return;
    }
    if (typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.startProgressTicker();
        this.notifyStateChange();
        this.updateMediaSession();
      } catch (err) {
        console.warn("Could not start playVideo:", err);
      }
    }
  }

  pause() {
    this.playRequested = false;
    if (!this.isReady || !this.ytPlayer) return;
    if (typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
        this.isPlaying = false;
        this.stopProgressTicker();
        this.notifyStateChange();
        this.updateMediaSession();
      } catch (err) {
        console.warn("Could not pauseVideo:", err);
      }
    }
  }

  /**
   * Advance to next track.
   */
  next() {
    if (this.isShuffled && this.shuffledIndices.length > 0) {
      this.shufflePointer = (this.shufflePointer + 1) % this.shuffledIndices.length;
      const nextIndex = this.shuffledIndices[this.shufflePointer];
      this.playTrackByIndex(nextIndex);
    } else {
      const nextIndex = (this.currentTrackIndex + 1) % this.activeTracks.length;
      this.playTrackByIndex(nextIndex);
    }
  }

  /**
   * Go back to previous track (or rewind to start if > 5s played).
   */
  prev() {
    if (this.currentTime > 5) {
      this.seekTo(0);
      return;
    }

    if (this.isShuffled && this.shuffledIndices.length > 0) {
      this.shufflePointer = (this.shufflePointer - 1 + this.shuffledIndices.length) % this.shuffledIndices.length;
      const prevIndex = this.shuffledIndices[this.shufflePointer];
      this.playTrackByIndex(prevIndex);
    } else {
      const prevIndex = (this.currentTrackIndex - 1 + this.activeTracks.length) % this.activeTracks.length;
      this.playTrackByIndex(prevIndex);
    }
  }

  /**
   * Seek video to position in seconds.
   */
  seekTo(seconds) {
    if (!this.isReady || !this.ytPlayer) return;
    if (typeof this.ytPlayer.seekTo === 'function') {
      this.ytPlayer.seekTo(seconds, true);
      this.currentTime = seconds;
      this.notifyTimeUpdate();
    }
  }

  /**
   * Volume Controls (0 to 100).
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(100, vol));
    localStorage.setItem('mehfil_volume', this.volume.toString());

    if (this.isReady && this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      this.ytPlayer.setVolume(this.volume);
      if (this.volume === 0) {
        this.isMuted = true;
        this.ytPlayer.mute();
      } else if (this.isMuted) {
        this.isMuted = false;
        this.ytPlayer.unMute();
      }
    }
    this.notifyStateChange();
  }

  toggleMute() {
    if (!this.isReady || !this.ytPlayer) return;

    if (this.isMuted) {
      this.isMuted = false;
      this.ytPlayer.unMute();
      this.ytPlayer.setVolume(this.volume > 0 ? this.volume : 50);
    } else {
      this.isMuted = true;
      this.ytPlayer.mute();
    }
    this.notifyStateChange();
  }

  /**
   * Shuffle toggle.
   */
  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    localStorage.setItem('mehfil_shuffle', this.isShuffled.toString());
    this.refreshShuffleOrder();
    this.notifyStateChange();
  }

  /**
   * Loop mode toggle ('playlist' -> 'track' -> 'off' -> 'playlist').
   */
  toggleLoop() {
    if (this.loopMode === 'playlist') {
      this.loopMode = 'track';
    } else if (this.loopMode === 'track') {
      this.loopMode = 'off';
    } else {
      this.loopMode = 'playlist';
    }
    localStorage.setItem('mehfil_loop', this.loopMode);
    this.notifyStateChange();
  }

  /**
   * Progress ticker for smooth seek bar & timer.
   */
  startProgressTicker() {
    this.stopProgressTicker();
    this.progressInterval = setInterval(() => {
      if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;

      if (!this.isScrubbing) {
        try {
          this.currentTime = this.ytPlayer.getCurrentTime() || 0;
          this.duration = this.ytPlayer.getDuration() || 0;
          this.notifyTimeUpdate();
        } catch (e) {
          // ignore transient iframe cross-context warnings
        }
      }
    }, 400);
  }

  stopProgressTicker() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * YouTube Player State Change Event Handler.
   */
  onPlayerStateChange(event) {
    // YT.PlayerState: -1 (UNSTARTED), 0 (ENDED), 1 (PLAYING), 2 (PAUSED), 3 (BUFFERING), 5 (CUED)
    if (event.data === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.consecutiveErrors = 0; // Reset error streak on successful playback
      this.duration = this.ytPlayer.getDuration() || 0;
      this.startProgressTicker();
      this.notifyStateChange();
      this.updateMediaSession();
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.stopProgressTicker();
      this.notifyStateChange();
    } else if (event.data === YT.PlayerState.ENDED) {
      this.onTrackEnded();
    } else if (event.data === YT.PlayerState.BUFFERING) {
      this.notifyStateChange(true); // buffering flag
    }
  }

  /**
   * Handle track completion.
   */
  onTrackEnded() {
    if (this.loopMode === 'track') {
      this.seekTo(0);
      this.play();
    } else if (this.loopMode === 'playlist') {
      this.next();
    } else {
      // Off: if last track, stop
      if (this.currentTrackIndex < this.activeTracks.length - 1) {
        this.next();
      } else {
        this.isPlaying = false;
        this.stopProgressTicker();
        this.notifyStateChange();
      }
    }
  }

  /**
   * YouTube Player Error handler.
   * Prevents runaway skipping loops when videos have embed restrictions or network issues.
   */
  onPlayerError(event) {
    console.warn("YouTube Player error event:", event.data);
    this.consecutiveErrors = (this.consecutiveErrors || 0) + 1;
    const track = this.getCurrentTrack();

    const errorDetails = {
      2: "Invalid video identifier",
      5: "HTML5 player playback error",
      100: "Track unavailable on YouTube",
      101: "Embedding restricted by copyright holder",
      150: "Embedding restricted by copyright holder"
    };
    const reason = errorDetails[event.data] || "Playback interrupted";

    // Attempt up to 2 skips; if multiple consecutive errors occur, stop runaway skips
    if (this.consecutiveErrors <= 2) {
      if (window.MehfilApp && window.MehfilApp.showToast) {
        window.MehfilApp.showToast(`"${track ? track.title : 'Selected'}" (${reason}). Trying next...`, "warning");
      }
      setTimeout(() => {
        this.next();
      }, 1800);
    } else {
      this.consecutiveErrors = 0;
      this.isPlaying = false;
      this.stopProgressTicker();
      this.notifyStateChange();
      if (window.MehfilApp && window.MehfilApp.showToast) {
        window.MehfilApp.showToast(
          "Notice: Some official tracks require an HTTP domain. Launch using 'Start-Mehfil.bat' or host on Netlify/Vercel for unrestricted streaming.",
          "warning"
        );
      }
    }
  }

  /**
   * Media Session API for Lock Screen & Notification Center Controls.
   */
  updateMediaSession() {
    if (!('mediaSession' in navigator)) return;

    const track = this.getCurrentTrack();
    if (!track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${track.title} (${track.urduTitle || ''})`,
      artist: `${track.artist} • Mehfil Radio`,
      album: track.album || "Mehfil-e-Sama",
      artwork: [
        { src: './img/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { src: './img/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
      ]
    });

    // Wire action handlers
    try {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seekTo(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        this.seekTo(Math.max(0, this.currentTime - skipTime));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        this.seekTo(Math.min(this.duration, this.currentTime + skipTime));
      });
    } catch (e) {
      // Some action handlers might not be supported on all browsers
    }
  }

  /**
   * Keyboard Shortcuts Handler.
   */
  handleKeyDown(e) {
    // Avoid triggering when user is in input, textarea, or contentEditable
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (e.shiftKey) {
          this.seekTo(Math.min(this.duration, this.currentTime + 10));
        } else {
          this.next();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (e.shiftKey) {
          this.seekTo(Math.max(0, this.currentTime - 10));
        } else {
          this.prev();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setVolume(this.volume + 10);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.setVolume(this.volume - 10);
        break;
      case 'KeyM':
        this.toggleMute();
        break;
      case 'KeyS':
        this.toggleShuffle();
        break;
      case 'KeyL':
        this.toggleLoop();
        break;
      case 'KeyQ':
        if (window.MehfilApp && window.MehfilApp.toggleQueueDrawer) {
          window.MehfilApp.toggleQueueDrawer();
        }
        break;
      case 'KeyZ':
        if (window.MehfilApp && window.MehfilApp.toggleZenMode) {
          window.MehfilApp.toggleZenMode();
        }
        break;
      case 'Slash':
        if (e.shiftKey) { // '?'
          if (window.MehfilApp && window.MehfilApp.toggleShortcutsModal) {
            window.MehfilApp.toggleShortcutsModal();
          }
        }
        break;
      default:
        break;
    }
  }

  /**
   * Sleep Timer Logic.
   * Options: 15, 30, 45, 60 minutes or 0 (cancel).
   */
  setSleepTimer(minutes) {
    if (this.sleepTimerTimeout) {
      clearTimeout(this.sleepTimerTimeout);
      this.sleepTimerTimeout = null;
    }
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }

    if (!minutes || minutes <= 0) {
      this.sleepTimerSecondsLeft = 0;
      this.notifySleepTimerUpdate();
      return;
    }

    this.sleepTimerSecondsLeft = minutes * 60;
    this.notifySleepTimerUpdate();

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerSecondsLeft--;
      this.notifySleepTimerUpdate();

      // Gentle fade out during last 20 seconds
      if (this.sleepTimerSecondsLeft <= 20 && this.sleepTimerSecondsLeft > 0) {
        const fadeVol = Math.floor((this.sleepTimerSecondsLeft / 20) * this.volume);
        if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
          this.ytPlayer.setVolume(fadeVol);
        }
      }

      if (this.sleepTimerSecondsLeft <= 0) {
        clearInterval(this.sleepTimerInterval);
        this.sleepTimerInterval = null;
        this.pause();
        if (window.MehfilApp && window.MehfilApp.showToast) {
          window.MehfilApp.showToast("Sleep timer ended. Mehfil resting. Shab-ba-Khair (Good night) 🌙", "info");
        }
      }
    }, 1000);
  }

  notifySleepTimerUpdate() {
    if (window.MehfilApp && window.MehfilApp.updateSleepTimerUI) {
      window.MehfilApp.updateSleepTimerUI(this.sleepTimerSecondsLeft);
    }
  }

  /**
   * Observer subscriptions for UI.
   */
  subscribe(event, callback) {
    if (event === 'trackChange') this.onTrackChangeListeners.push(callback);
    if (event === 'stateChange') this.onStateChangeListeners.push(callback);
    if (event === 'timeUpdate') this.onTimeUpdateListeners.push(callback);
    if (event === 'queueUpdate') this.onQueueUpdateListeners.push(callback);
  }

  notifyTrackChange() {
    const track = this.getCurrentTrack();
    this.onTrackChangeListeners.forEach(cb => cb(track, this.currentTrackIndex));
  }

  notifyStateChange(isBuffering = false) {
    this.onStateChangeListeners.forEach(cb => cb({
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      isShuffled: this.isShuffled,
      loopMode: this.loopMode,
      isBuffering
    }));
  }

  notifyTimeUpdate() {
    this.onTimeUpdateListeners.forEach(cb => cb({
      currentTime: this.currentTime,
      duration: this.duration,
      percent: this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    }));
  }

  notifyQueueUpdate() {
    this.onQueueUpdateListeners.forEach(cb => cb({
      playlistKey: this.currentPlaylistKey,
      tracks: this.activeTracks,
      currentIndex: this.currentTrackIndex
    }));
  }
}

// Format seconds into MM:SS
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
