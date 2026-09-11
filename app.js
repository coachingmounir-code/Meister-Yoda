/**
 * MEISTER YODA MEDITATION GUIDE – INTERACTIVE EXPERIENCE
 * Day/Night Theme, Floating Parallax, Breathwork Timer, Web Audio Synth, Yoda Oracle
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. THEME TOGGLE (TAG / NACHT MODUS)
  // ==========================================================================
  const themeSwitch = document.getElementById('theme-switch');
  const htmlRoot = document.documentElement;
  
  // Gespeichertes Theme oder System-Präferenz laden
  const savedTheme = localStorage.getItem('yoda-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  setTheme(savedTheme);

  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      playSoundChime(newTheme === 'dark' ? 320 : 528, 0.4);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('yoda-theme', theme);
    if (themeSwitch) {
      themeSwitch.setAttribute('aria-checked', theme === 'dark');
    }
  }


  // ==========================================================================
  // 2. FULLSCREEN OVERLAY MENU (ESTELLE SCOTTSDALE STYLE)
  // ==========================================================================
  const menuOverlay = document.getElementById('menu-overlay');
  const openMenuBtn = document.getElementById('open-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const menuNavItems = document.querySelectorAll('.menu-nav-item');
  const menuPreviews = document.querySelectorAll('.menu-preview-image');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (openMenuBtn && menuOverlay) {
    openMenuBtn.addEventListener('click', () => {
      menuOverlay.classList.add('open');
      menuOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playSoundChime(432, 0.2);
    });
  }

  if (closeMenuBtn && menuOverlay) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  // Mit Escape-Taste schließen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // Hover-Effekt auf Menüpunkte zeigt das zugehörige Bild an
  menuNavItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const targetPreviewId = item.getAttribute('data-preview');
      menuPreviews.forEach(img => img.classList.remove('active'));
      const activeImg = document.getElementById(targetPreviewId);
      if (activeImg) activeImg.classList.add('active');
    });
  });

  // Klick auf Menülink schließt das Menü
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  function closeMenu() {
    if (menuOverlay) {
      menuOverlay.classList.remove('open');
      menuOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }


  // ==========================================================================
  // 3. MEISTER YODA MURAL ENGINE (PARTIKEL, PARALLAX & FOCUS-MODUS)
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  const heroVisuals = document.querySelectorAll('.hero-visual');
  const muralLayers = document.querySelectorAll('.mural-canvas-layer');
  const muralAura = document.querySelector('.mural-living-aura');
  const heroTextCard = document.getElementById('hero-text-card');
  const toggleMuralBtn = document.getElementById('toggle-mural-view');
  const forceCanvas = document.getElementById('force-canvas');

  // --- A. Focus Modus Toggle: Muster ungestört betrachten ---
  if (toggleMuralBtn && heroTextCard) {
    toggleMuralBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isFocused = heroTextCard.classList.toggle('focus-mural');
      toggleMuralBtn.textContent = isFocused ? '✕ TEXT WIEDERHERSTELLEN' : '👁 MUSTER IM FOKUS';
      playSoundChime(isFocused ? 528 : 432, 0.3);
    });

    // Klick auf das Bild hebt den Focus-Modus wieder auf
    if (heroSection) {
      heroSection.addEventListener('click', (e) => {
        if (heroTextCard.classList.contains('focus-mural') && !e.target.closest('#hero-text-card')) {
          heroTextCard.classList.remove('focus-mural');
          toggleMuralBtn.textContent = '👁 MUSTER IM FOKUS';
          playSoundChime(432, 0.2);
        }
      });
    }
  }

  // --- B. 3D Parallax & Mouse Flow auf dem Meister-Mural ---
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  if (heroSection && window.innerWidth > 991) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function animateParallax() {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      const scrollY = window.pageYOffset;

      // Mural Layer leicht entgegensteuern für erhabene Tiefe
      muralLayers.forEach(layer => {
        layer.style.transform = `translate3d(${-currentX * 0.4}px, ${-currentY * 0.4 - scrollY * 0.04}px, 0) scale(1.03)`;
      });

      if (muralAura) {
        muralAura.style.transform = `translate(calc(-50% + ${currentX * 0.6}px), calc(-50% + ${currentY * 0.6}px))`;
      }

      // 4 Floating Accent Panels
      heroVisuals.forEach((visual, index) => {
        const speed = parseFloat(visual.getAttribute('data-speed')) || 0.05;
        const depthFactor = (index + 1) * 0.35;
        const xOffset = currentX * depthFactor;
        const yOffset = currentY * depthFactor - (scrollY * speed);
        visual.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      });

      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }

  // --- C. Lebendiger Macht-Partikel-Fluss (Living Force Canvas) ---
  if (forceCanvas && forceCanvas.getContext) {
    const ctx = forceCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 55;

    function resizeCanvas() {
      width = forceCanvas.width = heroSection.offsetWidth;
      height = forceCanvas.height = heroSection.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ForceParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Starten vorzugsweise in der Mitte um Meister Yoda herum
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        const angle = Math.random() * Math.PI * 2;
        const radius = init ? Math.random() * (width * 0.45) : (50 + Math.random() * 120);

        this.x = centerX + Math.cos(angle) * radius;
        this.y = centerY + Math.sin(angle) * radius;
        this.baseX = this.x;
        this.baseY = this.y;

        this.size = Math.random() * 2.5 + 0.8;
        this.speed = Math.random() * 0.6 + 0.2;
        this.angle = angle;
        this.angularSpeed = (Math.random() - 0.5) * 0.012;
        this.radialSpeed = (Math.random() - 0.5) * 0.3;
        this.waveFreq = Math.random() * 0.02 + 0.005;
        this.waveAmp = Math.random() * 25 + 10;
        this.time = Math.random() * 100;
        this.alpha = Math.random() * 0.6 + 0.2;
        
        // Farbe: Gold oder leuchtendes Kyber-Smaragdgrün
        this.isGold = Math.random() > 0.45;
      }

      update() {
        this.time += 0.03;
        this.angle += this.angularSpeed;

        // Sanfte orbitale Bewegung mit Wellenlinie entlang des Musters
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        const currentDist = Math.hypot(this.x - centerX, this.y - centerY);

        const targetDist = currentDist + this.radialSpeed + Math.sin(this.time * this.waveFreq) * 0.5;
        this.x = centerX + Math.cos(this.angle) * targetDist;
        this.y = centerY + Math.sin(this.angle) * targetDist + Math.sin(this.time) * (this.waveAmp * 0.08);

        // Sanfte Interaktion mit dem Mauszeiger
        const dx = (mouseX * (width / 30) + centerX) - this.x;
        const dy = (mouseY * (height / 30) + centerY) - this.y;
        const distToMouse = Math.hypot(dx, dy);

        if (distToMouse < 180) {
          const pushForce = (1 - distToMouse / 180) * 2;
          this.x -= (dx / distToMouse) * pushForce;
          this.y -= (dy / distToMouse) * pushForce;
        }

        // Wenn Partikel zu weit herausdriftet, sanft wiederkehren lassen
        if (this.x < -40 || this.x > width + 40 || this.y < -40 || this.y > height + 40) {
          this.reset();
        }
      }

      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        if (this.isGold) {
          ctx.fillStyle = isDark 
            ? `rgba(229, 185, 78, ${this.alpha * 0.85})` 
            : `rgba(194, 153, 56, ${this.alpha * 0.75})`;
          ctx.shadowColor = 'rgba(229, 185, 78, 0.6)';
        } else {
          ctx.fillStyle = isDark 
            ? `rgba(74, 222, 128, ${this.alpha * 0.95})` 
            : `rgba(46, 90, 54, ${this.alpha * 0.7})`;
          ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
        }

        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new ForceParticle());
    }

    function renderForceParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderForceParticles);
    }

    renderForceParticles();
  }


  // ==========================================================================
  // 4. INTERAKTIVE ATEM-MEDITATION (THE LIVING FORCE BREATH)
  // Box Breathing: Einatmen (4s) - Halten (4s) - Ausatmen (4s) - Ruhen (4s)
  // ==========================================================================
  const startBreathBtn = document.getElementById('start-breath-btn');
  const resetBreathBtn = document.getElementById('reset-breath-btn');
  const breathCard = document.querySelector('.breath-interactive-card');
  const breathPhaseText = document.getElementById('breath-phase');
  const breathCounter = document.getElementById('breath-counter');
  const breathGuidance = document.getElementById('breath-guidance');
  const cycleCountDisplay = document.getElementById('cycle-count');
  const breathMinutesDisplay = document.getElementById('breath-minutes');

  let isBreathing = false;
  let breathInterval = null;
  let sessionInterval = null;
  let currentCycleSeconds = 0;
  let completedCycles = 0;
  let totalSessionSeconds = 0;

  const PHASES = [
    { name: 'EINATMEN', class: 'inhale', duration: 4, guidance: 'Nimm die lebendige Macht in dich auf. Spüre, wie sie deinen Geist klärt und weitet.' },
    { name: 'HALTEN', class: 'hold-in', duration: 4, guidance: 'Ruhe in der Fülle. Kein Gedanke, kein Wollen. Reines Dasein.' },
    { name: 'AUSATMEN', class: 'exhale', duration: 4, guidance: 'Verlernen, was du gelernt hast. Lasse alle Anspannung in die Erde fließen.' },
    { name: 'LEERE', class: 'hold-out', duration: 4, guidance: 'Die vollkommene Stille. Im Raum des Nichts dein wahres Selbst du findest.' }
  ];

  if (startBreathBtn) {
    startBreathBtn.addEventListener('click', toggleBreathing);
  }

  if (resetBreathBtn) {
    resetBreathBtn.addEventListener('click', resetBreathing);
  }

  function toggleBreathing() {
    if (!isBreathing) {
      startBreathing();
    } else {
      pauseBreathing();
    }
  }

  function startBreathing() {
    isBreathing = true;
    startBreathBtn.textContent = 'PAUSIEREN';
    startBreathBtn.classList.add('active');
    
    // Web Audio aktivieren
    initAudioContext();
    playSoundChime(432, 0.4);

    runBreathStep();
    breathInterval = setInterval(runBreathStep, 1000);

    if (!sessionInterval) {
      sessionInterval = setInterval(() => {
        totalSessionSeconds++;
        updateSessionTimer();
      }, 1000);
    }
  }

  function pauseBreathing() {
    isBreathing = false;
    startBreathBtn.textContent = 'FORTSETZEN';
    clearInterval(breathInterval);
  }

  function resetBreathing() {
    pauseBreathing();
    currentCycleSeconds = 0;
    completedCycles = 0;
    totalSessionSeconds = 0;
    startBreathBtn.textContent = 'ATEMÜBUNG STARTEN';

    if (breathCard) {
      breathCard.className = 'breath-interactive-card';
    }
    if (breathPhaseText) breathPhaseText.textContent = 'BEREIT?';
    if (breathCounter) breathCounter.textContent = '4';
    if (breathGuidance) breathGuidance.textContent = 'Klicke auf Beginn. Schließe sanft die Augen oder lasse den Blick weich werden. Folge dem Puls der Macht.';
    if (cycleCountDisplay) cycleCountDisplay.textContent = '0';
    if (breathMinutesDisplay) breathMinutesDisplay.textContent = '0:00';
    clearInterval(sessionInterval);
    sessionInterval = null;
  }

  function runBreathStep() {
    const cyclePos = currentCycleSeconds % 16;
    const phaseIndex = Math.floor(cyclePos / 4);
    const secondsInPhase = 4 - (cyclePos % 4);
    const currentPhase = PHASES[phaseIndex];

    // CSS Klasse für Animation setzen
    if (breathCard) {
      breathCard.className = `breath-interactive-card breath-active ${currentPhase.class}`;
    }

    if (breathPhaseText) breathPhaseText.textContent = currentPhase.name;
    if (breathCounter) breathCounter.textContent = secondsInPhase;
    if (breathGuidance) breathGuidance.textContent = currentPhase.guidance;

    // Klang bei Phasenwechsel
    if (cyclePos % 4 === 0) {
      const frequencies = [432, 528, 384, 432];
      playSoundChime(frequencies[phaseIndex], 0.25);
    }

    currentCycleSeconds++;

    // Wenn ein voller Zyklus vollendet ist
    if (currentCycleSeconds % 16 === 0) {
      completedCycles++;
      if (cycleCountDisplay) cycleCountDisplay.textContent = completedCycles;
    }
  }

  function updateSessionTimer() {
    const mins = Math.floor(totalSessionSeconds / 60);
    const secs = totalSessionSeconds % 60;
    if (breathMinutesDisplay) {
      breathMinutesDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }


  // ==========================================================================
  // 5. YODA WEISHEITS-ORAKEL (KONTEMPLATION DES TAGES)
  // ==========================================================================
  const oracleQuotes = [
    {
      quote: "„Tu es oder tu es nicht. Es gibt kein Versuchen.“",
      meaning: "Gib dich der Stille oder der Handlung vollkommen hin. Halbe Absichten nähren das Zweifeln."
    },
    {
      quote: "„Verlernen du musst, was früher du gelernt.“",
      meaning: "Alte Denkmuster und starre Erwartungen blockieren den Fluss der Macht. Beginne stets mit dem Geist des Anfängers."
    },
    {
      quote: "„Größe bedeutet nichts. Sieh mich an. Nach meiner Größe beurteilst du mich?“",
      meaning: "Wahre Kraft liegt nicht in äußerer Pracht oder Form, sondern in der unscheinbaren Tiefe deines stillen Bewusstseins."
    },
    {
      quote: "„Immer in die Zukunft geblickt du hast. Nie im Hier und Jetzt dein Geist gewesen ist.“",
      meaning: "Befreie dich von der ständigen Sorge um das Kommende. Das einzige Tor zur Macht existiert in genau dieser Sekunde."
    },
    {
      quote: "„Erleuchtete Wesen sind wir, nicht diese rohe Materie.“",
      meaning: "Du bist unendlich mehr als deine Gedanken, deine Ängste oder deine körperlichen Beschwerden. Erkenne dein wahres Wesen."
    },
    {
      quote: "„Friedvoll, passiv ein Jedi die Macht nutzt. Zur Erkenntnis und Verteidigung, nie zum Angriff.“",
      meaning: "Kämpfe nicht gegen aufsteigende Gedanken in der Meditation an. Heiße sie willkommen und lass sie weiterziehen wie Wolken am Himmel."
    },
    {
      quote: "„Geduld du haben musst, junger Padawan.“",
      meaning: "Innere Ruhe lässt sich nicht erzwingen. Sie entfaltet sich von selbst, wenn der Zwang zu handeln zur Ruhe kommt."
    },
    {
      quote: "„Furcht ist der Pfad zur dunklen Seite. Furcht führt zu Wut, Wut zu Hass, Hass zu unendlichem Leid.“",
      meaning: "Beobachte die Wurzel deiner Sorgen ohne Scham. Im Licht achtsamer Betrachtung löst sich die Furcht auf."
    }
  ];

  const oracleTriggerBtn = document.getElementById('oracle-trigger-btn');
  const oracleText = document.getElementById('oracle-text');
  const oracleMeaning = document.getElementById('oracle-meaning');
  let currentQuoteIndex = 0;

  if (oracleTriggerBtn) {
    oracleTriggerBtn.addEventListener('click', () => {
      oracleText.style.opacity = 0;
      oracleMeaning.style.opacity = 0;

      playSoundChime(528, 0.35);

      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * oracleQuotes.length);
        } while (newIndex === currentQuoteIndex);

        currentQuoteIndex = newIndex;
        const item = oracleQuotes[currentQuoteIndex];

        oracleText.textContent = item.quote;
        oracleMeaning.textContent = item.meaning;

        oracleText.style.opacity = 1;
        oracleMeaning.style.opacity = 1;
      }, 300);
    });
  }


  // ==========================================================================
  // 6. ECHTZEIT WEB AUDIO SYNTHESIZER (DAGOBAH SOUNDSCAPES)
  // Reiner synthetischer Browser-Klang: Regenwald, 432 Hz Glocke & Alpha-Drone
  // ==========================================================================
  let audioCtx = null;
  let masterGain = null;
  let isSoundPlaying = false;
  let currentTrack = 'rain';
  let activeNodes = [];

  const soundscapeBtn = document.getElementById('soundscape-btn');
  const playMasterBtn = document.getElementById('play-master-sound');
  const playIcon = document.getElementById('play-icon');
  const volumeControl = document.getElementById('volume-control');
  const soundTrackBtns = document.querySelectorAll('.sound-track-btn');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sanfter Zen-Klangschalen-Chime
  function playSoundChime(freq = 432, duration = 1.2) {
    try {
      initAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn("Audio Context noch nicht initialisiert:", err);
    }
  }

  // Soundscape Tracks umschalten
  soundTrackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundTrackBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTrack = btn.getAttribute('data-sound');

      if (isSoundPlaying) {
        stopSoundscape();
        startSoundscape();
      }
    });
  });

  // Start / Stopp Button
  if (playMasterBtn) {
    playMasterBtn.addEventListener('click', toggleSoundscape);
  }
  if (soundscapeBtn) {
    soundscapeBtn.addEventListener('click', toggleSoundscape);
  }

  function toggleSoundscape() {
    initAudioContext();
    if (!isSoundPlaying) {
      startSoundscape();
    } else {
      stopSoundscape();
    }
  }

  function startSoundscape() {
    isSoundPlaying = true;
    if (playIcon) playIcon.textContent = '⏸ KLANG ANHALTEN';
    if (soundscapeBtn) soundscapeBtn.classList.add('active');

    if (currentTrack === 'rain') {
      startRainNoise();
    } else if (currentTrack === 'bowl') {
      startTibetanBowlLoop();
    } else if (currentTrack === 'drone') {
      startAlphaDrone();
    }
  }

  function stopSoundscape() {
    isSoundPlaying = false;
    if (playIcon) playIcon.textContent = '▶ KLANG STARTEN';
    if (soundscapeBtn) soundscapeBtn.classList.remove('active');

    activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodes = [];
  }

  // 1. Synthetischer Dagobah-Regen (Gefiltertes Pink/Brown Noise)
  function startRainNoise() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise filter
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Sanfter Tiefpassfilter für warmen Regen
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    const rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(masterGain);

    noise.start();
    activeNodes.push(noise, filter, rainGain);
  }

  // 2. Kontinuierlich schwingende 432 Hz Kyber-Klangschale
  function startTibetanBowlLoop() {
    const baseFreq = 432;
    const harmonics = [baseFreq, baseFreq * 1.5, baseFreq * 2];
    
    harmonics.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      // LFO für sanftes Schwingen
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.05, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      
      gain.gain.setValueAtTime(0.08 / (idx + 1), audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      lfo.start();
      activeNodes.push(osc, gain, lfo, lfoGain);
    });
  }

  // 3. Kosmischer Alpha-Wellen Binaural Drone
  function startAlphaDrone() {
    const root = 108; // Tiefes Frequenzerlebnis
    const binauralBeat = 6; // 6 Hz Theta / tiefe Meditation

    const oscLeft = audioCtx.createOscillator();
    const oscRight = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();

    oscLeft.type = 'triangle';
    oscRight.type = 'sine';

    oscLeft.frequency.setValueAtTime(root, audioCtx.currentTime);
    oscRight.frequency.setValueAtTime(root + binauralBeat, audioCtx.currentTime);

    droneGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

    oscLeft.connect(droneGain);
    oscRight.connect(droneGain);
    droneGain.connect(masterGain);

    oscLeft.start();
    oscRight.start();
    activeNodes.push(oscLeft, oscRight, droneGain);
  }

  // Lautstärkeregler
  if (volumeControl) {
    volumeControl.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
      }
    });
  }

});
