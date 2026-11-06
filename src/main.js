import './styles/index.css';
import { pokeApiClient } from './services/PokeApiClient.js';
import { SceneManager } from './scene/SceneManager.js';
import { TopNavbar } from './components/TopNavbar.js';
import { PokemonCardGrid } from './components/PokemonCardGrid.js';
import { DetailModal } from './components/DetailModal.js';

class App {
  constructor() {
    this.topNavbar = null;
    this.cardGrid = null;
    this.detailModal = null;
    this.sceneManager = null;

    this.currentGenId = 1;
    this.currentPokemonList = [];
    this.searchQuery = '';
    this.selectedTypes = [];

    // Theme state (Dark or Light)
    this.currentTheme = localStorage.getItem('pokedex_theme') || 'dark';

    this.init();
  }

  async init() {
    // Apply initial theme to body
    this.applyTheme(this.currentTheme);

    // 1. Initialize Shared 3D Scene Manager
    const offscreenContainer = document.getElementById('offscreen-three-container');
    this.sceneManager = new SceneManager(offscreenContainer);
    this.sceneManager.setTheme(this.currentTheme);

    // 2. Initialize Detailed View Modal
    const modalContainer = document.getElementById('detail-modal-container');
    this.detailModal = new DetailModal(modalContainer, this.sceneManager, (numId) => {
      this.openPokemonDetails(numId);
    });

    // 3. Initialize Pokemon Card Grid (with Infinite Scroll)
    const gridContainer = document.getElementById('pokemon-grid-container');
    this.cardGrid = new PokemonCardGrid(gridContainer, (numId) => {
      this.openPokemonDetails(numId);
    });

    // 4. Initialize Top Navbar with Dual-Type Filter & Search Auto-Suggest
    const navbarContainer = document.getElementById('navbar-container');
    this.topNavbar = new TopNavbar(navbarContainer, {
      currentTheme: this.currentTheme,
      onSelectGeneration: (genId) => this.loadGeneration(genId),
      onSearch: (query) => {
        this.searchQuery = query;
        this.applyCurrentFilters();
      },
      onSelectTypes: async (types) => {
        this.selectedTypes = types;
        await this.applyCurrentFilters();
      },
      onSelectPokemon: (numId) => {
        this.openPokemonDetails(numId);
      },
      onToggleTheme: (newTheme) => {
        this.applyTheme(newTheme);
      }
    });

    // 5. Initial Load: Generation 1 (Kanto 1-151)
    await this.loadGeneration(1);

    // 6. Preload Master Index for instant global auto-suggest & typo matching
    pokeApiClient.getAllPokemonIndex().then(allIndex => {
      if (this.topNavbar) {
        this.topNavbar.setAllPokemonIndex(allIndex);
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('pokedex_theme', theme);

    if (theme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }

    if (this.sceneManager) {
      this.sceneManager.setTheme(theme);
    }
  }

  async applyCurrentFilters() {
    if (!this.selectedTypes || this.selectedTypes.length === 0) {
      this.cardGrid.setFilters(this.searchQuery, [], null);
    } else if (this.selectedTypes.length === 1) {
      this.cardGrid.setLoading(true);
      const typeSet = await pokeApiClient.getPokemonNamesByType(this.selectedTypes[0]);
      this.cardGrid.setLoading(false);
      this.cardGrid.setFilters(this.searchQuery, this.selectedTypes, typeSet);
    } else {
      // Dual-type filtering: compute intersection of both type sets (Feature 2)
      this.cardGrid.setLoading(true);
      const [set1, set2] = await Promise.all([
        pokeApiClient.getPokemonNamesByType(this.selectedTypes[0]),
        pokeApiClient.getPokemonNamesByType(this.selectedTypes[1])
      ]);
      this.cardGrid.setLoading(false);

      const dualSet = new Set();
      if (set1 && set2) {
        set1.forEach(name => {
          if (set2.has(name)) {
            dualSet.add(name);
          }
        });
      }
      this.cardGrid.setFilters(this.searchQuery, this.selectedTypes, dualSet);
    }
  }

  async loadGeneration(genId) {
    this.currentGenId = genId;
    this.cardGrid.setLoading(true);

    try {
      this.currentPokemonList = await pokeApiClient.getPokemonByGeneration(genId);
      this.cardGrid.setLoading(false);
      this.cardGrid.setData(this.currentPokemonList);
      this.topNavbar.setCount(this.currentPokemonList.length);
      await this.applyCurrentFilters();
    } catch (e) {
      console.error('Failed to load Pokémon generation:', e);
      this.cardGrid.setLoading(false);
    }
  }

  async openPokemonDetails(numId) {
    try {
      const pokemon = await pokeApiClient.getPokemonDetails(numId);
      this.detailModal.open(pokemon);
    } catch (e) {
      console.error('Failed to load Pokémon details for inspection:', e);
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
