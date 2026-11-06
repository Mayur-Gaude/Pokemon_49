import { GENERATIONS } from '../data/pokemonGenerations.js';
import { TYPE_COLORS } from '../data/pokemonData.js';
import { pokeApiClient } from '../services/PokeApiClient.js';
import { soundManager } from '../audio/SoundManager.js';

export class RosterSidebar {
  constructor(container, onSelectPokemon) {
    this.container = container;
    this.onSelectPokemon = onSelectPokemon;
    this.activeGenId = 1;
    this.pokemonList = [];
    this.searchQuery = '';
    this.activeType = 'ALL';
    this.activePokemonId = '0025';
    this.isLoading = false;

    this.render();
    this.loadGeneration(1);
  }

  async loadGeneration(genId) {
    this.activeGenId = genId;
    this.isLoading = true;
    this.renderLoading();

    try {
      this.pokemonList = await pokeApiClient.getPokemonByGeneration(genId);
      this.isLoading = false;
      this.renderCards();
    } catch (e) {
      console.error('Failed to load generation:', e);
      this.isLoading = false;
      this.container.querySelector('#roster-list').innerHTML = `
        <div class="py-12 text-center text-rose-400 font-mono text-xs">
          Network error contacting PokéAPI.
        </div>
      `;
    }
  }

  setSelection(pokemonId) {
    this.activePokemonId = String(pokemonId).padStart(4, '0');
    this.updateActiveCard();
  }

  filterRoster() {
    return this.pokemonList.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        String(p.numId).includes(this.searchQuery) ||
        p.id.includes(this.searchQuery);

      return matchQuery;
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="h-full flex flex-col p-4 select-none">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h1 class="font-tech text-base font-bold tracking-wider text-white">POKÉDEX ARCHIVE</h1>
              <p class="text-[11px] text-sky-400 font-mono tracking-tight">ALL 9 GENERATIONS • POKEAPI</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-mono text-emerald-400">ONLINE</span>
          </div>
        </div>

        <!-- Generation Selector Bar -->
        <div class="mt-3">
          <label class="text-[10px] font-mono text-slate-400 block mb-1">SELECT REGION & GENERATION:</label>
          <div class="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none" id="gen-tab-bar">
            ${GENERATIONS.map(g => `
              <button 
                data-gen="${g.id}"
                class="px-2.5 py-1 rounded-lg border text-xs font-mono whitespace-nowrap transition-all ${
                  g.id === this.activeGenId 
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-md shadow-sky-500/20' 
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/20'
                }"
              >
                ${g.name} (${g.region})
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-2.5 relative">
          <input 
            type="text" 
            id="roster-search" 
            placeholder="Search Pokémon name or #ID..." 
            class="w-full bg-slate-900/70 border border-slate-700/60 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
          />
          <svg class="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Pokemon Cards Scrollable List -->
        <div class="mt-2.5 flex-1 overflow-y-auto space-y-1.5 pr-1.5" id="roster-list">
          <!-- Dynamic cards injected here -->
        </div>

        <!-- Footer Tally & Audio Mute -->
        <div class="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span id="roster-count">${this.pokemonList.length} Units In Region</span>
          <button id="toggle-audio-btn" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-white/10 hover:border-sky-400/40 text-slate-300 transition-all">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span id="audio-label">SFX: ON</span>
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const searchInput = this.container.querySelector('#roster-search');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderCards();
    });

    const genButtons = this.container.querySelectorAll('#gen-tab-bar button');
    genButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        const genId = parseInt(btn.dataset.gen, 10);
        genButtons.forEach(b => {
          b.className = 'px-2.5 py-1 rounded-lg border text-xs font-mono whitespace-nowrap transition-all bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/20';
        });
        btn.className = 'px-2.5 py-1 rounded-lg border text-xs font-mono whitespace-nowrap transition-all bg-sky-500/20 text-sky-300 border-sky-400 shadow-md shadow-sky-500/20';
        this.loadGeneration(genId);
      });
    });

    const audioBtn = this.container.querySelector('#toggle-audio-btn');
    audioBtn.addEventListener('click', () => {
      const isMuted = soundManager.toggleMute();
      const label = this.container.querySelector('#audio-label');
      label.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
      soundManager.playClick();
    });
  }

  renderLoading() {
    const list = this.container.querySelector('#roster-list');
    list.innerHTML = `
      <div class="py-16 flex flex-col items-center justify-center space-y-2 text-slate-400 font-mono text-xs">
        <svg class="w-6 h-6 text-sky-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Fetching PokéAPI Regional Sprites...</span>
      </div>
    `;
  }

  renderCards() {
    const listContainer = this.container.querySelector('#roster-list');
    const filtered = this.filterRoster();

    const countLabel = this.container.querySelector('#roster-count');
    if (countLabel) {
      countLabel.textContent = `${filtered.length} Units In Region`;
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="py-12 text-center text-slate-500 font-mono text-xs">
          No Pokémon found matching "${this.searchQuery}"
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(p => {
      const isActive = p.id === this.activePokemonId;

      return `
        <div 
          data-id="${p.id}"
          data-num="${p.numId}"
          class="roster-card group p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            isActive 
              ? 'bg-slate-800/80 border-sky-400/80 shadow-lg shadow-sky-500/15' 
              : 'glass-panel-interactive'
          }"
        >
          <div class="flex items-center space-x-3">
            <!-- Official Thumbnail Sprite -->
            <div class="w-10 h-10 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center p-1 relative flex-shrink-0">
              <img 
                src="${p.thumbUrl}" 
                alt="${p.name}" 
                class="max-w-full max-h-full object-contain filter drop-shadow transition-transform group-hover:scale-115"
                loading="lazy"
                onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.numId}.png'"
              />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-xs text-sky-400 font-semibold">#${p.id}</span>
                <span class="font-tech text-xs font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">${p.name}</span>
              </div>
              <span class="text-[10px] font-mono text-slate-400">Region: Gen ${p.generation}</span>
            </div>
          </div>

          <!-- 3D Model Badge if available -->
          <div class="flex items-center space-x-1.5">
            ${p.has3D ? `
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                3D
              </span>
            ` : ''}
            <svg class="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    listContainer.querySelectorAll('.roster-card').forEach(card => {
      card.addEventListener('click', async () => {
        soundManager.playClick();
        const id = card.dataset.id;
        const numId = card.dataset.num;
        this.setSelection(id);

        try {
          const fullPokemon = await pokeApiClient.getPokemonDetails(numId);
          this.onSelectPokemon(fullPokemon, false);
        } catch (e) {
          console.error('Failed to load Pokémon details', e);
        }
      });
      card.addEventListener('mouseenter', () => {
        soundManager.playHover();
      });
    });
  }

  updateActiveCard() {
    const cards = this.container.querySelectorAll('.roster-card');
    cards.forEach(card => {
      if (card.dataset.id === this.activePokemonId) {
        card.className = 'roster-card group p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between bg-slate-800/80 border-sky-400/80 shadow-lg shadow-sky-500/15';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.className = 'roster-card group p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between glass-panel-interactive';
      }
    });
  }
}
