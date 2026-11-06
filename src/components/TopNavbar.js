import { GENERATIONS } from '../data/pokemonGenerations.js';
import { soundManager } from '../audio/SoundManager.js';

export class TopNavbar {
  constructor(container, { onSelectGeneration, onSearch, onSelectType, onToggleAudio, onToggleTheme, currentTheme = 'dark' }) {
    this.container = container;
    this.onSelectGeneration = onSelectGeneration;
    this.onSearch = onSearch;
    this.onSelectType = onSelectType;
    this.onToggleAudio = onToggleAudio;
    this.onToggleTheme = onToggleTheme;

    this.activeGenId = 1;
    this.activeType = 'ALL';
    this.searchQuery = '';
    this.totalCount = 151;
    this.currentTheme = currentTheme;

    this.render();
  }

  setCount(count) {
    this.totalCount = count;
    const badgeMobile = this.container.querySelector('#navbar-count-badge');
    const badgeDesktop = this.container.querySelector('#navbar-count-badge-desktop');
    if (badgeMobile) badgeMobile.textContent = `${count} Units`;
    if (badgeDesktop) badgeDesktop.textContent = `${count} Units`;
  }

  setTheme(theme) {
    this.currentTheme = theme;
    const isLight = theme === 'light';

    const iconDesktop = this.container.querySelector('#theme-icon-desktop');
    const labelDesktop = this.container.querySelector('#theme-label-desktop');
    const iconMobile = this.container.querySelector('#theme-icon-mobile');

    if (iconDesktop) iconDesktop.textContent = isLight ? '☀️' : '🌙';
    if (labelDesktop) labelDesktop.textContent = isLight ? 'LIGHT' : 'DARK';
    if (iconMobile) iconMobile.textContent = isLight ? '☀️' : '🌙';
  }

  render() {
    const types = [
      'ALL', 'Fire', 'Water', 'Grass', 'Electric', 'Ghost', 'Normal', 
      'Poison', 'Flying', 'Bug', 'Psychic', 'Rock', 'Ground', 'Fighting', 
      'Dragon', 'Ice', 'Steel', 'Fairy'
    ];
    const isLight = this.currentTheme === 'light';

    this.container.innerHTML = `
      <header class="w-full glass-panel border-b border-white/10 shadow-2xl z-40 select-none">
        
        <!-- ROW 1: Branding, Search Bar, Audio & Theme Switcher -->
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div class="flex items-center space-x-3 cursor-pointer" id="brand-logo">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h1 class="font-tech text-lg font-bold tracking-wider text-white">POKÉDEX 3D</h1>
                  <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">GEN 1 - 9</span>
                </div>
                <p class="text-[11px] text-slate-400 font-mono">ALL 9 GENERATIONS • 3D ENGINE & SPRITES</p>
              </div>
            </div>

            <!-- Mobile Action Buttons -->
            <div class="flex items-center space-x-2 md:hidden">
              <button 
                id="theme-toggle-btn-mobile"
                class="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs transition-all"
                title="Toggle Light / Dark Mode"
              >
                <span id="theme-icon-mobile">${isLight ? '☀️' : '🌙'}</span>
              </button>
              <span id="navbar-count-badge" class="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-sky-400 border border-white/10">
                ${this.totalCount} Units
              </span>
            </div>
          </div>

          <!-- Center Search Bar -->
          <div class="relative w-full md:w-80 lg:w-96">
            <input 
              type="text" 
              id="top-search-input" 
              placeholder="Search Pokémon name or #ID (e.g. Pikachu, 25)..." 
              class="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono shadow-inner transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <button id="clear-search-btn" class="absolute right-2.5 top-2.5 text-slate-400 hover:text-white hidden">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Right Controls (Desktop) -->
          <div class="hidden md:flex items-center space-x-2.5">
            <span class="text-xs font-mono px-2.5 py-1.5 rounded-xl bg-slate-900/60 text-sky-300 border border-white/10">
              <span id="navbar-count-badge-desktop">${this.totalCount} Units</span>
            </span>

            <!-- Audio Toggle -->
            <button 
              id="top-audio-btn" 
              class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 hover:border-sky-400/50 text-slate-200 text-xs font-mono transition-all hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer"
              title="Toggle Web Audio SFX"
            >
              <svg class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span id="top-audio-label">SFX: ON</span>
            </button>

            <!-- Light / Dark Mode Toggle -->
            <button 
              id="theme-toggle-btn"
              class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 hover:border-amber-400/50 text-slate-200 text-xs font-mono transition-all hover:shadow-lg hover:shadow-amber-500/15 cursor-pointer"
              title="Toggle Light / Dark Mode"
            >
              <span id="theme-icon-desktop">${isLight ? '☀️' : '🌙'}</span>
              <span id="theme-label-desktop">${isLight ? 'LIGHT' : 'DARK'}</span>
            </button>
          </div>
        </div>

        <!-- ROW 2: Proper Dedicated Generation Selector Section (NO HORIZONTAL SCROLL) -->
        <div class="px-4 py-2.5 border-t border-white/10 bg-slate-950/30">
          <div class="max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="font-bold tracking-wide">REGION & GENERATION MATRIX:</span>
              </span>
              <span class="text-[10px] font-mono text-sky-400 hidden sm:inline">All 9 Eras Available</span>
            </div>

            <!-- Complete 9-Button Grid (Visible at once, no horizontal scrolling) -->
            <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 w-full" id="gen-selector-bar">
              ${GENERATIONS.map(g => `
                <button 
                  data-gen="${g.id}"
                  class="gen-tab-btn px-2 py-1.5 rounded-xl text-xs font-mono border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    g.id === this.activeGenId
                      ? 'gen-btn-active'
                      : 'gen-btn-inactive'
                  }"
                >
                  <span class="font-bold">${g.name}</span>
                  <span class="text-[10px] opacity-80">${g.region}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- ROW 3: Proper Dedicated Type Choosing Section (FLEX-WRAP, NO HORIZONTAL SCROLL) -->
        <div class="px-4 py-2 border-t border-white/10 bg-slate-950/20">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2">
            <span class="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5 flex-shrink-0">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
              <span class="font-bold tracking-wide">TYPES:</span>
            </span>

            <!-- Flex-wrap row for all types (No horizontal scrolling) -->
            <div class="flex flex-wrap items-center gap-1.5 w-full" id="type-selector-bar">
              ${types.map(t => `
                <button 
                  data-type="${t}"
                  class="type-chip-btn px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    t === this.activeType
                      ? 'type-btn-active'
                      : 'type-btn-inactive'
                  }"
                >
                  ${t}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </header>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const searchInput = this.container.querySelector('#top-search-input');
    const clearBtn = this.container.querySelector('#clear-search-btn');

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = this.searchQuery ? 'block' : 'none';
      }
      this.onSearch(this.searchQuery);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        clearBtn.style.display = 'none';
        this.onSearch('');
      });
    }

    // Generation tabs
    const genButtons = this.container.querySelectorAll('.gen-tab-btn');
    genButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        const genId = parseInt(btn.dataset.gen, 10);
        this.activeGenId = genId;

        genButtons.forEach(b => {
          b.className = 'gen-tab-btn px-2 py-1.5 rounded-xl text-xs font-mono border transition-all text-center flex flex-col items-center justify-center cursor-pointer gen-btn-inactive';
        });
        btn.className = 'gen-tab-btn px-2 py-1.5 rounded-xl text-xs font-mono border transition-all text-center flex flex-col items-center justify-center cursor-pointer gen-btn-active';

        this.onSelectGeneration(genId);
      });
    });

    // Type filter chips
    const typeButtons = this.container.querySelectorAll('.type-chip-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        const type = btn.dataset.type;
        this.activeType = type;

        typeButtons.forEach(b => {
          b.className = 'type-chip-btn px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer type-btn-inactive';
        });
        btn.className = 'type-chip-btn px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer type-btn-active';

        this.onSelectType(type);
      });
    });

    // Audio SFX button
    const audioBtn = this.container.querySelector('#top-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        const label = this.container.querySelector('#top-audio-label');
        if (label) {
          label.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
        }
        soundManager.playClick();
      });
    }

    // Theme toggle buttons (desktop & mobile)
    const handleToggle = () => {
      soundManager.playClick();
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      if (this.onToggleTheme) {
        this.onToggleTheme(newTheme);
      }
    };

    const themeBtnDesktop = this.container.querySelector('#theme-toggle-btn');
    const themeBtnMobile = this.container.querySelector('#theme-toggle-btn-mobile');

    if (themeBtnDesktop) themeBtnDesktop.addEventListener('click', handleToggle);
    if (themeBtnMobile) themeBtnMobile.addEventListener('click', handleToggle);
  }
}
