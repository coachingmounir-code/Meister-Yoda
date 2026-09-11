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
  // 3. HERO FLOATING PANELS PARALLAX & MOUSE FLOAT
  // ==========================================================================
  const heroVisuals = document.querySelectorAll('.hero-visual');
  const heroSection = document.getElementById('hero');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  if (heroSection && heroVisuals.length > 0 && window.innerWidth > 991) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 25;
    });

    // Sanfte Parallax-Animation per requestAnimationFrame
    function animateParallax() {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      const scrollY = window.pageYOffset;

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
