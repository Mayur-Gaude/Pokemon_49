import { pokeApiClient } from '../services/PokeApiClient.js';
import { soundManager } from '../audio/SoundManager.js';

export class EvolutionTree {
  constructor(container, onSelectPokemon) {
    this.container = container;
    this.onSelectPokemon = onSelectPokemon;
    this.activePokemon = null;
    this.evolutionData = null;
  }

  async update(pokemon) {
    this.activePokemon = pokemon;
    this.renderLoading();

    if (pokemon.evolutionChainUrl) {
      try {
        this.evolutionData = await pokeApiClient.getEvolutionChain(pokemon.evolutionChainUrl);
      } catch (e) {
        console.warn('Failed to load dynamic evolution chain', e);
        this.evolutionData = null;
      }
    } else {
      this.evolutionData = null;
    }

    this.render();
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="p-6 glass-panel rounded-2xl border border-white/10 text-center text-xs font-mono text-slate-400">
        <svg class="w-5 h-5 text-sky-400 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Synchronizing Evolution Network...</span>
      </div>
    `;
  }

  render() {
    if (!this.activePokemon) return;

    const data = this.evolutionData;
    if (!data || !data.nodes || data.nodes.length <= 1) {
      this.container.innerHTML = `
        <div class="p-4 glass-panel rounded-2xl border border-white/10 shadow-xl select-none">
          <div class="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">EVOLUTION MATRIX</h2>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">STANDALONE FORM</span>
          </div>
          <div class="py-6 text-center text-xs font-mono text-slate-400">
            ${this.activePokemon.name} does not evolve into any known Pokémon.
          </div>
        </div>
      `;
      return;
    }

    const currentId = this.activePokemon.id;

    this.container.innerHTML = `
      <div class="p-4 glass-panel rounded-2xl border border-white/10 shadow-xl select-none">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">SYNCHRONIZED EVOLUTION TREE</h2>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
            ${data.nodes.length} FORMS
          </span>
        </div>

        <!-- Node Display Grid/Flow -->
        <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          ${data.nodes.map((n, idx) => {
            const isCurrent = n.id === currentId;
            const has3D = n.has3D;

            return `
              <div class="flex items-center ${idx > 0 ? 'w-full sm:w-auto flex-col sm:flex-row' : ''}">
                ${idx > 0 ? `
                  <!-- Connector arrow / requirement badge -->
                  <div class="my-2 sm:my-0 sm:mx-2 flex flex-col items-center">
                    <span class="evo-connector-badge text-[9px] font-mono px-2 py-0.5 rounded border whitespace-nowrap mb-1">
                      ${data.links[idx - 1]?.label || 'Evolve'}
                    </span>
                    <svg class="w-4 h-4 text-sky-400 transform rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                ` : ''}

                <!-- Evolution Node Card -->
                <button 
                  data-num="${n.numId}"
                  class="evo-node-btn group relative p-3 rounded-2xl border transition-all flex flex-col items-center min-w-[96px] cursor-pointer ${
                    isCurrent 
                      ? 'evo-node-active' 
                      : 'evo-node-inactive hover:scale-105'
                  }"
                >
                  <!-- 3D Badge -->
                  ${has3D ? `
                    <span class="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500 text-slate-950 shadow">
                      3D
                    </span>
                  ` : ''}

                  <!-- Pokemon Sprite Thumbnail -->
                  <div class="evo-thumb-box w-16 h-16 rounded-xl border flex items-center justify-center p-1 relative overflow-hidden">
                    <img 
                      src="${n.artworkUrl}" 
                      alt="${n.name}" 
                      class="max-w-full max-h-full object-contain filter drop-shadow transition-transform group-hover:scale-110"
                      loading="lazy"
                      onerror="this.src='${n.thumbUrl}'"
                    />
                  </div>

                  <span class="evo-name font-tech text-xs font-bold mt-2 truncate w-full text-center">
                    ${n.name}
                  </span>
                  <span class="evo-id font-mono text-[10px]">#${n.id}</span>
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div class="mt-3 text-center text-[11px] font-mono text-slate-400">
          Click any stage node to immediately swap Pokémon & trigger evolution
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const buttons = this.container.querySelectorAll('.evo-node-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const numId = btn.dataset.num;
        if (numId === String(this.activePokemon.numId)) return;

        soundManager.playClick();
        try {
          const evolvedPokemon = await pokeApiClient.getPokemonDetails(numId);
          this.onSelectPokemon(evolvedPokemon, true);
        } catch (e) {
          console.error('Failed to evolve to Pokémon', e);
        }
      });

      btn.addEventListener('mouseenter', () => {
        soundManager.playHover();
      });
    });
  }
}
