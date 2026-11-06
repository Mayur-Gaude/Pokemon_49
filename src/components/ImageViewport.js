import { TYPE_COLORS } from '../data/pokemonData.js';
import { soundManager } from '../audio/SoundManager.js';

export class ImageViewport {
  constructor(container, onSwitchTo3D, onSelectForm) {
    this.container = container;
    this.onSwitchTo3D = onSwitchTo3D;
    this.onSelectForm = onSelectForm;

    this.pokemon = null;
    this.viewMode = 'artwork'; // 'artwork' | 'home3d' | 'showdown'
    this.isShiny = false;
    this.activeVariety = null;
    this.currentSprites = null;
    this.isLoadingForm = false;
  }

  update(pokemon, activeVariety = null, customSprites = null) {
    this.pokemon = pokemon;
    this.activeVariety = activeVariety || (pokemon && pokemon.activeVariety) || null;
    this.currentSprites = customSprites || (pokemon && pokemon.sprites);
    this.render();
  }

  setActiveVariety(variety, customSprites = null) {
    this.activeVariety = variety;
    if (customSprites) {
      this.currentSprites = customSprites;
    }
    this.render();
  }

  setLoadingForm(loading) {
    this.isLoadingForm = loading;
    const imgEl = this.container.querySelector('#main-pokemon-image');
    const spinnerEl = this.container.querySelector('#form-loading-spinner');
    if (imgEl && spinnerEl) {
      if (loading) {
        imgEl.classList.add('opacity-40', 'scale-95');
        spinnerEl.classList.remove('hidden');
      } else {
        imgEl.classList.remove('opacity-40', 'scale-95');
        spinnerEl.classList.add('hidden');
      }
    }
  }

  getCurrentImageUrl() {
    const sp = this.currentSprites || (this.pokemon && this.pokemon.sprites);
    if (!sp) return '';

    let url = '';
    if (this.viewMode === 'home3d') {
      url = this.isShiny ? (sp.home3DShiny || sp.home3D) : sp.home3D;
    } else if (this.viewMode === 'showdown') {
      url = this.isShiny ? (sp.showdownAnimatedShiny || sp.showdownAnimated) : (sp.showdownAnimated || sp.officialArtwork);
    } else {
      url = this.isShiny ? (sp.officialArtworkShiny || sp.officialArtwork) : sp.officialArtwork;
    }

    return url || sp.officialArtwork || sp.home3D || sp.pixelFront || '';
  }

  render() {
    if (!this.pokemon) return;

    const p = this.pokemon;
    const currentImg = this.getCurrentImageUrl();
    const primaryType = p.types?.[0] || 'Normal';
    const typeColor = TYPE_COLORS[primaryType]?.bg || '#38bdf8';
    const varieties = p.varieties || [];
    const hasForms = varieties.length > 1;

    // Active form display label
    const activeLabel = this.activeVariety ? this.activeVariety.shortName.toUpperCase() : 'STANDARD';
    const isAltForm = this.activeVariety && !this.activeVariety.isDefault;

    this.container.innerHTML = `
      <div class="relative w-full h-full flex flex-col items-center justify-between p-4 select-none overflow-hidden">
        <!-- Radial Elemental Aura Background -->
        <div 
          class="absolute w-[450px] h-[450px] rounded-full pointer-events-none filter blur-[90px] opacity-25 transition-all duration-700"
          style="background: ${typeColor};"
        ></div>

        <!-- Cybernetic Pedestal Base (2D Artwork Projection) -->
        <div class="absolute bottom-16 w-80 h-24 rounded-[100%] border border-sky-400/20 bg-sky-500/5 filter blur-[1px] pointer-events-none transform scale-y-50"></div>
        <div class="absolute bottom-16 w-52 h-16 rounded-[100%] border border-sky-400/40 bg-sky-500/10 pointer-events-none transform scale-y-50"></div>

        <!-- Featured Pokémon Artwork Display (Centered with clearance) -->
        <div class="relative z-10 flex-1 w-full flex items-center justify-center p-2 mb-12" id="main-poke-image-container">
          <img 
            id="main-pokemon-image"
            src="${currentImg}" 
            alt="${p.name}" 
            class="max-w-full max-h-[300px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105"
            draggable="false"
          />

          <!-- Loading Indicator for Forms -->
          <div id="form-loading-spinner" class="absolute inset-0 flex items-center justify-center ${this.isLoadingForm ? '' : 'hidden'}">
            <div class="w-10 h-10 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- Artwork Control Floating Switcher (Positioned lower so image is clearly visible) -->
        <div class="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/10 shadow-2xl max-w-[95%]">
          <!-- Official Artwork Tab -->
          <button 
            data-mode="artwork"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'artwork' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🎨 OFFICIAL ART
          </button>

          <!-- 3D Home Render Tab -->
          <button 
            data-mode="home3d"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'home3d' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🏠 3D HOME RENDER
          </button>

          <!-- Animated Showdown Tab -->
          <button 
            data-mode="showdown"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'showdown' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🎬 ANIMATED GIF
          </button>

          <div class="h-5 w-px bg-white/10 hidden sm:block"></div>

          <!-- Shiny Variant Toggle -->
          <button 
            id="toggle-shiny-btn"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center space-x-1.5 border transition-all ${this.isShiny ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-lg shadow-amber-500/20' : 'border-white/10 text-slate-400 hover:text-slate-200'}"
            title="Toggle normal and shiny coloration"
          >
            <span>✨</span>
            <span>SHINY: ${this.isShiny ? 'ON' : 'OFF'}</span>
          </button>

          <!-- Alternative Forms Toggle (Feature 2) -->
          ${hasForms ? `
            <div class="h-5 w-px bg-white/10 hidden sm:block"></div>

            <div class="relative" id="form-selector-container">
              <button 
                id="toggle-form-btn"
                class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center space-x-1.5 border transition-all ${isAltForm ? 'bg-purple-500/25 text-purple-200 border-purple-400/60 shadow-lg shadow-purple-500/25' : 'border-white/10 text-slate-300 hover:text-white bg-slate-900/60'}"
                title="Toggle alternative forms (Mega, Gigantamax, Regional)"
              >
                <span class="text-xs">🔄</span>
                <span>FORM: <span class="text-sky-300 font-bold">${activeLabel}</span></span>
                <span class="text-[9px] text-slate-400">▼</span>
              </button>

              <!-- Dropup Menu for Alternative Forms -->
              <div 
                id="forms-dropup-menu" 
                class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-56 p-1.5 rounded-2xl glass-panel border border-white/15 shadow-2xl z-30 hidden space-y-1 backdrop-blur-xl"
              >
                <div class="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-white/10 flex items-center justify-between">
                  <span>SELECT FORM</span>
                  <span class="text-sky-400 font-bold">${varieties.length} FORMS</span>
                </div>

                <div class="max-h-48 overflow-y-auto space-y-1">
                  ${varieties.map(v => {
                    const isSelected = this.activeVariety && (this.activeVariety.slug === v.slug || this.activeVariety.id === v.id);
                    let badgeBg = 'bg-slate-700 text-slate-300 border-slate-600';
                    if (v.formType === 'mega') badgeBg = 'bg-purple-500/25 text-purple-200 border-purple-400/50';
                    else if (v.formType === 'gmax') badgeBg = 'bg-red-500/25 text-red-200 border-red-400/50';
                    else if (['alola', 'galar', 'hisui', 'paldea'].includes(v.formType)) badgeBg = 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50';

                    return `
                      <button
                        data-variety-slug="${v.slug}"
                        class="form-option-item w-full px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between text-left transition-all ${isSelected ? 'bg-sky-500/30 text-white border border-sky-400/60 font-bold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'}"
                      >
                        <span class="truncate mr-1.5">${v.name}</span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border ${badgeBg}">${v.typeBadge}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Mode switcher buttons
    const modeButtons = this.container.querySelectorAll('[data-mode]');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        this.viewMode = btn.dataset.mode;
        this.render();
      });
    });

    // Shiny toggle
    const shinyBtn = this.container.querySelector('#toggle-shiny-btn');
    if (shinyBtn) {
      shinyBtn.addEventListener('click', () => {
        soundManager.playClick();
        this.isShiny = !this.isShiny;
        this.render();
      });
    }

    // Alternative Forms Toggle & Dropup Menu (Feature 2)
    const toggleFormBtn = this.container.querySelector('#toggle-form-btn');
    const dropupMenu = this.container.querySelector('#forms-dropup-menu');

    if (toggleFormBtn && dropupMenu) {
      toggleFormBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playClick();

        // If there are exactly 2 varieties (Standard + 1 Alt), quick-toggle directly!
        const varieties = this.pokemon.varieties || [];
        if (varieties.length === 2 && dropupMenu.classList.contains('hidden')) {
          const currentIdx = varieties.findIndex(v => this.activeVariety && (this.activeVariety.slug === v.slug));
          const nextVariety = varieties[currentIdx === 0 ? 1 : 0];
          if (this.onSelectForm) {
            this.onSelectForm(nextVariety);
          }
          return;
        }

        // Otherwise open the multi-form selection menu
        dropupMenu.classList.toggle('hidden');
      });

      // Item selection in dropup
      const optionItems = this.container.querySelectorAll('.form-option-item');
      optionItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          soundManager.playClick();
          dropupMenu.classList.add('hidden');
          const slug = item.dataset.varietySlug;
          const selected = this.pokemon.varieties.find(v => v.slug === slug);
          if (selected && this.onSelectForm) {
            this.onSelectForm(selected);
          }
        });
      });

      // Close menu when clicking outside
      const handleOutsideClick = (e) => {
        if (!dropupMenu.contains(e.target) && e.target !== toggleFormBtn) {
          dropupMenu.classList.add('hidden');
        }
      };
      document.addEventListener('click', handleOutsideClick, { once: true });
    }
  }
}
