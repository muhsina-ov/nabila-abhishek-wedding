/* ==========================================================================
   NABILA & ABHISHEK ROYAL WEDDING CELEBRATION
   BASE THEME: WAX SEAL ROYALE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. WAX SEAL ROYALE ENTRANCE & VIDEO / AUDIO ORCHESTRATION
     (Faithful to template-wax-seal-royale interaction flow)
     ------------------------------------------------------------------------ */
  const overlay   = document.getElementById('weiOverlay');
  const videoWrap = document.getElementById('weiVideoWrap');
  const video     = document.getElementById('weiVideo');
  const audio     = document.getElementById('weiAudio');
  const audioBtn  = document.getElementById('weiAudioBtn');
  const iconPause = document.getElementById('weiIconPause');
  const iconPlay  = document.getElementById('weiIconPlay');

  let sequenceStarted = false;
  let sequenceEnded = false;
  let fallbackTimer = null;
  let fallbackListenersAttached = false;

  function updateAudioButtonState(isPlaying) {
    if (iconPlay && iconPause) {
      if (isPlaying) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    }
  }

  function playAudioSafely() {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateAudioButtonState(true);
        detachAudioFallbackListeners();
      }).catch(err => {
        console.warn('Audio autoplay prevented by browser; queued for first user touch:', err);
        updateAudioButtonState(false);
        attachAudioFallbackListeners();
      });
    }
  }

  function onUserGestureToUnlockAudio() {
    if (audio && audio.paused) {
      playAudioSafely();
    }
  }

  function attachAudioFallbackListeners() {
    if (fallbackListenersAttached) return;
    fallbackListenersAttached = true;
    ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
      document.addEventListener(evt, onUserGestureToUnlockAudio, { passive: true });
    });
  }

  function detachAudioFallbackListeners() {
    if (!fallbackListenersAttached) return;
    fallbackListenersAttached = false;
    ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
      document.removeEventListener(evt, onUserGestureToUnlockAudio);
    });
  }

  if (audio) {
    audio.addEventListener('play', () => updateAudioButtonState(true));
    audio.addEventListener('pause', () => updateAudioButtonState(false));
  }

  // Prepare video for strict mobile browser autoplay policies
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
  }

  if (window.location.search.includes('skip') || window.location.search.includes('gate=open')) {
    if (overlay) overlay.style.display = 'none';
    if (videoWrap) videoWrap.style.display = 'none';
    document.body.classList.remove('envelope-active', 'video-active');
    if (audioBtn) {
      audioBtn.style.visibility = 'visible';
      audioBtn.style.opacity = '1';
    }
    sequenceStarted = true;
    sequenceEnded = true;
  }

  function startInvitationSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    // 1. Immediately trigger audio in the synchronous user-gesture stack
    playAudioSafely();

    // Lock page and ensure content is hidden until video completes
    document.body.classList.add('video-active');
    document.body.classList.add('envelope-active');

    // 2. Play envelope unveiling video
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video playback retry needed:', err);
          video.muted = true;
          video.play().catch(() => {
            setTimeout(endInvitationSequence, 1500);
          });
        });
      }
    }

    // 3. Smoothly cross-fade envelope into the playing video
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 800);
    }

    if (videoWrap) {
      videoWrap.classList.add('wei-video-in');
    }

    // 4. Safety fallback timer (Video length is ~6.0s; fallback at 6.8s ensures no guest is trapped)
    fallbackTimer = setTimeout(() => {
      endInvitationSequence();
    }, 6800);
  }

  function endInvitationSequence() {
    if (sequenceEnded) return;
    sequenceEnded = true;

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    // Pin viewport directly to the top (Hero Artboard)
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Smoothly fade out the video layer
    if (videoWrap) {
      videoWrap.classList.remove('wei-video-in');
      videoWrap.classList.add('wei-video-out');
      setTimeout(() => {
        videoWrap.style.display = 'none';
        if (video) video.pause();
      }, 1200);
    }

    // Unveil the main site & Hero section with full scroll unlocked
    document.body.classList.remove('envelope-active', 'video-active');

    // Ensure hero swans video is playing
    const heroVideo = document.querySelector('#rec2487446043 video, .hero-arched-video');
    if (heroVideo) {
      heroVideo.play().catch(() => {});
    }

    // Reveal floating royal audio widget
    if (audioBtn) {
      audioBtn.style.visibility = 'visible';
      audioBtn.style.opacity = '1';
    }

    // Hook up smooth scrolling to countdown on hero "Scroll down" prompt
    const scrollDownElem = document.querySelector('#rec2487446043 [data-elem-id="1782235970225000002"]');
    const chevronElem    = document.querySelector('#rec2487446043 [data-elem-id="1782235970224000001"]');
    [scrollDownElem, chevronElem].forEach(el => {
      if (el && !el.dataset.listenerAttached) {
        el.dataset.listenerAttached = '1';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById('countdown') || document.querySelector('.section');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });

    // Ensure hero background stretches till the text ends + 20 pixels
    syncHeroBackgroundHeight();
  }

  /* ------------------------------------------------------------------------
     HERO BACKGROUND EXACT STRETCH CONTROLLER
     "stretch the background till the text ends + 20 pixels"
     ------------------------------------------------------------------------ */
  function syncHeroBackgroundHeight() {
    const artboard = document.querySelector('#rec2487446043 .t396__artboard');
    const bgElem = document.querySelector('#rec2487446043 [data-elem-id="1779527203760000001"]');
    const textElem = document.querySelector('#rec2487446043 [data-elem-id="1780748008617000005"]');
    if (!artboard || !bgElem || !textElem) return;

    // Measure rendered bottom edge of the message text inside the artboard
    const artboardRect = artboard.getBoundingClientRect();
    const textRect = textElem.getBoundingClientRect();
    const textBottom = textRect.bottom - artboardRect.top;

    // Requirement: stretch background till text ends + 20 pixels
    const targetBottom = Math.ceil(textBottom + 20);
    const bgTop = 750;
    const bgHeight = Math.max(120, targetBottom - bgTop);

    bgElem.style.setProperty('top', bgTop + 'px', 'important');
    bgElem.style.setProperty('height', bgHeight + 'px', 'important');

    const bgImg = bgElem.querySelector('.tn-atom__img');
    if (bgImg) {
      bgImg.style.setProperty('height', '100%', 'important');
      bgImg.style.setProperty('object-fit', 'fill', 'important');
    }

    // Set artboard height to match targetBottom so there is no dead blank space
    artboard.style.setProperty('height', targetBottom + 'px', 'important');
    artboard.style.setProperty('--initial-scale-height', targetBottom + 'px');

    const carrier = artboard.querySelector('.t396__carrier');
    if (carrier) carrier.style.setProperty('height', targetBottom + 'px', 'important');
    const filter = artboard.querySelector('.t396__filter');
    if (filter) filter.style.setProperty('height', targetBottom + 'px', 'important');
  }

  // Initial and responsive triggers for hero background height
  syncHeroBackgroundHeight();
  window.addEventListener('load', syncHeroBackgroundHeight);
  window.addEventListener('resize', syncHeroBackgroundHeight);
  window.addEventListener('orientationchange', syncHeroBackgroundHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeroBackgroundHeight);
  }
  setTimeout(syncHeroBackgroundHeight, 400);
  setTimeout(syncHeroBackgroundHeight, 1200);

  // Trigger opening on tap or click (supports touchstart, pointerdown, touchend, click)
  if (overlay) {
    let handled = false;
    const triggerStart = (e) => {
      if (handled) return;
      handled = true;
      startInvitationSequence();
    };

    ['pointerdown', 'touchstart', 'touchend', 'click'].forEach(evt => {
      overlay.addEventListener(evt, triggerStart, { passive: true });
    });
  }

  // Monitor video progress to smoothly reveal hero at the conclusion
  if (video) {
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.5 && !video.dataset.fading) {
        video.dataset.fading = '1';
        endInvitationSequence();
      }
    });

    video.addEventListener('ended', endInvitationSequence);
  }

  // Floating Audio Toggle Button Handler
  if (audioBtn && audio) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        playAudioSafely();
      } else {
        audio.pause();
        updateAudioButtonState(false);
      }
    });
  }


  /* ------------------------------------------------------------------------
     2. INTERACTIVE SCRATCH-TO-REVEAL DATE CARD
     ------------------------------------------------------------------------ */
  const scratchContainer = document.getElementById('scratch-date-container');
  const scratchCanvas    = document.getElementById('scratch-canvas');
  const scratchHint      = document.getElementById('scratch-hint');

  if (scratchCanvas && scratchContainer) {
    const ctx = scratchCanvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    let strokesCount = 0;

    // Support High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    const width = 250;
    const height = 60;

    scratchCanvas.width = width * dpr;
    scratchCanvas.height = height * dpr;
    scratchCanvas.style.width = width + 'px';
    scratchCanvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Render luxury metallic gold foil coating
    function initFoil() {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#E5C469');
      grad.addColorStop(0.2, '#B88728');
      grad.addColorStop(0.48, '#FFF6CE');
      grad.addColorStop(0.72, '#D49B24');
      grad.addColorStop(1, '#8C5E14');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle metallic glitter pattern
      for (let i = 0; i < 42; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.55)' : 'rgba(110, 75, 15, 0.28)';
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant gold foil stamp border
      ctx.strokeStyle = 'rgba(255, 248, 215, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      // Gold foil stamp text
      ctx.font = '700 10.5px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(75, 45, 10, 0.88)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', width / 2, height / 2);
      ctx.shadowColor = 'transparent';
    }

    initFoil();

    function getPointerPos(e) {
      const b = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - b.left,
        y: clientY - b.top
      };
    }

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();

      strokesCount++;
      // Check cleared percentage periodically
      if (strokesCount % 8 === 0) {
        checkClearedPercent();
      }
    }

    function checkClearedPercent() {
      if (isRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imgData.data;
        let transparentPixels = 0;
        const step = 32;
        let totalSampled = 0;

        for (let i = 3; i < pixels.length; i += 4 * step) {
          totalSampled++;
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const ratio = transparentPixels / totalSampled;
        if (ratio > 0.35) { // 35% scratched -> smooth auto reveal!
          revealComplete();
        }
      } catch (err) {
        // Fallback for CORS or canvas errors
      }
    }

    function revealComplete() {
      if (isRevealed) return;
      isRevealed = true;
      scratchCanvas.style.opacity = '0';
      scratchCanvas.style.pointerEvents = 'none';
      if (scratchHint) {
        scratchHint.innerHTML = '<span class="scratch-hint-pill" style="color: #6B1D2F; border-color: #D4AF37; background: #FFFDF8;"><i class="fa-solid fa-crown" style="color: #A67D2B;"></i> Date Unveiled • Saturday, 17 Oct 2026</span>';
      }
      setTimeout(() => {
        scratchCanvas.style.display = 'none';
      }, 600);
    }

    // Pointer events (handles Mouse and Touch simultaneously)
    scratchCanvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('pointerup', () => {
      if (isDrawing) {
        isDrawing = false;
        checkClearedPercent();
      }
    });

    // Touch event fallback
    scratchCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    }, { passive: false });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    }, { passive: false });

    scratchCanvas.addEventListener('touchend', () => {
      isDrawing = false;
      checkClearedPercent();
    });
  }


  /* ------------------------------------------------------------------------
     3. REAL-TIME LIVE WEDDING COUNTDOWN TIMER
     Wedding Date: October 17, 2026, 11:00 AM IST (+05:30)
     ------------------------------------------------------------------------ */
  const weddingDate = new Date('2026-10-17T11:00:00+05:30').getTime();

  const daysEl    = document.getElementById('count-days');
  const hoursEl   = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl)    daysEl.textContent    = String(days).padStart(2, '0');
    if (hoursEl)   hoursEl.textContent   = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ------------------------------------------------------------------------
     3. EVENT SCHEDULE FILTER TABS
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      eventCards.forEach(card => {
        const cardDay = card.getAttribute('data-event-day');
        if (filter === 'all' || cardDay === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     4. ADD TO CALENDAR / GOOGLE CALENDAR & .ICS GENERATOR
     ------------------------------------------------------------------------ */
  const calBtns = document.querySelectorAll('.cal-btn');

  calBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title    = btn.getAttribute('data-title') || 'Nabila & Abhishek Wedding Event';
      const startIso = btn.getAttribute('data-start'); // '2026-10-17T11:00:00'
      const endIso   = btn.getAttribute('data-end');
      const location = btn.getAttribute('data-location') || 'Albion Farms, Morni Hills';

      // Format for Google Calendar (YYYYMMDDTHHmmssZ)
      const startDate = new Date(startIso + '+05:30');
      const endDate   = new Date(endIso + '+05:30');

      const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent('Celebration with Nabila & Abhishek. We look forward to celebrating together!')}&location=${encodeURIComponent(location)}`;

      // Open Google Calendar in new tab
      window.open(gcalUrl, '_blank');
    });
  });


  /* ------------------------------------------------------------------------
     5. LIGHTBOX MODAL FOR GALLERY & CEREMONY ARTWORKS
     ------------------------------------------------------------------------ */
  const lightboxModal   = document.getElementById('lightbox-modal');
  const lightboxImg     = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose   = document.getElementById('lightbox-close');

  function openLightbox(fullSrc, captionText) {
    if (lightboxModal && lightboxImg && fullSrc) {
      lightboxImg.src = fullSrc;
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText || '';
        lightboxCaption.style.display = captionText ? 'block' : 'none';
      }
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Gallery items
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const fullSrc = thumb.getAttribute('data-full');
      const caption = thumb.getAttribute('data-caption') || thumb.querySelector('img')?.alt || 'Wedding Gallery Photo';
      openLightbox(fullSrc, caption);
    });
  });

  // Portrait & Event artwork hero media & expand buttons
  const expandableMedias = document.querySelectorAll('.event-hero-media, .event-hero-expand-btn, .couple-portrait-frame, .couple-expand-btn, .rajwada-card-media, .story-expand-badge');
  expandableMedias.forEach(elem => {
    elem.addEventListener('click', (e) => {
      // Don't trigger if clicked on link or other interactive elements
      if (e.target.closest('a') || e.target.closest('.btn-card-itinerary') || e.target.closest('.cal-btn')) return;
      const targetWithData = elem.closest('[data-full]') || elem;
      const fullSrc = targetWithData.getAttribute('data-full');
      const caption = targetWithData.getAttribute('data-caption') || targetWithData.querySelector('img')?.alt || '';
      if (fullSrc) {
        openLightbox(fullSrc, caption);
      }
    });
  });

  /* ------------------------------------------------------------------------
     COUPLE TABS (Lineage vs Heritage Blessing)
     ------------------------------------------------------------------------ */
  const coupleTabBtns = document.querySelectorAll('.couple-tab-btn');
  coupleTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.couple-card');
      if (!card) return;
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state in this card
      card.querySelectorAll('.couple-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane active state in this card
      card.querySelectorAll('.couple-tab-pane').forEach(pane => {
        if (pane.getAttribute('data-pane') === targetTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     SHOWER BLESSINGS & ROSE PETALS (Interactive Couple Blessing)
     ------------------------------------------------------------------------ */
  const showerBtn = document.getElementById('btn-shower-blessings');
  const waxSealInteractive = document.getElementById('wax-seal-interactive');
  const blessingCountElem = document.getElementById('blessing-count');

  let blessingCount = parseInt(localStorage.getItem('wedding_blessing_count') || '354', 10);
  if (blessingCountElem) {
    blessingCountElem.textContent = blessingCount.toLocaleString();
  }

  function triggerPetalShower() {
    blessingCount++;
    if (blessingCountElem) {
      blessingCountElem.textContent = blessingCount.toLocaleString();
    }
    localStorage.setItem('wedding_blessing_count', blessingCount.toString());

    if (showerBtn) {
      showerBtn.style.transform = 'scale(0.96)';
      setTimeout(() => { showerBtn.style.transform = ''; }, 200);
    }

    // Spawn 28 falling rose, marigold petals and golden sparkles
    const petalColors = [
      '#D92546', '#8B1E2F', '#FFA500', '#FFD700', '#FAD2E1', '#C71585', '#FFF0F5'
    ];

    const count = 30;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'falling-petal';

      const isCircle = Math.random() > 0.6;
      const size = Math.floor(Math.random() * 16) + 12;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const startX = Math.random() * window.innerWidth;
      const driftX = (Math.random() - 0.5) * 220 + 'px';
      const duration = (Math.random() * 2.5 + 2.8) + 's';
      const rot = (Math.random() * 720 - 360) + 'deg';

      petal.style.left = `${startX}px`;
      petal.style.top = '-20px';
      petal.style.width = `${size}px`;
      petal.style.height = `${isCircle ? size : size * 1.5}px`;
      petal.style.backgroundColor = color;
      petal.style.borderRadius = isCircle ? '50%' : '50% 0 50% 50%';
      petal.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.18)';
      petal.style.setProperty('--drift-x', driftX);
      petal.style.setProperty('--rot', rot);
      petal.style.animationDuration = duration;

      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 5500);
    }
  }

  if (showerBtn) showerBtn.addEventListener('click', triggerPetalShower);
  if (waxSealInteractive) waxSealInteractive.addEventListener('click', triggerPetalShower);

  /* ------------------------------------------------------------------------
     EVENT CEREMONY ITINERARY ACCORDIONS
     ------------------------------------------------------------------------ */
  const itineraryBtns = document.querySelectorAll('.btn-card-itinerary');
  itineraryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.event-card');
      if (!card) return;
      const drawer = card.querySelector('.event-itinerary-drawer');
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');

      // Close all other itinerary drawers for sleek focus
      document.querySelectorAll('.event-itinerary-drawer.open').forEach(d => {
        if (d !== drawer) {
          d.classList.remove('open');
          const parent = d.closest('.event-card');
          if (parent) {
            parent.classList.remove('itinerary-open');
            const toggle = parent.querySelector('.btn-card-itinerary');
            if (toggle) {
              toggle.classList.remove('active');
              toggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });

      if (isOpen) {
        drawer.classList.remove('open');
        card.classList.remove('itinerary-open');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('open');
        card.classList.add('itinerary-open');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------------
     EVENT COUNTDOWN PILLS
     ------------------------------------------------------------------------ */
  const countdownPills = document.querySelectorAll('.event-countdown-pill');
  function updateEventCountdowns() {
    const now = new Date().getTime();
    countdownPills.forEach(pill => {
      const dateStr = pill.getAttribute('data-event-date');
      if (!dateStr) return;
      const targetTime = new Date(dateStr).getTime();
      const diff = targetTime - now;

      const cdText = pill.querySelector('.cd-text');
      if (!cdText) return;

      if (diff <= 0) {
        cdText.textContent = 'Today!';
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) {
          cdText.textContent = `${days}d ${hours}h`;
        } else {
          cdText.textContent = `${hours}h left`;
        }
      }
    });
  }
  updateEventCountdowns();
  setInterval(updateEventCountdowns, 60000);

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });








  /* ------------------------------------------------------------------------
     8. AMBIENT GOLD DUST & PETAL CANVAS PARTICLES
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width  = canvas.width  = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? 'rgba(166, 125, 43, ' : 'rgba(218, 165, 32, '
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(166, 125, 43, 0.4)';
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
  /* ------------------------------------------------------------------------
     INTERACTIVE LOVE STORY SCROLLING LINE & SHINING LIGHT CONTROLLER
     ------------------------------------------------------------------------ */
  const timelineContainer = document.getElementById('story-timeline');
  const lineFill          = document.getElementById('story-scroll-line-fill');
  const shiningLight      = document.getElementById('story-shining-light');
  const timelineItems     = document.querySelectorAll('.story-timeline-item');
  const stepNodes         = document.querySelectorAll('.story-step-node');
  const scrollNextBtns    = document.querySelectorAll('.story-scroll-next-btn');

  function updateStoryScrollLine() {
    if (!timelineContainer || !lineFill || !shiningLight) return;

    const containerRect = timelineContainer.getBoundingClientRect();
    const windowHeight  = window.innerHeight;
    const triggerY      = windowHeight * 0.52; // Active focal point in viewport

    const scrolledDist  = triggerY - containerRect.top;
    const totalDist     = containerRect.height;

    let progress = scrolledDist / totalDist;
    progress = Math.max(0, Math.min(1, progress));

    // Update the vertical golden line height
    lineFill.style.height = `${(progress * 100).toFixed(2)}%`;

    // Update shining light position along the vertical spine
    shiningLight.style.top = `${(progress * 100).toFixed(2)}%`;
    shiningLight.style.opacity = progress > 0.005 ? '1' : '0';

    // Milestone chapters & active nodes
    let latestReachedIndex = 0;
    timelineItems.forEach((item, idx) => {
      const node = item.querySelector('.story-timeline-node');
      if (node) {
        const nodeRect = node.getBoundingClientRect();
        if (nodeRect.top <= triggerY + 24) {
          item.classList.add('reached');
          latestReachedIndex = idx;
        } else {
          item.classList.remove('reached');
        }
      }
    });

    // Synchronize top chapter stepper nodes
    stepNodes.forEach((btn, idx) => {
      const isActive = (idx === latestReachedIndex);
      const isPassed = (idx < latestReachedIndex);
      btn.classList.toggle('active', isActive);
      btn.classList.toggle('passed', isPassed);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  // Smooth click-to-scroll on Top Stepper Nodes
  stepNodes.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = btn.getAttribute('data-scroll-to');
      const targetItem = document.getElementById(`story-chapter-${targetIdx}`);
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Smooth click-to-scroll on In-Card Next Buttons
  scrollNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = btn.getAttribute('data-scroll-to');
      const targetItem = document.getElementById(`story-chapter-${targetIdx}`);
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Throttled Scroll Listener using requestAnimationFrame
  let isStoryScrollTicking = false;
  function handleStoryScroll() {
    if (!isStoryScrollTicking) {
      requestAnimationFrame(() => {
        updateStoryScrollLine();
        isStoryScrollTicking = false;
      });
      isStoryScrollTicking = true;
    }
  }

  window.addEventListener('scroll', handleStoryScroll, { passive: true });
  window.addEventListener('resize', handleStoryScroll, { passive: true });

  // Initial calculation
  updateStoryScrollLine();

});

