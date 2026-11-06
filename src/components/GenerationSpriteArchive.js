import { soundManager } from '../audio/SoundManager.js';

export class GenerationSpriteArchive {
  constructor(container) {
    this.container = container;
    this.pokemon = null;
    this.selectedGenIndex = 0;
  }

  update(pokemon) {
    this.pokemon = pokemon;
    // Default to the most iconic generation or latest
    this.selectedGenIndex = 0;
    this.render();
  }

  render() {
    if (!this.pokemon || !this.pokemon.sprites?.generations) {
      this.container.innerHTML = `<div class="p-4 text-xs font-mono text-slate-500">Historical archive unavailable.</div>`;
      return;
    }

    const gens = this.pokemon.sprites.generations;
    const activeGen = gens[this.selectedGenIndex] || gens[0];

    this.container.innerHTML = `
      <div class="glass-panel rounded-2xl border border-white/10 p-4 shadow-xl select-none">
        <!-- Section Header -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">ALL GENERATIONS SPRITE ARCHIVE</h2>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
            ${gens.length} ERAS CATALOGED
          </span>
        </div>

        <!-- Featured Generation Inspector Box -->
        <div class="mt-3 p-3 rounded-xl bg-slate-900/70 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
          <div class="w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-950/80 border border-white/10 p-2 relative overflow-hidden group">
            <div class="absolute inset-0 bg-radial-gradient from-sky-500/10 to-transparent pointer-events-none"></div>
            <img 
              src="${activeGen.url}" 
              alt="${activeGen.title}" 
              class="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)] transition-transform group-hover:scale-110"
              style="image-rendering: ${activeGen.genId <= 5 ? 'pixelated' : 'auto'};"
            />
          </div>
          <div class="flex-1 text-left min-w-0">
            <div class="flex items-center space-x-2">
              <span class="font-tech text-sm font-bold text-sky-300">${activeGen.title}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${activeGen.year}</span>
            </div>
            <p class="text-xs font-mono text-slate-300 mt-0.5">${activeGen.games} • <span class="text-slate-400">${activeGen.console}</span></p>
            <p class="text-[11px] font-sans text-slate-400 mt-1 leading-snug">${activeGen.notes}</p>
          </div>
        </div>

        <!-- Horizontal Scrollable Timeline of Generation Sprites -->
        <div class="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="gen-thumbnails">
          ${gens.map((g, idx) => `
            <button 
              data-index="${idx}"
              class="gen-thumb-btn flex-shrink-0 flex flex-col items-center p-2 rounded-xl border transition-all ${
                idx === this.selectedGenIndex 
                  ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/20' 
                  : 'bg-slate-900/50 border-white/5 hover:border-white/20'
              }"
            >
              <div class="w-12 h-12 flex items-center justify-center p-1">
                <img 
                  src="${g.url}" 
                  alt="${g.title}" 
                  class="max-w-full max-h-full object-contain"
                  style="image-rendering: ${g.genId <= 5 ? 'pixelated' : 'auto'};"
                  loading="lazy"
                />
              </div>
              <span class="text-[9px] font-mono text-slate-300 mt-1 font-semibold">${g.title.split(' ')[0]} ${g.title.split(' ')[1] || ''}</span>
              <span class="text-[8px] font-mono text-slate-500">${g.year}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const buttons = this.container.querySelectorAll('.gen-thumb-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        this.selectedGenIndex = parseInt(btn.dataset.index, 10);
        this.render();
      });
      btn.addEventListener('mouseenter', () => {
        soundManager.playHover();
      });
    });
  }
}
