import { TYPE_COLORS } from '../data/pokemonData.js';
import { soundManager } from '../audio/SoundManager.js';

export class ImageViewport {
  constructor(container, onSwitchTo3D) {
    this.container = container;
    this.onSwitchTo3D = onSwitchTo3D;
    this.pokemon = null;
    this.viewMode = 'artwork'; // 'artwork' | 'home3d' | 'showdown'
    this.isShiny = false;
  }

  update(pokemon) {
    this.pokemon = pokemon;
    this.render();
  }

  getCurrentImageUrl() {
    if (!this.pokemon || !this.pokemon.sprites) return '';
    const sp = this.pokemon.sprites;

    if (this.viewMode === 'home3d') {
      return this.isShiny ? (sp.home3DShiny || sp.home3D) : sp.home3D;
    } else if (this.viewMode === 'showdown') {
      return this.isShiny ? (sp.showdownAnimatedShiny || sp.showdownAnimated) : (sp.showdownAnimated || sp.officialArtwork);
    } else {
      // Default official artwork
      return this.isShiny ? (sp.officialArtworkShiny || sp.officialArtwork) : sp.officialArtwork;
    }
  }

  render() {
    if (!this.pokemon) return;

    const p = this.pokemon;
    const currentImg = this.getCurrentImageUrl();
    const primaryType = p.types?.[0] || 'Normal';
    const typeColor = TYPE_COLORS[primaryType]?.bg || '#38bdf8';

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
        </div>

        <!-- Artwork Control Floating Switcher (Positioned lower so image is clearly visible) -->
        <div class="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-1.5 p-1 rounded-2xl glass-panel border border-white/10 shadow-2xl">
          <!-- Official Artwork Tab -->
          <button 
            data-mode="artwork"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'artwork' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🎨 OFFICIAL ART
          </button>

          <!-- 3D Home Render Tab -->
          <button 
            data-mode="home3d"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'home3d' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🏠 3D HOME RENDER
          </button>

          <!-- Animated Showdown Tab -->
          <button 
            data-mode="showdown"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${this.viewMode === 'showdown' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50' : 'text-slate-400 hover:text-slate-200'}"
          >
            🎬 ANIMATED GIF
          </button>

          <div class="h-5 w-px bg-white/10"></div>

          <!-- Shiny Variant Toggle -->
          <button 
            id="toggle-shiny-btn"
            class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center space-x-1.5 border transition-all ${this.isShiny ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-lg shadow-amber-500/20' : 'border-white/10 text-slate-400 hover:text-slate-200'}"
          >
            <span>✨</span>
            <span>SHINY: ${this.isShiny ? 'ON' : 'OFF'}</span>
          </button>
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
  }
}
