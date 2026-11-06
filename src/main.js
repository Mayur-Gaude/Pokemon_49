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
    this.selectedType = 'ALL';

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

    // 3. Initialize Pokemon Card Grid
    const gridContainer = document.getElementById('pokemon-grid-container');
    this.cardGrid = new PokemonCardGrid(gridContainer, (numId) => {
      this.openPokemonDetails(numId);
    });

    // 4. Initialize Top Navbar with Theme Toggle
    const navbarContainer = document.getElementById('navbar-container');
    this.topNavbar = new TopNavbar(navbarContainer, {
      currentTheme: this.currentTheme,
      onSelectGeneration: (genId) => this.loadGeneration(genId),
      onSearch: (query) => {
        this.searchQuery = query;
        this.applyCurrentFilters();
      },
      onSelectType: async (type) => {
        this.selectedType = type;
        await this.applyCurrentFilters();
      },
      onToggleTheme: (newTheme) => {
        this.applyTheme(newTheme);
      }
    });

    // 5. Initial Load: Generation 1 (Kanto 1-151)
    await this.loadGeneration(1);
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
    if (!this.selectedType || this.selectedType === 'ALL') {
      this.cardGrid.setFilters(this.searchQuery, 'ALL', null);
    } else {
      this.cardGrid.setLoading(true);
      const typeSet = await pokeApiClient.getPokemonNamesByType(this.selectedType);
      this.cardGrid.setLoading(false);
      this.cardGrid.setFilters(this.searchQuery, this.selectedType, typeSet);
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
