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

  if (window.location.search.includes('skip') || window.location.search.includes('gate=open')) {
    if (overlay) overlay.style.display = 'none';
    if (videoWrap) videoWrap.style.display = 'none';
    document.body.classList.remove('envelope-active');
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

    // 1. Smoothly fade out envelope cover
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1400);
    }

    // 2. Fade in wax seal breaking video
    if (videoWrap) {
      videoWrap.classList.add('wei-video-in');
    }

    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video auto-playback deferred:', err);
          // If video playback fails on low-power mode, complete sequence gracefully
          setTimeout(endInvitationSequence, 1200);
        });
      }
    }

    // 3. Play Ludovico Einaudi - Divenire soundtrack
    if (audio) {
      audio.volume = 1;
      const audioPromise = audio.play();
      if (audioPromise !== undefined) {
        audioPromise.catch(err => {
          console.warn('Audio auto-playback notice:', err);
        });
      }
    }
  }

  function endInvitationSequence() {
    if (sequenceEnded) return;
    sequenceEnded = true;

    // Re-enable smooth scrolling on page
    document.body.classList.remove('envelope-active');

    // Smoothly fade out the video
    if (videoWrap) {
      videoWrap.classList.remove('wei-video-in');
      videoWrap.classList.add('wei-video-out');
      setTimeout(() => {
        videoWrap.style.display = 'none';
      }, 1400);
    }

    // Reveal floating royal burgundy audio button
    if (audioBtn) {
      audioBtn.style.visibility = 'visible';
      audioBtn.style.opacity = '1';
    }
  }

  // Trigger opening on tap or click
  if (overlay) {
    overlay.addEventListener('click', startInvitationSequence);
    overlay.addEventListener('touchstart', startInvitationSequence, { passive: true });
  }

  // Allow guest to tap video to skip directly to invitation
  if (videoWrap) {
    videoWrap.addEventListener('click', endInvitationSequence);
  }

  // Fade out video 0.8 seconds before end
  if (video) {
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.8 && !video.dataset.fading) {
        video.dataset.fading = '1';
        endInvitationSequence();
      }
    });

    video.addEventListener('ended', endInvitationSequence);
    video.load();
  }

  // Floating Audio Toggle Button Handler
  if (audioBtn && audio) {
    audioBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
        }).catch(() => {});
      } else {
        audio.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
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
      const caption = thumb.querySelector('img')?.alt || 'Wedding Gallery Photo';
      openLightbox(fullSrc, caption);
    });
  });

  // Event artwork hero media & expand buttons
  const eventHeroMedias = document.querySelectorAll('.event-hero-media, .event-hero-expand-btn');
  eventHeroMedias.forEach(elem => {
    elem.addEventListener('click', (e) => {
      // Don't trigger if clicked on link or other interactive elements
      if (e.target.closest('a')) return;
      const targetWithData = elem.closest('[data-full]') || elem;
      const fullSrc = targetWithData.getAttribute('data-full');
      const caption = targetWithData.getAttribute('data-caption') || targetWithData.querySelector('img')?.alt || '';
      if (fullSrc) {
        openLightbox(fullSrc, caption);
      }
    });
  });

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
     7. FLOATING DOCK ACTIVE SECTION OBSERVER
     ------------------------------------------------------------------------ */
  const dockItems = document.querySelectorAll('.dock-item');
  const sections  = document.querySelectorAll('header, section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dockItems.forEach(item => {
          if (item.getAttribute('data-nav') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));


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

});
