import { TYPE_COLORS } from '../data/pokemonData.js';
import { soundManager } from '../audio/SoundManager.js';
import { EvolutionTree } from './EvolutionTree.js';
import { GenerationSpriteArchive } from './GenerationSpriteArchive.js';
import { DetailsPanel } from './DetailsPanel.js';
import { ImageViewport } from './ImageViewport.js';
import { pokeApiClient } from '../services/PokeApiClient.js';

export class DetailModal {
  constructor(container, sceneManager, onSelectPokemon) {
    this.container = container;
    this.sceneManager = sceneManager;
    this.onSelectPokemon = onSelectPokemon;

    this.isOpen = false;
    this.pokemon = null;
    this.basePokemon = null;
    this.currentData = null;
    this.activeVariety = null;
    this.viewMode = 'image'; // 'image' | '3d'

    // Sub-components inside modal
    this.imageViewport = null;
    this.evolutionTree = null;
    this.archiveComponent = null;
    this.detailsPanel = null;

    this.render();
  }

  open(pokemon) {
    this.pokemon = pokemon;
    this.basePokemon = pokemon;
    this.currentData = { ...pokemon };
    this.activeVariety = (pokemon.varieties && pokemon.varieties.find(v => v.isDefault)) || (pokemon.varieties && pokemon.varieties[0]) || null;
    this.isOpen = true;
    this.viewMode = 'image'; // Start in 2D image view by default

    const modalRoot = this.container.querySelector('#detail-modal-root');
    if (modalRoot) {
      modalRoot.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    this.update();
  }

  close() {
    this.isOpen = false;
    const modalRoot = this.container.querySelector('#detail-modal-root');
    if (modalRoot) {
      modalRoot.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    // Reset 3D viewport canvas if it was attached
    const threeContainer = this.container.querySelector('#modal-3d-viewport');
    if (threeContainer && this.sceneManager.renderer.domElement.parentElement === threeContainer) {
      threeContainer.innerHTML = '';
    }
  }

  async switchForm(variety) {
    if (!variety || !this.pokemon) return;

    if (variety.isDefault) {
      this.activeVariety = variety;
      this.currentData = { ...this.basePokemon };
      if (this.imageViewport) {
        this.imageViewport.setActiveVariety(variety, this.basePokemon.sprites);
      }
      this.renderHeader();
      if (this.detailsPanel) {
        this.detailsPanel.update(this.currentData);
      }
      return;
    }

    // Alternative form selected (Mega, G-Max, Regional)
    if (this.imageViewport) {
      this.imageViewport.setLoadingForm(true);
    }

    try {
      const formDetails = await pokeApiClient.getFormDetails(variety);
      if (this.imageViewport) {
        this.imageViewport.setLoadingForm(false);
      }
      if (!formDetails) return;

      this.activeVariety = variety;
      this.currentData = {
        ...this.basePokemon,
        name: formDetails.name || variety.name,
        formShortName: variety.shortName,
        formTypeBadge: variety.typeBadge,
        types: formDetails.types && formDetails.types.length > 0 ? formDetails.types : this.basePokemon.types,
        stats: formDetails.stats || this.basePokemon.stats,
        height: formDetails.height || this.basePokemon.height,
        weight: formDetails.weight || this.basePokemon.weight,
        sprites: formDetails.sprites || this.basePokemon.sprites
      };

      if (this.imageViewport) {
        this.imageViewport.setActiveVariety(variety, formDetails.sprites);
      }
      this.renderHeader();
      if (this.detailsPanel) {
        this.detailsPanel.update(this.currentData);
      }
    } catch (e) {
      console.error('Failed to load alternative form details:', e);
      if (this.imageViewport) {
        this.imageViewport.setLoadingForm(false);
      }
    }
  }

  update() {
    if (!this.isOpen || !this.pokemon) return;

    this.renderHeader();
    this.renderVisualizer();

    // Update subcomponents
    const evoContainer = this.container.querySelector('#modal-evolution-container');
    if (evoContainer) {
      if (!this.evolutionTree) {
        this.evolutionTree = new EvolutionTree(evoContainer, (p, isEvo) => {
          this.onSelectPokemon(p.numId);
        });
      }
      this.evolutionTree.update(this.pokemon);
    }

    const archiveContainer = this.container.querySelector('#modal-archive-container');
    if (archiveContainer) {
      if (!this.archiveComponent) {
        this.archiveComponent = new GenerationSpriteArchive(archiveContainer);
      }
      this.archiveComponent.update(this.pokemon);
    }

    const detailsContainer = this.container.querySelector('#modal-details-container');
    if (detailsContainer) {
      if (!this.detailsPanel) {
        this.detailsPanel = new DetailsPanel(detailsContainer);
      }
      this.detailsPanel.update(this.currentData || this.pokemon);
    }
  }

  render() {
    this.container.innerHTML = `
      <div id="detail-modal-root" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 hidden">
        <!-- Backdrop Blur -->
        <div id="modal-backdrop" class="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"></div>

        <!-- Modal Dialog Box -->
        <div class="relative w-full max-w-6xl max-h-[92vh] glass-panel border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Top Modal Header -->
          <div id="modal-header-container" class="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60 select-none">
            <!-- Rendered by renderHeader() -->
          </div>

          <!-- Modal Scrollable Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            <!-- Top Section: Interactive Visualizer & Primary Specs -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- Left: Visualizer Stage (2D Artwork / 3D Canvas) -->
              <div class="lg:col-span-7 h-[460px] rounded-2xl glass-panel border border-white/10 relative overflow-hidden flex flex-col">
                
                <!-- Mode Switcher Header -->
                <div class="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/40 z-20">
                  <div class="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 border border-white/10">
                    <button 
                      id="modal-btn-image-mode"
                      class="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-sky-500/20 text-sky-300 border border-sky-400/40"
                    >
                      🖼️ SPRITES & ARTWORK
                    </button>
                    <button 
                      id="modal-btn-3d-mode"
                      class="px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all text-slate-400 hover:text-slate-200 flex items-center space-x-1.5"
                    >
                      <span>🌐 3D MODEL</span>
                      <span id="modal-3d-badge" class="px-1.5 py-0.2 rounded text-[8px] bg-slate-800 text-slate-400 border border-white/5">READY</span>
                    </button>
                  </div>
                </div>

                <!-- Stage Viewport Container -->
                <div class="relative flex-1 w-full h-full">
                  <!-- 2D Image Viewport Container -->
                  <div id="modal-image-viewport" class="absolute inset-0 w-full h-full"></div>

                  <!-- 3D Three.js Viewport Container -->
                  <div id="modal-3d-viewport" class="absolute inset-0 w-full h-full hidden cursor-grab active:cursor-grabbing"></div>
                </div>
              </div>

              <!-- Right: Synchronized Evolution Tree -->
              <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div id="modal-evolution-container">
                  <!-- EvolutionTree will render here -->
                </div>
              </div>
            </div>

            <!-- Middle Section: All Generations Historical Sprite Archive -->
            <div id="modal-archive-container">
              <!-- GenerationSpriteArchive will render here -->
            </div>

            <!-- Bottom Section: Base Telemetry Stats, Type Effectiveness & Lore -->
            <div id="modal-details-container">
              <!-- DetailsPanel will render here -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindGlobalEvents();
  }

  renderHeader() {
    const container = this.container.querySelector('#modal-header-container');
    if (!container || !this.pokemon) return;

    const p = this.currentData || this.pokemon;
    const isAltForm = this.activeVariety && !this.activeVariety.isDefault;

    const typeBadges = p.types.map(t => {
      const info = TYPE_COLORS[t] || { badge: 'bg-slate-700 text-slate-200 border-slate-600' };
      return `<span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-semibold border ${info.badge}">${t.toUpperCase()}</span>`;
    }).join(' ');

    const formBadge = isAltForm 
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/25 text-purple-200 border border-purple-400/50 animate-pulse">${this.activeVariety.typeBadge}</span>`
      : '';

    container.innerHTML = `
      <!-- Left Info -->
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center p-1">
          <img src="${p.sprites?.pixelFront || p.sprites?.officialArtwork}" alt="${p.name}" class="max-w-full max-h-full object-contain" />
        </div>
        <div>
          <div class="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <span class="font-mono text-sm text-sky-400 font-bold">#${this.pokemon.id}</span>
            <h2 class="font-tech text-xl font-bold tracking-wider text-white">${p.name.toUpperCase()}</h2>
            ${formBadge}
            <div class="flex items-center space-x-1.5 ml-1">
              ${typeBadges}
            </div>
          </div>
          <p class="text-xs font-mono text-slate-400 mt-0.5">${this.pokemon.japaneseName || ''} • ${this.pokemon.genus || 'Pokémon'} • ${this.pokemon.generation?.name || 'GEN I'} • ${p.height} • ${p.weight}</p>
        </div>
      </div>

      <!-- Right Actions: Prev/Next & Close -->
      <div class="flex items-center space-x-2">
        <button id="modal-prev-btn" class="p-2 rounded-xl bg-slate-800/70 border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all" title="Previous Pokémon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button id="modal-next-btn" class="p-2 rounded-xl bg-slate-800/70 border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all" title="Next Pokémon">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <div class="h-6 w-px bg-white/10 mx-1"></div>

        <button id="modal-close-btn" class="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-all" title="Close Detailed View (ESC)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    // Bind header buttons
    container.querySelector('#modal-close-btn').addEventListener('click', () => {
      soundManager.playClick();
      this.close();
    });

    container.querySelector('#modal-prev-btn').addEventListener('click', () => {
      soundManager.playClick();
      if (this.pokemon.numId > 1) {
        this.onSelectPokemon(this.pokemon.numId - 1);
      }
    });

    container.querySelector('#modal-next-btn').addEventListener('click', () => {
      soundManager.playClick();
      if (this.pokemon.numId < 1025) {
        this.onSelectPokemon(this.pokemon.numId + 1);
      }
    });
  }

  renderVisualizer() {
    const imgContainer = this.container.querySelector('#modal-image-viewport');
    const threeContainer = this.container.querySelector('#modal-3d-viewport');
    const btnImg = this.container.querySelector('#modal-btn-image-mode');
    const btn3D = this.container.querySelector('#modal-btn-3d-mode');
    const badge3D = this.container.querySelector('#modal-3d-badge');

    // 3D badge status
    const has3D = this.pokemon.has3D;
    if (badge3D) {
      if (has3D) {
        badge3D.className = 'px-1.5 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse font-bold';
        badge3D.textContent = 'AVAILABLE';
      } else {
        badge3D.className = 'px-1.5 py-0.2 rounded text-[8px] bg-slate-800 text-slate-400 border border-white/5';
        badge3D.textContent = 'IN LAB';
      }
    }

    // Initialize ImageViewport
    if (!this.imageViewport) {
      this.imageViewport = new ImageViewport(
        imgContainer, 
        () => this.setStageMode('3d'),
        (variety) => this.switchForm(variety)
      );
    }
    this.imageViewport.update(this.pokemon, this.activeVariety, this.currentData ? this.currentData.sprites : this.pokemon.sprites);

    // Switch buttons
    btnImg.onclick = () => {
      soundManager.playClick();
      this.setStageMode('image');
    };

    btn3D.onclick = () => {
      soundManager.playClick();
      this.setStageMode('3d');
    };

    this.setStageMode(this.viewMode);
  }

  setStageMode(mode) {
    this.viewMode = mode;
    const imgContainer = this.container.querySelector('#modal-image-viewport');
    const threeContainer = this.container.querySelector('#modal-3d-viewport');
    const btnImg = this.container.querySelector('#modal-btn-image-mode');
    const btn3D = this.container.querySelector('#modal-btn-3d-mode');

    if (mode === '3d') {
      imgContainer.classList.add('hidden');
      threeContainer.classList.remove('hidden');

      // Attach Three.js canvas to modal viewport
      if (threeContainer && this.sceneManager.renderer.domElement.parentElement !== threeContainer) {
        threeContainer.appendChild(this.sceneManager.renderer.domElement);
      }
      this.sceneManager.onResize();
      this.sceneManager.loadPokemon(this.pokemon, false);

      btn3D.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-md shadow-emerald-500/20';
      btnImg.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all text-slate-400 hover:text-slate-200';
    } else {
      threeContainer.classList.add('hidden');
      imgContainer.classList.remove('hidden');

      btnImg.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-md shadow-sky-500/20';
      btn3D.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all text-slate-400 hover:text-slate-200';
    }
  }

  bindGlobalEvents() {
    const backdrop = this.container.querySelector('#modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        soundManager.playClick();
        this.close();
      });
    }

    // ESC key close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
}
