/**
 * ============================================================================
 * MEHFIL - CORE APP UI, AMBIENT PARTICLES & INTERACTION CONTROLLER
 * ============================================================================
 */

class MehfilAppUI {
  constructor() {
    this.player = new MehfilPlayer();
    this.couplets = SUFI_COUPLETS || [];
    this.currentCoupletIndex = 0;
    this.coupletInterval = null;
    this.particlesEnabled = true;
    this.zenModeActive = false;
    this.deferredPrompt = null;
    this.toastTimeout = null;

    // DOM Elements Cache
    this.dom = {
      // Intro overlay
      introOverlay: document.getElementById('intro-overlay'),
      enterMehfilBtn: document.getElementById('enter-mehfil-btn'),

      // Player Elements
      playPauseBtn: document.getElementById('play-pause-btn'),
      playPauseIcon: document.getElementById('play-pause-icon'),
      prevBtn: document.getElementById('prev-btn'),
      nextBtn: document.getElementById('next-btn'),
      shuffleBtn: document.getElementById('shuffle-btn'),
      loopBtn: document.getElementById('loop-btn'),
      volumeSlider: document.getElementById('volume-slider'),
      muteBtn: document.getElementById('mute-btn'),
      muteIcon: document.getElementById('mute-icon'),
      progressBar: document.getElementById('progress-bar'),
      progressFill: document.getElementById('progress-fill'),
      progressHandle: document.getElementById('progress-handle'),
      currentTimeText: document.getElementById('current-time'),
      totalTimeText: document.getElementById('total-time'),

      // Track display
      trackTitle: document.getElementById('track-title'),
      trackUrduTitle: document.getElementById('track-urdu-title'),
      trackArtist: document.getElementById('track-artist'),
      trackBadge: document.getElementById('track-badge'),
      trackCoupletSnippet: document.getElementById('track-couplet-snippet'),

      // Visualizer
      visualizerBars: document.querySelectorAll('.eq-bar'),

      // Queue Drawer
      queueDrawer: document.getElementById('queue-drawer'),
      queueBackdrop: document.getElementById('queue-backdrop'),
      openQueueBtn: document.getElementById('open-queue-btn'),
      closeQueueBtn: document.getElementById('close-queue-btn'),
      queueList: document.getElementById('queue-list'),
      queueSearchInput: document.getElementById('queue-search-input'),
      queueTrackCount: document.getElementById('queue-track-count'),

      // Couplet section
      coupletUrdu: document.getElementById('couplet-urdu'),
      coupletHindi: document.getElementById('couplet-hindi'),
      coupletTranslation: document.getElementById('couplet-translation'),
      coupletPoet: document.getElementById('couplet-poet'),
      coupletContext: document.getElementById('couplet-context'),
      prevCoupletBtn: document.getElementById('prev-couplet-btn'),
      nextCoupletBtn: document.getElementById('next-couplet-btn'),

      // Modals
      supportModal: document.getElementById('support-modal'),
      supportModalBackdrop: document.getElementById('support-modal-backdrop'),
      openSupportBtns: document.querySelectorAll('.open-support-trigger'),
      closeSupportBtn: document.getElementById('close-support-btn'),
      copyUpiBtn: document.getElementById('copy-upi-btn'),

      shortcutsModal: document.getElementById('shortcuts-modal'),
      shortcutsBackdrop: document.getElementById('shortcuts-modal-backdrop'),
      openShortcutsBtn: document.getElementById('open-shortcuts-btn'),
      closeShortcutsBtn: document.getElementById('close-shortcuts-btn'),

      sleepTimerModal: document.getElementById('sleep-timer-modal'),
      sleepTimerBackdrop: document.getElementById('sleep-timer-backdrop'),
      openSleepTimerBtn: document.getElementById('open-sleep-timer-btn'),
      closeSleepTimerBtn: document.getElementById('close-sleep-timer-btn'),
      sleepTimerBadge: document.getElementById('sleep-timer-badge'),

      videoPeekModal: document.getElementById('video-peek-modal'),
      videoPeekBackdrop: document.getElementById('video-peek-backdrop'),
      toggleVideoPeekBtn: document.getElementById('toggle-video-peek-btn'),
      closeVideoPeekBtn: document.getElementById('close-video-peek-btn'),
      ytContainer: document.getElementById('yt-container'),
      openYtExternalBtn: document.getElementById('open-yt-external-btn'),
      peekDirectYtLink: document.getElementById('peek-direct-yt-link'),

      // Navigation & Utilities
      zenToggleBtn: document.getElementById('zen-toggle-btn'),
      particlesToggleBtn: document.getElementById('particles-toggle-btn'),
      shareTrackBtn: document.getElementById('share-track-btn'),
      installAppBtns: document.querySelectorAll('.install-app-btn'),
      toast: document.getElementById('toast'),
      toastMessage: document.getElementById('toast-message'),

      // Canvas for ambient particles
      particleCanvas: document.getElementById('ambient-canvas')
    };

    // Expose app instance globally
    window.MehfilApp = this;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupPlayerSubscriptions();
    this.setupPlaylistTabs();
    this.setupFAQAccordion();
    this.setupCoupletsCarousel();
    this.initAmbientParticles();
    this.setupPWA();
    this.checkUrlForTrackParam();

    // Pre-initialize YouTube Player immediately so it's ready before user clicks
    this.player.initYouTubeAPI().catch(() => {});
  }

  /**
   * Bind all primary DOM listeners.
   */
  setupEventListeners() {
    // Intro overlay entry
    if (this.dom.enterMehfilBtn) {
      this.dom.enterMehfilBtn.addEventListener('click', () => this.handleEnterMehfil());
    }

    // Playback control buttons
    if (this.dom.playPauseBtn) {
      this.dom.playPauseBtn.addEventListener('click', () => this.player.togglePlay());
    }
    if (this.dom.nextBtn) {
      this.dom.nextBtn.addEventListener('click', () => this.player.next());
    }
    if (this.dom.prevBtn) {
      this.dom.prevBtn.addEventListener('click', () => this.player.prev());
    }
    if (this.dom.shuffleBtn) {
      this.dom.shuffleBtn.addEventListener('click', () => this.player.toggleShuffle());
    }
    if (this.dom.loopBtn) {
      this.dom.loopBtn.addEventListener('click', () => this.player.toggleLoop());
    }
    if (this.dom.muteBtn) {
      this.dom.muteBtn.addEventListener('click', () => this.player.toggleMute());
    }

    // Volume Slider
    if (this.dom.volumeSlider) {
      this.dom.volumeSlider.value = this.player.volume;
      this.dom.volumeSlider.addEventListener('input', (e) => {
        this.player.setVolume(parseInt(e.target.value, 10));
      });
    }

    // Progress Bar Scrubbing
    if (this.dom.progressBar) {
      const handleScrub = (e) => {
        const rect = this.dom.progressBar.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const seekTime = percent * (this.player.duration || 1);
        this.dom.progressFill.style.width = `${percent * 100}%`;
        this.dom.currentTimeText.textContent = formatTime(seekTime);
        return seekTime;
      };

      this.dom.progressBar.addEventListener('mousedown', (e) => {
        this.player.isScrubbing = true;
        const seekTime = handleScrub(e);
        const onMouseMove = (moveEvent) => handleScrub(moveEvent);
        const onMouseUp = (upEvent) => {
          this.player.isScrubbing = false;
          const finalSeek = handleScrub(upEvent);
          this.player.seekTo(finalSeek);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Touch scrubber for mobile
      this.dom.progressBar.addEventListener('touchstart', (e) => {
        this.player.isScrubbing = true;
        handleScrub(e);
      }, { passive: true });

      this.dom.progressBar.addEventListener('touchmove', (e) => {
        if (this.player.isScrubbing) handleScrub(e);
      }, { passive: true });

      this.dom.progressBar.addEventListener('touchend', (e) => {
        this.player.isScrubbing = false;
        const touches = e.changedTouches;
        if (touches && touches.length > 0) {
          const rect = this.dom.progressBar.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (touches[0].clientX - rect.left) / rect.width));
          this.player.seekTo(percent * (this.player.duration || 1));
        }
      });
    }

    // Queue Drawer toggling
    if (this.dom.openQueueBtn) {
      this.dom.openQueueBtn.addEventListener('click', () => this.toggleQueueDrawer(true));
    }
    if (this.dom.closeQueueBtn) {
      this.dom.closeQueueBtn.addEventListener('click', () => this.toggleQueueDrawer(false));
    }
    if (this.dom.queueBackdrop) {
      this.dom.queueBackdrop.addEventListener('click', () => this.toggleQueueDrawer(false));
    }

    // Queue search filter
    if (this.dom.queueSearchInput) {
      this.dom.queueSearchInput.addEventListener('input', (e) => {
        this.filterQueueItems(e.target.value.toLowerCase().trim());
      });
    }

    // Modals
    this.dom.openSupportBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleSupportModal(true));
    });
    if (this.dom.closeSupportBtn) {
      this.dom.closeSupportBtn.addEventListener('click', () => this.toggleSupportModal(false));
    }
    if (this.dom.supportModalBackdrop) {
      this.dom.supportModalBackdrop.addEventListener('click', () => this.toggleSupportModal(false));
    }
    if (this.dom.copyUpiBtn) {
      this.dom.copyUpiBtn.addEventListener('click', () => this.copyUpiId());
    }

    // Shortcuts Modal
    if (this.dom.openShortcutsBtn) {
      this.dom.openShortcutsBtn.addEventListener('click', () => this.toggleShortcutsModal(true));
    }
    if (this.dom.closeShortcutsBtn) {
      this.dom.closeShortcutsBtn.addEventListener('click', () => this.toggleShortcutsModal(false));
    }
    if (this.dom.shortcutsBackdrop) {
      this.dom.shortcutsBackdrop.addEventListener('click', () => this.toggleShortcutsModal(false));
    }

    // Sleep Timer Modal
    if (this.dom.openSleepTimerBtn) {
      this.dom.openSleepTimerBtn.addEventListener('click', () => this.toggleSleepTimerModal(true));
    }
    if (this.dom.closeSleepTimerBtn) {
      this.dom.closeSleepTimerBtn.addEventListener('click', () => this.toggleSleepTimerModal(false));
    }
    if (this.dom.sleepTimerBackdrop) {
      this.dom.sleepTimerBackdrop.addEventListener('click', () => this.toggleSleepTimerModal(false));
    }

    // Sleep timer preset buttons
    const sleepOptionBtns = document.querySelectorAll('.sleep-opt-btn');
    sleepOptionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const minutes = parseInt(btn.dataset.minutes, 10);
        this.player.setSleepTimer(minutes);
        this.toggleSleepTimerModal(false);
        if (minutes > 0) {
          this.showToast(`Sleep timer set for ${minutes} minutes. Mehfil will gently rest.`, 'info');
        } else {
          this.showToast('Sleep timer turned off.', 'info');
        }
      });
    });

    // Video Peek Modal
    if (this.dom.toggleVideoPeekBtn) {
      this.dom.toggleVideoPeekBtn.addEventListener('click', () => this.toggleVideoPeekModal(true));
    }
    if (this.dom.closeVideoPeekBtn) {
      this.dom.closeVideoPeekBtn.addEventListener('click', () => this.toggleVideoPeekModal(false));
    }
    if (this.dom.videoPeekBackdrop) {
      this.dom.videoPeekBackdrop.addEventListener('click', () => this.toggleVideoPeekModal(false));
    }

    // Zen Mode
    if (this.dom.zenToggleBtn) {
      this.dom.zenToggleBtn.addEventListener('click', () => this.toggleZenMode());
    }

    // Ambient Particles Toggle
    if (this.dom.particlesToggleBtn) {
      this.dom.particlesToggleBtn.addEventListener('click', () => this.toggleParticles());
    }

    // Share Track
    if (this.dom.shareTrackBtn) {
      this.dom.shareTrackBtn.addEventListener('click', () => this.shareCurrentTrack());
    }

    // Direct YouTube link
    if (this.dom.openYtExternalBtn) {
      this.dom.openYtExternalBtn.addEventListener('click', () => {
        const track = this.player.getCurrentTrack();
        if (track && track.videoId) {
          window.open(`https://www.youtube.com/watch?v=${track.videoId}`, '_blank');
        }
      });
    }

    // Couplet manual arrows
    if (this.dom.prevCoupletBtn) {
      this.dom.prevCoupletBtn.addEventListener('click', () => this.changeCouplet(-1));
    }
    if (this.dom.nextCoupletBtn) {
      this.dom.nextCoupletBtn.addEventListener('click', () => this.changeCouplet(1));
    }
  }

  /**
   * Action triggered when user clicks "Enter the Mehfil".
   */
  handleEnterMehfil() {
    // 1. Immediately dismiss the intro curtain without blocking
    if (this.dom.introOverlay) {
      this.dom.introOverlay.classList.add('fade-out');
      setTimeout(() => {
        this.dom.introOverlay.style.display = 'none';
      }, 700);
    }

    // 2. Trigger audio playback immediately
    this.player.play();
    this.showToast("Welcome to Mehfil. Relax and immerse in divine Sama.", "success");
  }

  /**
   * Syncs UI with Player state changes.
   */
  setupPlayerSubscriptions() {
    // 1. On Track Change
    this.player.subscribe('trackChange', (track, index) => {
      if (!track) return;

      if (this.dom.trackTitle) this.dom.trackTitle.textContent = track.title;
      if (this.dom.trackUrduTitle) this.dom.trackUrduTitle.textContent = track.urduTitle || '';
      if (this.dom.trackArtist) this.dom.trackArtist.textContent = `${track.artist} • ${track.album || 'Sufi Heritage'}`;
      if (this.dom.trackBadge) this.dom.trackBadge.textContent = track.era || 'Qawwali';
      
      if (this.dom.trackCoupletSnippet) {
        this.dom.trackCoupletSnippet.textContent = track.couplet || track.coupletUrdu || '';
      }

      if (this.dom.peekDirectYtLink && track.videoId) {
        this.dom.peekDirectYtLink.href = `https://www.youtube.com/watch?v=${track.videoId}`;
      }

      this.highlightActiveQueueItem(index);
      this.updateBrowserTitle(track);
    });

    // 2. On Playback State Change
    this.player.subscribe('stateChange', ({ isPlaying, isMuted, volume, isShuffled, loopMode, isBuffering }) => {
      // Play/Pause button icons
      if (this.dom.playPauseBtn) {
        if (isPlaying) {
          this.dom.playPauseBtn.classList.add('playing');
          this.dom.playPauseBtn.setAttribute('aria-label', 'Pause Qawwali');
          this.dom.playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
            </svg>`;
          this.startVisualizerAnimation();
        } else {
          this.dom.playPauseBtn.classList.remove('playing');
          this.dom.playPauseBtn.setAttribute('aria-label', 'Play Qawwali');
          this.dom.playPauseIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" style="margin-left: 2px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>`;
          this.stopVisualizerAnimation();
        }
      }

      // Shuffle active state
      if (this.dom.shuffleBtn) {
        this.dom.shuffleBtn.classList.toggle('active', isShuffled);
      }

      // Loop state
      if (this.dom.loopBtn) {
        this.dom.loopBtn.classList.toggle('active', loopMode !== 'off');
        const badge = this.dom.loopBtn.querySelector('.loop-badge');
        if (badge) {
          badge.textContent = loopMode === 'track' ? '1' : '';
          badge.style.display = loopMode === 'track' ? 'block' : 'none';
        }
      }

      // Mute / Volume icon
      if (this.dom.muteIcon) {
        if (isMuted || volume === 0) {
          this.dom.muteIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>`;
        } else if (volume < 50) {
          this.dom.muteIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`;
        } else {
          this.dom.muteIcon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`;
        }
      }
    });

    // 3. On Time Update
    this.player.subscribe('timeUpdate', ({ currentTime, duration, percent }) => {
      if (!this.player.isScrubbing) {
        if (this.dom.progressFill) this.dom.progressFill.style.width = `${percent}%`;
        if (this.dom.progressHandle) this.dom.progressHandle.style.left = `${percent}%`;
        if (this.dom.currentTimeText) this.dom.currentTimeText.textContent = formatTime(currentTime);
        if (this.dom.totalTimeText) this.dom.totalTimeText.textContent = formatTime(duration);
      }
    });

    // 4. On Queue Update
    this.player.subscribe('queueUpdate', ({ playlistKey, tracks, currentIndex }) => {
      this.renderQueueList(tracks, currentIndex);
      this.highlightActivePlaylistTab(playlistKey);
    });
  }

  /**
   * Highlights active playlist tab in selector.
   */
  highlightActivePlaylistTab(playlistKey) {
    const tabs = document.querySelectorAll('.playlist-tab');
    tabs.forEach(tab => {
      const isMatch = tab.dataset.playlist === playlistKey;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // Also highlight cards in playlist section
    const cards = document.querySelectorAll('.playlist-card');
    cards.forEach(card => {
      const isMatch = card.dataset.playlist === playlistKey;
      card.classList.toggle('active', isMatch);
    });
  }

  /**
   * Sets up playlist chips/tabs and playlist cards clicks.
   */
  setupPlaylistTabs() {
    const tabs = document.querySelectorAll('.playlist-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.playlist;
        this.player.loadPlaylist(key, true);
        this.showToast(`Switched to: ${tab.textContent.trim()}`, "info");
      });
    });

    const cards = document.querySelectorAll('.playlist-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.playlist;
        this.player.loadPlaylist(key, true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast(`Now playing: ${card.querySelector('.playlist-title').textContent}`, "info");
      });
    });
  }

  /**
   * Renders upcoming songs in Queue Drawer.
   */
  renderQueueList(tracks, currentIndex) {
    if (!this.dom.queueList) return;
    this.dom.queueList.innerHTML = '';

    if (this.dom.queueTrackCount) {
      this.dom.queueTrackCount.textContent = `${tracks.length} Kalaams`;
    }

    tracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `queue-item ${index === currentIndex ? 'active' : ''}`;
      item.dataset.index = index;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      item.innerHTML = `
        <div class="queue-num">
          <span class="track-number">${(index + 1).toString().padStart(2, '0')}</span>
          <span class="playing-anim">
            <span></span><span></span><span></span>
          </span>
        </div>
        <div class="queue-info">
          <div class="queue-title-row">
            <span class="queue-title">${track.title}</span>
            <span class="queue-urdu">${track.urduTitle || ''}</span>
          </div>
          <div class="queue-sub">
            <span class="queue-artist">${track.artist}</span>
            <span class="queue-duration">${track.duration || ''}</span>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        this.player.playTrackByIndex(index);
        this.toggleQueueDrawer(false);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.player.playTrackByIndex(index);
          this.toggleQueueDrawer(false);
        }
      });

      this.dom.queueList.appendChild(item);
    });
  }

  /**
   * Filter queue items by search text.
   */
  filterQueueItems(query) {
    const items = document.querySelectorAll('.queue-item');
    items.forEach(item => {
      const title = item.querySelector('.queue-title').textContent.toLowerCase();
      const artist = item.querySelector('.queue-artist').textContent.toLowerCase();
      const urdu = item.querySelector('.queue-urdu').textContent.toLowerCase();
      const matches = title.includes(query) || artist.includes(query) || urdu.includes(query);
      item.style.display = matches ? 'flex' : 'none';
    });
  }

  /**
   * Highlight active track in queue list.
   */
  highlightActiveQueueItem(index) {
    const items = document.querySelectorAll('.queue-item');
    items.forEach((item, i) => {
      const isActive = i === index;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /**
   * Queue Drawer Visibility.
   */
  toggleQueueDrawer(show) {
    if (show === undefined) {
      show = !this.dom.queueDrawer.classList.contains('open');
    }
    this.dom.queueDrawer.classList.toggle('open', show);
    this.dom.queueBackdrop.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
    if (show && this.dom.queueSearchInput) {
      setTimeout(() => this.dom.queueSearchInput.focus(), 150);
    }
  }

  /**
   * FAQ Accordion setup.
   */
  setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      questionBtn.addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');
        // Close others
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('expanded');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('expanded', !isExpanded);
        questionBtn.setAttribute('aria-expanded', (!isExpanded).toString());
      });
    });
  }

  /**
   * Rotating Sufi Couplets logic.
   */
  setupCoupletsCarousel() {
    this.renderCurrentCouplet();
    this.coupletInterval = setInterval(() => {
      this.changeCouplet(1);
    }, 18000); // Rotate every 18 seconds
  }

  changeCouplet(direction) {
    this.currentCoupletIndex = (this.currentCoupletIndex + direction + this.couplets.length) % this.couplets.length;
    
    // Add quick fade transition
    const card = document.querySelector('.couplet-card');
    if (card) {
      card.classList.add('transitioning');
      setTimeout(() => {
        this.renderCurrentCouplet();
        card.classList.remove('transitioning');
      }, 300);
    } else {
      this.renderCurrentCouplet();
    }
  }

  renderCurrentCouplet() {
    const data = this.couplets[this.currentCoupletIndex];
    if (!data) return;

    if (this.dom.coupletUrdu) this.dom.coupletUrdu.textContent = data.urdu;
    if (this.dom.coupletHindi) this.dom.coupletHindi.textContent = data.hindi;
    if (this.dom.coupletTranslation) this.dom.coupletTranslation.textContent = `"${data.translation}"`;
    if (this.dom.coupletPoet) this.dom.coupletPoet.textContent = `— ${data.poet}`;
    if (this.dom.coupletContext) this.dom.coupletContext.textContent = data.context || '';
  }

  /**
   * Visualizer EQ Animation.
   */
  startVisualizerAnimation() {
    if (this.dom.visualizerBars) {
      this.dom.visualizerBars.forEach(bar => {
        bar.classList.add('dancing');
      });
    }
  }

  stopVisualizerAnimation() {
    if (this.dom.visualizerBars) {
      this.dom.visualizerBars.forEach(bar => {
        bar.classList.remove('dancing');
      });
    }
  }

  /**
   * Canvas Ambient Particles (Falling Rose Petals & Golden Candle Embers).
   */
  initAmbientParticles() {
    const canvas = this.dom.particleCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.particlesEnabled = false;
      return;
    }

    // Particle classes: Petals and Embers
    const particles = [];
    const petalCount = window.innerWidth < 768 ? 14 : 26;
    const emberCount = window.innerWidth < 768 ? 16 : 32;

    class Petal {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 8 + 8; // 8-16px
        this.speedY = Math.random() * 0.7 + 0.4;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.color = Math.random() > 0.4 ? 'rgba(150, 18, 45, 0.75)' : 'rgba(195, 33, 72, 0.65)';
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      }
      update() {
        this.wobble += this.wobbleSpeed;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.6;
        this.rotation += this.rotSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }
      draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.fillStyle = this.color;
        c.beginPath();
        // Rose petal organic curved shape
        c.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class Ember {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 1;
        this.speedY = -(Math.random() * 0.5 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= this.fadeSpeed;
        if (this.y < -10 || this.alpha <= 0) {
          this.reset(false);
        }
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = '#ffb347'; // warm candle amber
        c.shadowColor = '#d4af37';
        c.shadowBlur = 4;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) particles.push(new Petal());
    for (let i = 0; i < emberCount; i++) particles.push(new Ember());

    const animate = () => {
      if (this.particlesEnabled) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw(ctx);
        });
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  toggleParticles() {
    this.particlesEnabled = !this.particlesEnabled;
    const canvas = this.dom.particleCanvas;
    if (canvas) {
      canvas.style.display = this.particlesEnabled ? 'block' : 'none';
    }
    if (this.dom.particlesToggleBtn) {
      this.dom.particlesToggleBtn.classList.toggle('active', this.particlesEnabled);
      this.dom.particlesToggleBtn.setAttribute('title', this.particlesEnabled ? 'Disable Ambient Petals' : 'Enable Ambient Petals');
    }
    this.showToast(this.particlesEnabled ? 'Ambient petals & embers enabled' : 'Ambient effects paused', 'info');
  }

  /**
   * Zen Mode (Cinema / Ambient focus).
   */
  toggleZenMode() {
    this.zenModeActive = !this.zenModeActive;
    document.body.classList.toggle('zen-mode', this.zenModeActive);
    if (this.dom.zenToggleBtn) {
      this.dom.zenToggleBtn.classList.toggle('active', this.zenModeActive);
    }
    this.showToast(this.zenModeActive ? "Zen Mode: Press 'Z' or click to exit" : "Zen Mode off", "info");
  }

  /**
   * Support Modal Toggle.
   */
  toggleSupportModal(show) {
    this.dom.supportModal.classList.toggle('open', show);
    this.dom.supportModalBackdrop.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  copyUpiId() {
    const upiId = "mehfil@upi";
    navigator.clipboard.writeText(upiId).then(() => {
      this.showToast(`UPI ID "${upiId}" copied to clipboard! Shukriya 🙏`, 'success');
    }).catch(() => {
      this.showToast(`UPI ID is: ${upiId}`, 'info');
    });
  }

  /**
   * Keyboard Shortcuts Modal.
   */
  toggleShortcutsModal(show) {
    if (show === undefined) {
      show = !this.dom.shortcutsModal.classList.contains('open');
    }
    this.dom.shortcutsModal.classList.toggle('open', show);
    this.dom.shortcutsBackdrop.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  /**
   * Sleep Timer Modal.
   */
  toggleSleepTimerModal(show) {
    this.dom.sleepTimerModal.classList.toggle('open', show);
    this.dom.sleepTimerBackdrop.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  updateSleepTimerUI(secondsLeft) {
    if (this.dom.sleepTimerBadge) {
      if (secondsLeft > 0) {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        this.dom.sleepTimerBadge.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        this.dom.sleepTimerBadge.style.display = 'inline-block';
      } else {
        this.dom.sleepTimerBadge.style.display = 'none';
      }
    }
  }

  /**
   * Video Peek Modal.
   */
  toggleVideoPeekModal(show) {
    this.dom.videoPeekModal.classList.toggle('open', show);
    this.dom.videoPeekBackdrop.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
    
    // Reparent or reveal the YouTube frame container
    const ytContainer = this.dom.ytContainer;
    const modalYtHost = document.getElementById('modal-yt-host');
    const defaultYtHost = document.getElementById('hidden-yt-host');

    if (show && modalYtHost && ytContainer) {
      modalYtHost.appendChild(ytContainer);
      ytContainer.classList.add('in-modal');
    } else if (defaultYtHost && ytContainer) {
      defaultYtHost.appendChild(ytContainer);
      ytContainer.classList.remove('in-modal');
    }
  }

  /**
   * Share Current Track via Web Share API or Clipboard.
   */
  async shareCurrentTrack() {
    const track = this.player.getCurrentTrack();
    if (!track) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?track=${track.id}`;
    const shareData = {
      title: `Listen to "${track.title}" on Mehfil Radio`,
      text: `Immerse in "${track.title}" by ${track.artist} on Mehfil — free ambient Qawwali radio.`,
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        this.showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.copyShareUrl(shareUrl);
        }
      }
    } else {
      this.copyShareUrl(shareUrl);
    }
  }

  copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('Track link copied to clipboard! Send to fellow listeners 🕊️', 'success');
    }).catch(() => {
      this.showToast(`Link: ${url}`, 'info');
    });
  }

  /**
   * Checks if URL query string has ?track=<id> to autoplay selected track.
   */
  checkUrlForTrackParam() {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('track');
    if (trackId) {
      this.player.playTrackById(trackId);
    }
  }

  /**
   * Progressive Web App (PWA) Setup.
   */
  setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
          console.log('Mehfil Service Worker registered with scope:', reg.scope);
        }).catch(err => {
          console.warn('Mehfil Service Worker registration failed:', err);
        });
      });
    }

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.dom.installAppBtns.forEach(btn => {
        btn.style.display = 'inline-flex';
        btn.addEventListener('click', () => {
          btn.style.display = 'none';
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              this.showToast('Thank you for installing Mehfil App!', 'success');
            }
            this.deferredPrompt = null;
          });
        });
      });
    });
  }

  /**
   * Toast notification system.
   */
  showToast(message, type = 'info') {
    if (!this.dom.toast || !this.dom.toastMessage) return;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.dom.toastMessage.textContent = message;
    this.dom.toast.className = `toast visible ${type}`;

    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('visible');
    }, 4000);
  }

  /**
   * Dynamic Browser Tab Title.
   */
  updateBrowserTitle(track) {
    document.title = `▶ ${track.title} • Mehfil Qawwali Radio`;
  }
}

// Start app once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MehfilAppUI();
});
