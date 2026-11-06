import { TYPE_COLORS } from '../data/pokemonData.js';
import { soundManager } from '../audio/SoundManager.js';

export class ViewportOverlay {
  constructor(container, sceneManager, onSelectPokemon, onToggleViewportMode) {
    this.container = container;
    this.sceneManager = sceneManager;
    this.onSelectPokemon = onSelectPokemon;
    this.onToggleViewportMode = onToggleViewportMode;
    this.activePokemon = null;
    this.currentMode = 'image'; // 'image' | '3d'

    this.render();
  }

  setMode(mode) {
    this.currentMode = mode;
    this.updateModeTabs();
    this.updateControlsVisibility();
  }

  update(pokemon) {
    this.activePokemon = pokemon;
    this.updateHeader();
    this.updateModeTabs();
    this.updateControlsVisibility();
  }

  render() {
    this.container.innerHTML = `
      <!-- Top HUD Header & Mode Switcher -->
      <div class="absolute top-4 left-4 right-4 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none select-none z-30" id="hud-header">
        <!-- Will update via updateHeader() -->
      </div>

      <!-- Mode Switcher Tabs (Top Center) -->
      <div class="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto z-30 flex items-center p-1 rounded-2xl glass-panel border border-white/10 shadow-2xl">
        <button 
          id="btn-mode-image"
          class="px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all bg-sky-500/25 text-sky-300 border border-sky-400/50 shadow-md shadow-sky-500/20"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>SPRITES & ARTWORK</span>
        </button>

        <button 
          id="btn-mode-3d"
          class="px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all text-slate-400 hover:text-slate-200"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <span id="mode-3d-text">3D VIEWPORT</span>
          <span id="mode-3d-badge" class="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">READY</span>
        </button>
      </div>

      <!-- 3D Floating Control Toolbar (Visible in 3D Mode) -->
      <div id="controls-3d" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20 hidden">
        <div class="p-1.5 rounded-2xl glass-panel border border-white/10 shadow-2xl flex items-center space-x-1.5">
          <!-- Auto Rotate -->
          <button 
            id="btn-auto-rotate" 
            class="px-3 py-2 rounded-xl text-xs font-mono border border-sky-500/40 bg-sky-500/20 text-sky-300 flex items-center space-x-1.5 transition-all hover:bg-sky-500/30"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden md:inline">ROTATE</span>
          </button>

          <!-- Holographic Wireframe -->
          <button 
            id="btn-wireframe" 
            class="px-3 py-2 rounded-xl text-xs font-mono border border-white/10 bg-slate-800/60 text-slate-300 flex items-center space-x-1.5 transition-all hover:border-sky-400/40"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span class="hidden md:inline">WIREFRAME</span>
          </button>

          <!-- Lighting Preset Menu -->
          <div class="relative group">
            <button 
              id="btn-lighting" 
              class="px-3 py-2 rounded-xl text-xs font-mono border border-white/10 bg-slate-800/60 text-slate-300 flex items-center space-x-1.5 transition-all hover:border-sky-400/40"
            >
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span class="hidden md:inline">LIGHTING</span>
            </button>
            <div class="absolute bottom-full mb-2 left-0 hidden group-hover:flex flex-col p-1.5 rounded-xl glass-panel border border-white/10 shadow-xl space-y-1 w-32">
              <button data-light="studio" class="px-2.5 py-1 rounded text-left text-xs font-mono text-slate-300 hover:bg-white/10">Studio PBR</button>
              <button data-light="cyberpunk" class="px-2.5 py-1 rounded text-left text-xs font-mono text-slate-300 hover:bg-white/10">Cyberpunk</button>
              <button data-light="solar" class="px-2.5 py-1 rounded text-left text-xs font-mono text-slate-300 hover:bg-white/10">Solar Flare</button>
              <button data-light="void" class="px-2.5 py-1 rounded text-left text-xs font-mono text-slate-300 hover:bg-white/10">Eerie Void</button>
            </div>
          </div>

          <!-- Camera Reset -->
          <button 
            id="btn-reset-cam" 
            class="px-3 py-2 rounded-xl text-xs font-mono border border-white/10 bg-slate-800/60 text-slate-300 flex items-center space-x-1.5 transition-all hover:border-sky-400/40"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span class="hidden md:inline">RESET</span>
          </button>

          <!-- Play Cry -->
          <button 
            id="btn-play-cry" 
            class="px-3 py-2 rounded-xl text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center space-x-1.5 transition-all hover:bg-emerald-500/20"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            <span class="hidden md:inline">CRY SFX</span>
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  updateHeader() {
    const header = this.container.querySelector('#hud-header');
    if (!header || !this.activePokemon) return;

    const p = this.activePokemon;
    const typeBadges = p.types.map(t => {
      const info = TYPE_COLORS[t] || { badge: 'bg-slate-700 text-slate-200 border-slate-600' };
      return `<span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-semibold border ${info.badge}">${t.toUpperCase()}</span>`;
    }).join(' ');

    header.innerHTML = `
      <!-- Left Name Title -->
      <div class="pointer-events-auto p-3.5 rounded-2xl glass-panel border border-white/10 shadow-2xl flex items-center space-x-4">
        <div>
          <div class="flex items-center space-x-2.5">
            <span class="font-mono text-sm text-sky-400 font-bold tracking-widest">#${p.id}</span>
            <h1 class="font-tech text-xl font-bold tracking-wider text-white">${p.name.toUpperCase()}</h1>
          </div>
          <p class="text-[11px] font-mono text-slate-400 mt-0.5">${p.japaneseName || ''} • ${p.genus || 'Pokémon'}</p>
        </div>
        <div class="flex items-center space-x-1.5">
          ${typeBadges}
        </div>
      </div>

      <!-- Right Physical Metrics -->
      <div class="pointer-events-auto p-3.5 rounded-2xl glass-panel border border-white/10 shadow-2xl flex items-center space-x-5 text-right">
        <div>
          <span class="text-[9px] font-mono text-slate-400 block">HEIGHT</span>
          <span class="font-tech text-sm font-bold text-slate-100">${p.height}</span>
        </div>
        <div class="h-6 w-px bg-white/10"></div>
        <div>
          <span class="text-[9px] font-mono text-slate-400 block">WEIGHT</span>
          <span class="font-tech text-sm font-bold text-slate-100">${p.weight}</span>
        </div>
        <div class="h-6 w-px bg-white/10"></div>
        <div>
          <span class="text-[9px] font-mono text-slate-400 block">ERA</span>
          <span class="font-mono text-[11px] font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">${p.generation?.name || 'GEN I'}</span>
        </div>
      </div>
    `;
  }

  updateModeTabs() {
    const btnImg = this.container.querySelector('#btn-mode-image');
    const btn3D = this.container.querySelector('#btn-mode-3d');
    const badge3D = this.container.querySelector('#mode-3d-badge');
    if (!btnImg || !btn3D) return;

    const has3D = this.activePokemon?.has3D;

    if (has3D) {
      badge3D.className = 'px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse';
      badge3D.textContent = 'AVAILABLE';
      btn3D.removeAttribute('disabled');
    } else {
      badge3D.className = 'px-1.5 py-0.2 rounded text-[9px] bg-slate-700 text-slate-400 border border-white/5';
      badge3D.textContent = 'IN PROGRESS';
    }

    if (this.currentMode === 'image') {
      btnImg.className = 'px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all bg-sky-500/25 text-sky-300 border border-sky-400/50 shadow-md shadow-sky-500/20';
      btn3D.className = 'px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all text-slate-400 hover:text-slate-200';
    } else {
      btn3D.className = 'px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-500/20';
      btnImg.className = 'px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all text-slate-400 hover:text-slate-200';
    }
  }

  updateControlsVisibility() {
    const controls3D = this.container.querySelector('#controls-3d');
    if (!controls3D) return;

    if (this.currentMode === '3d') {
      controls3D.classList.remove('hidden');
    } else {
      controls3D.classList.add('hidden');
    }
  }

  bindEvents() {
    const btnImg = this.container.querySelector('#btn-mode-image');
    const btn3D = this.container.querySelector('#btn-mode-3d');

    btnImg.addEventListener('click', () => {
      soundManager.playClick();
      this.setMode('image');
      this.onToggleViewportMode('image');
    });

    btn3D.addEventListener('click', () => {
      soundManager.playClick();
      this.setMode('3d');
      this.onToggleViewportMode('3d');
    });

    // Auto Rotate
    const autoRotateBtn = this.container.querySelector('#btn-auto-rotate');
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        soundManager.playClick();
        const isActive = this.sceneManager.toggleAutoRotate();
        autoRotateBtn.className = isActive 
          ? 'px-3 py-2 rounded-xl text-xs font-mono border border-sky-500/40 bg-sky-500/20 text-sky-300 flex items-center space-x-1.5 transition-all hover:bg-sky-500/30'
          : 'px-3 py-2 rounded-xl text-xs font-mono border border-white/10 bg-slate-800/60 text-slate-400 flex items-center space-x-1.5 transition-all hover:border-sky-400/40';
      });
    }

    // Wireframe
    const wireframeBtn = this.container.querySelector('#btn-wireframe');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        soundManager.playClick();
        const isWire = this.sceneManager.toggleWireframe();
        wireframeBtn.className = isWire
          ? 'px-3 py-2 rounded-xl text-xs font-mono border border-purple-500/50 bg-purple-500/20 text-purple-300 flex items-center space-x-1.5 transition-all hover:bg-purple-500/30'
          : 'px-3 py-2 rounded-xl text-xs font-mono border border-white/10 bg-slate-800/60 text-slate-300 flex items-center space-x-1.5 transition-all hover:border-sky-400/40';
      });
    }

    // Lighting Presets
    const lightButtons = this.container.querySelectorAll('[data-light]');
    lightButtons.forEach(b => {
      b.addEventListener('click', () => {
        soundManager.playClick();
        this.sceneManager.setLightingPreset(b.dataset.light);
      });
    });

    // Reset Camera
    const resetBtn = this.container.querySelector('#btn-reset-cam');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        soundManager.playClick();
        this.sceneManager.cameraController.reset();
      });
    }

    // Play Cry
    const cryBtn = this.container.querySelector('#btn-play-cry');
    if (cryBtn) {
      cryBtn.addEventListener('click', () => {
        if (this.activePokemon) {
          soundManager.playPokemonCry(this.activePokemon);
        }
      });
    }
  }
}
