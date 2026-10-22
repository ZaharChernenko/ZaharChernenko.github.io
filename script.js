/**
 * Chicago95 Interactive Engine
 * Portfolio Website for Zahar Chernenko
 */

(function () {
  'use strict';

  // --- Retro Sound Synthesizer (Web Audio API) ---
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
  function playClick(freq = 750, duration = 0.03) {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted, ignore
    }
  }

  // --- Tabs Navigation ---
  const tabButtons = document.querySelectorAll('.retro-tab');
  const secExp = document.getElementById('sec-exp');
  const secEdu = document.getElementById('sec-edu');
  const secSkills = document.getElementById('sec-skills');

  function switchTab(tabId) {
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (tabId === 'tab-all') {
      secExp.style.display = 'block';
      secEdu.style.display = 'block';
      secSkills.style.display = 'block';
    } else if (tabId === 'tab-exp') {
      secExp.style.display = 'block';
      secEdu.style.display = 'none';
      secSkills.style.display = 'none';
    } else if (tabId === 'tab-edu') {
      secExp.style.display = 'none';
      secEdu.style.display = 'block';
      secSkills.style.display = 'none';
    } else if (tabId === 'tab-skills') {
      secExp.style.display = 'none';
      secEdu.style.display = 'none';
      secSkills.style.display = 'block';
    }

    playClick(850, 0.04);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Action links from View menu
  document.querySelectorAll('.tab-action').forEach(item => {
    item.addEventListener('click', () => {
      closeAllDropdowns();
      switchTab(item.dataset.tab);
    });
  });

  // --- Menu Bar Dropdowns ---
  const menuButtons = document.querySelectorAll('.menu-btn');
  const dropdowns = document.querySelectorAll('.menu-dropdown');

  function closeAllDropdowns() {
    dropdowns.forEach(d => d.classList.remove('active'));
    menuButtons.forEach(b => b.classList.remove('active'));
  }

  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.menu-dropdown-wrapper');
      const dropdown = parent.querySelector('.menu-dropdown');
      const wasActive = dropdown.classList.contains('active');

      closeAllDropdowns();

      if (!wasActive) {
        dropdown.classList.add('active');
        btn.classList.add('active');
        playClick(900, 0.03);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-dropdown-wrapper')) {
      closeAllDropdowns();
    }
  });

  // --- Print Action (Under "Файл") ---
  const triggerPrint = () => {
    closeAllDropdowns();
    window.print();
  };

  const actionPrint = document.getElementById('action-print');
  if (actionPrint) actionPrint.addEventListener('click', triggerPrint);

  // Shortcut Ctrl+P or Cmd+P
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      // Allow standard browser print dialog
    }
  });

})();
