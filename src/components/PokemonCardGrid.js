import { soundManager } from '../audio/SoundManager.js';
import { fuzzyMatchPokemon } from '../utils/searchUtils.js';

export class PokemonCardGrid {
  constructor(container, onSelectPokemon) {
    this.container = container;
    this.onSelectPokemon = onSelectPokemon;

    this.pokemonList = [];
    this.filteredList = [];
    this.searchQuery = '';
    this.selectedTypes = [];
    this.allowedNamesSet = null;
    this.isLoading = false;

    // Infinite Scroll Configuration (Feature 1)
    this.PAGE_SIZE = 24;
    this.renderedCount = 24;
    this.observer = null;
    this.isLoadingMore = false;

    this.bindWindowScroll();
  }

  setLoading(loading) {
    this.isLoading = loading;
    if (loading) {
      this.renderLoading();
    }
  }

  setData(list) {
    this.pokemonList = list || [];
    this.refreshFilteredData();
  }

  setFilters(searchQuery, selectedTypes = [], allowedNamesSet = null) {
    this.searchQuery = searchQuery || '';
    this.selectedTypes = Array.isArray(selectedTypes) ? selectedTypes : (selectedTypes && selectedTypes !== 'ALL' ? [selectedTypes] : []);
    this.allowedNamesSet = allowedNamesSet;
    this.refreshFilteredData();
  }

  refreshFilteredData() {
    this.filteredList = this.getFilteredList();
    this.renderedCount = Math.min(this.filteredList.length, this.PAGE_SIZE);
    this.render();
  }

  getFilteredList() {
    return this.pokemonList
      .map(p => {
        // Type matching (supports single or dual-type intersection)
        const matchType = !this.allowedNamesSet || this.allowedNamesSet.has(p.name.toLowerCase());
        if (!matchType) return null;

        // Fuzzy and typo-tolerant search matching (Feature 3)
        const searchRes = fuzzyMatchPokemon(this.searchQuery, p.name, p.numId);
        if (!searchRes.match) return null;

        return { 
          pokemon: p, 
          score: searchRes.score, 
          isFuzzy: searchRes.isFuzzy 
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (this.searchQuery.trim()) {
          return b.score - a.score;
        }
        return a.pokemon.numId - b.pokemon.numId;
      })
      .map(item => item.pokemon);
  }

  renderLoading() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.container.innerHTML = `
      <div class="h-96 flex flex-col items-center justify-center space-y-4 text-slate-400 font-mono text-sm">
        <div class="relative w-16 h-16">
          <div class="w-16 h-16 rounded-full border-4 border-sky-400/20 border-t-sky-400 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="w-4 h-4 rounded-full bg-sky-400 animate-ping"></span>
          </div>
        </div>
        <p class="tracking-wider">QUERYING POKÉAPI ARCHIVE DATABASE...</p>
      </div>
    `;
  }

  renderCardHtml(p) {
    return `
      <div 
        data-num="${p.numId}"
        data-id="${p.id}"
        class="pokemon-card group relative p-3.5 rounded-2xl glass-panel-interactive border border-white/10 hover:border-sky-400/50 cursor-pointer flex flex-col items-center select-none"
      >
        <!-- 3D Model Badge if available -->
        ${p.has3D ? `
          <div class="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono font-bold text-emerald-300 shadow-sm animate-pulse">
            <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <span>3D</span>
          </div>
        ` : ''}

        <!-- Pokemon ID Tag -->
        <span class="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold text-slate-400 group-hover:text-sky-400 transition-colors">
          #${p.id}
        </span>

        <!-- Card Artwork Container -->
        <div class="mt-4 mb-2 w-28 h-28 flex items-center justify-center relative p-1.5">
          <!-- Radial glow aura on hover -->
          <div class="absolute inset-2 rounded-full bg-sky-500/0 group-hover:bg-sky-500/15 filter blur-md transition-all duration-300 pointer-events-none"></div>
          <img 
            src="${p.artworkUrl}" 
            alt="${p.name}" 
            class="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
            loading="lazy"
            onerror="this.src='${p.thumbUrl}'"
          />
        </div>

        <!-- Name & Genus -->
        <div class="text-center w-full mt-1">
          <h3 class="font-tech text-sm font-bold text-slate-100 group-hover:text-sky-300 tracking-wide transition-colors truncate">
            ${p.name}
          </h3>
          <span class="text-[10px] font-mono text-slate-400 block mt-0.5">
            Gen ${p.generation}
          </span>
        </div>

        <!-- Card Action Button Hint -->
        <div class="w-full mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 group-hover:text-sky-300">
          <span>INSPECT</span>
          <svg class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    `;
  }

  render() {
    const total = this.filteredList.length;

    if (total === 0) {
      if (this.observer) this.observer.disconnect();
      this.container.innerHTML = `
        <div class="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400 font-mono text-sm">
          <svg class="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>No Pokémon found matching your filter criteria</p>
          <span class="text-xs text-slate-500">Try checking for typos, resetting type filters, or switching generation</span>
        </div>
      `;
      return;
    }

    const currentBatch = this.filteredList.slice(0, this.renderedCount);
    const hasDualType = this.selectedTypes.length === 2;
    const hasSingleType = this.selectedTypes.length === 1;

    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Section Sub-Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div class="flex items-center space-x-2.5 flex-wrap">
            <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span class="font-tech text-xs tracking-wider text-slate-300" id="grid-status-counter">
              DISPLAYING ${currentBatch.length} OF ${total} UNITS
            </span>

            ${hasDualType ? `
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
                DUAL-TYPE: ${this.selectedTypes[0].toUpperCase()} + ${this.selectedTypes[1].toUpperCase()}
              </span>
            ` : (hasSingleType ? `
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
                TYPE: ${this.selectedTypes[0].toUpperCase()}
              </span>
            ` : '')}

            ${this.searchQuery ? `
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-white/5">
                QUERY: "${this.searchQuery}"
              </span>
            ` : ''}
          </div>

          <span class="text-[11px] font-mono text-slate-400">
            Click any card to open Detailed Inspection & 3D Lab
          </span>
        </div>

        <!-- Responsive Pokémon Cards Grid Container -->
        <div id="cards-grid-inner" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          ${currentBatch.map(p => this.renderCardHtml(p)).join('')}
        </div>

        <!-- Infinite Scroll Sentinel & Progressive Loading Indicator (Feature 1) -->
        <div id="infinite-scroll-sentinel" class="w-full py-8 flex flex-col items-center justify-center space-y-2 mt-4">
          ${this.renderedCount < total ? `
            <div class="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-sky-400/20 text-xs font-mono text-sky-400 shadow-lg">
              <div class="w-4 h-4 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin"></div>
              <span>SCROLL TO LOAD MORE SPECIMENS (${this.renderedCount} / ${total})...</span>
            </div>
          ` : `
            <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-[11px] font-mono text-slate-500">
              <span>✓ ALL ${total} SPECIMENS INDEXED</span>
            </div>
          `}
        </div>
      </div>
    `;

    this.bindCardEvents();
    this.setupInfiniteScroll();
  }

  loadNextBatch() {
    if (this.isLoadingMore || this.renderedCount >= this.filteredList.length) {
      return;
    }

    this.isLoadingMore = true;
    const startIdx = this.renderedCount;
    const endIdx = Math.min(this.filteredList.length, this.renderedCount + this.PAGE_SIZE);
    const nextItems = this.filteredList.slice(startIdx, endIdx);
    this.renderedCount = endIdx;

    const gridInner = this.container.querySelector('#cards-grid-inner');
    if (gridInner && nextItems.length > 0) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = nextItems.map(p => this.renderCardHtml(p)).join('');

      while (tempDiv.firstChild) {
        gridInner.appendChild(tempDiv.firstChild);
      }

      this.bindCardEvents();
    }

    // Update status counter and sentinel
    const counterEl = this.container.querySelector('#grid-status-counter');
    if (counterEl) {
      counterEl.textContent = `DISPLAYING ${this.renderedCount} OF ${this.filteredList.length} UNITS`;
    }

    const sentinelEl = this.container.querySelector('#infinite-scroll-sentinel');
    if (sentinelEl) {
      if (this.renderedCount >= this.filteredList.length) {
        sentinelEl.innerHTML = `
          <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-[11px] font-mono text-slate-500">
            <span>✓ ALL ${this.filteredList.length} SPECIMENS INDEXED</span>
          </div>
        `;
        if (this.observer) this.observer.disconnect();
      } else {
        sentinelEl.innerHTML = `
          <div class="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-sky-400/20 text-xs font-mono text-sky-400 shadow-lg">
            <div class="w-4 h-4 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin"></div>
            <span>SCROLL TO LOAD MORE SPECIMENS (${this.renderedCount} / ${this.filteredList.length})...</span>
          </div>
        `;
      }
    }

    setTimeout(() => {
      this.isLoadingMore = false;
    }, 100);
  }

  setupInfiniteScroll() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const sentinel = this.container.querySelector('#infinite-scroll-sentinel');
    if (!sentinel || this.renderedCount >= this.filteredList.length) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        this.loadNextBatch();
      }
    }, {
      rootMargin: '250px'
    });

    this.observer.observe(sentinel);
  }

  bindWindowScroll() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (this.renderedCount < this.filteredList.length) {
            const scrollBottom = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 350;
            if (scrollBottom >= threshold) {
              this.loadNextBatch();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  bindCardEvents() {
    const cards = this.container.querySelectorAll('.pokemon-card');
    cards.forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = 'true';

      card.addEventListener('click', () => {
        soundManager.playClick();
        const numId = parseInt(card.dataset.num, 10);
        this.onSelectPokemon(numId);
      });

      card.addEventListener('mouseenter', () => {
        soundManager.playHover();
      });
    });
  }
}
