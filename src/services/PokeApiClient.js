/**
 * PokeAPI Client with Multi-Tier Caching & Sprite Extraction Across All Generations
 */

import { GENERATIONS, has3DModel } from '../data/pokemonGenerations.js';

class PokeApiClient {
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2';
    this.cache = new Map();
    this.speciesCache = new Map();
    this.evolutionCache = new Map();
  }

  /**
   * Helper to fetch JSON with local storage caching
   */
  async fetchWithCache(url, storageKey) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache.set(url, parsed);
        return parsed;
      }
    } catch (e) {
      // LocalStorage might be full or restricted
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }

    const data = await res.json();
    this.cache.set(url, data);

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      // Ignore storage quota
    }

    return data;
  }

  /**
   * Fetch full list of Pokémon for a specific generation
   */
  async getPokemonByGeneration(genId = 1) {
    const gen = GENERATIONS.find(g => g.id === genId) || GENERATIONS[0];
    const [start, end] = gen.range;
    const limit = end - start + 1;
    const offset = start - 1;

    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    const data = await this.fetchWithCache(url, `poke_gen_${genId}`);

    return data.results.map((item, index) => {
      const id = start + index;
      const formattedId = String(id).padStart(4, '0');
      return {
        id: formattedId,
        numId: id,
        name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        url: item.url,
        thumbUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        artworkUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        has3D: has3DModel(id),
        generation: genId
      };
    });
  }

  /**
   * Fetch set of Pokemon names for a given type (for instant filtering)
   */
  async getPokemonNamesByType(typeName) {
    if (!typeName || typeName.toUpperCase() === 'ALL') return null;
    const lower = typeName.toLowerCase();
    const url = `${this.baseUrl}/type/${lower}`;
    const key = `poke_type_${lower}`;
    try {
      const data = await this.fetchWithCache(url, key);
      return new Set(data.pokemon.map(p => p.pokemon.name.toLowerCase()));
    } catch (e) {
      console.warn(`Failed to fetch type ${typeName}`, e);
      return null;
    }
  }

  /**
   * Fetch detailed Pokémon data by ID or Name
   */
  async getPokemonDetails(idOrName) {
    const url = `${this.baseUrl}/pokemon/${idOrName}`;
    const key = `poke_detail_${idOrName}`;
    const raw = await this.fetchWithCache(url, key);

    const numId = raw.id;
    const formattedId = String(numId).padStart(4, '0');

    // Extract Types
    const types = raw.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));

    // Extract Stats
    const statsMap = {};
    raw.stats.forEach(s => {
      const name = s.stat.name;
      if (name === 'hp') statsMap.hp = s.base_stat;
      else if (name === 'attack') statsMap.attack = s.base_stat;
      else if (name === 'defense') statsMap.defense = s.base_stat;
      else if (name === 'special-attack') statsMap.spAtk = s.base_stat;
      else if (name === 'special-defense') statsMap.spDef = s.base_stat;
      else if (name === 'speed') statsMap.speed = s.base_stat;
    });

    // Extract Abilities
    const abilities = raw.abilities.map(a => 
      (a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1).replace('-', ' ')) +
      (a.is_hidden ? ' (Hidden)' : '')
    );

    // Extract Moves
    const signatureMoves = raw.moves.slice(0, 4).map(m => ({
      name: m.move.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      type: types[0] || 'Normal',
      power: 60 + Math.floor(Math.random() * 40),
      accuracy: 100
    }));

    // Extract Generation Sprites History
    const genSprites = this.extractGenerationSprites(raw.sprites, numId);

    // High Res Artworks & Animations
    const sprites = {
      officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numId}.png`,
      officialArtworkShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${numId}.png`,
      home3D: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${numId}.png`,
      home3DShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${numId}.png`,
      showdownAnimated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${numId}.gif`,
      showdownAnimatedShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${numId}.gif`,
      pixelFront: raw.sprites.front_default,
      pixelShiny: raw.sprites.front_shiny,
      generations: genSprites
    };

    // Determine generation
    const genObj = GENERATIONS.find(g => numId >= g.range[0] && numId <= g.range[1]) || GENERATIONS[0];

    // Fetch Species Information (Lore, Japanese name, Evolution chain, Varieties)
    const species = await this.getSpeciesDetails(raw.species.url);

    return {
      id: formattedId,
      numId,
      name: raw.name.charAt(0).toUpperCase() + raw.name.slice(1),
      japaneseName: species.japaneseName,
      genus: species.genus,
      types,
      height: `${(raw.height / 10).toFixed(1)} m`,
      weight: `${(raw.weight / 10).toFixed(1)} kg`,
      stats: statsMap,
      description: species.description,
      abilities,
      signatureMoves,
      sprites,
      has3D: has3DModel(numId),
      modelKey: raw.name.toLowerCase(),
      evolutionChainUrl: species.evolutionChainUrl,
      generation: genObj,
      varieties: species.varieties || [],
      activeVariety: (species.varieties && species.varieties.find(v => v.isDefault)) || (species.varieties && species.varieties[0]) || null
    };
  }

  /**
   * Fetch Species details for lore, Japanese name, evolution chain & alternative varieties
   */
  async getSpeciesDetails(speciesUrl) {
    if (!speciesUrl) {
      return { japaneseName: '', genus: 'Pokémon', description: 'No telemetry lore available.', evolutionChainUrl: null, varieties: [] };
    }

    try {
      const data = await this.fetchWithCache(speciesUrl, `poke_species_${speciesUrl}`);

      // Japanese Name
      const jaNameObj = data.names?.find(n => n.language.name === 'ja-Hrkt' || n.language.name === 'ja');
      const japaneseName = jaNameObj ? jaNameObj.name : '';

      // Genus
      const genusObj = data.genera?.find(g => g.language.name === 'en');
      const genus = genusObj ? genusObj.genus : 'Pokémon';

      // English Lore text
      const flavorEntries = data.flavor_text_entries?.filter(f => f.language.name === 'en');
      const rawText = flavorEntries && flavorEntries.length > 0 
        ? flavorEntries[flavorEntries.length - 1].flavor_text
        : 'A fascinating Pokémon discovered in the wilderness.';
      const description = rawText.replace(/[\n\f\r]/g, ' ');

      // Alternative Forms & Varieties (Mega, Gigantamax, Regional Forms)
      const varieties = this.parseVarieties(data.varieties, data.name);

      return {
        japaneseName,
        genus,
        description,
        evolutionChainUrl: data.evolution_chain?.url || null,
        varieties
      };
    } catch (e) {
      console.warn('Species fetch error:', e);
      return { japaneseName: '', genus: 'Pokémon', description: 'Telemetry signal degraded.', evolutionChainUrl: null, varieties: [] };
    }
  }

  /**
   * Parse species varieties and classify into Standard, Mega, Gigantamax, Regional, or Special
   */
  parseVarieties(rawVarieties, baseName = '') {
    if (!rawVarieties || rawVarieties.length === 0) return [];

    const varieties = [];

    rawVarieties.forEach(v => {
      const slug = v.pokemon.name;
      const url = v.pokemon.url;
      const match = url.match(/\/pokemon\/(\d+)\//);
      const varietyId = match ? parseInt(match[1], 10) : null;

      let name = 'Standard Form';
      let shortName = 'Standard';
      let formType = 'default';
      let typeBadge = 'DEFAULT';

      if (!v.is_default) {
        if (slug.includes('-mega-x')) {
          name = 'Mega Evolution X';
          shortName = 'Mega X';
          formType = 'mega';
          typeBadge = 'MEGA';
        } else if (slug.includes('-mega-y')) {
          name = 'Mega Evolution Y';
          shortName = 'Mega Y';
          formType = 'mega';
          typeBadge = 'MEGA';
        } else if (slug.includes('-mega')) {
          name = 'Mega Evolution';
          shortName = 'Mega';
          formType = 'mega';
          typeBadge = 'MEGA';
        } else if (slug.includes('-gmax')) {
          name = 'Gigantamax Form';
          shortName = 'Gigantamax';
          formType = 'gmax';
          typeBadge = 'G-MAX';
        } else if (slug.includes('-alola')) {
          name = 'Alolan Form';
          shortName = 'Alolan';
          formType = 'alola';
          typeBadge = 'ALOLAN';
        } else if (slug.includes('-galar')) {
          name = 'Galarian Form';
          shortName = 'Galarian';
          formType = 'galar';
          typeBadge = 'GALAR';
        } else if (slug.includes('-hisui')) {
          name = 'Hisuian Form';
          shortName = 'Hisuian';
          formType = 'hisui';
          typeBadge = 'HISUI';
        } else if (slug.includes('-paldea')) {
          name = 'Paldean Form';
          shortName = 'Paldean';
          formType = 'paldea';
          typeBadge = 'PALDEA';
        } else if (slug.includes('-primal')) {
          name = 'Primal Reversion';
          shortName = 'Primal';
          formType = 'special';
          typeBadge = 'PRIMAL';
        } else if (slug.includes('-origin')) {
          name = 'Origin Forme';
          shortName = 'Origin';
          formType = 'special';
          typeBadge = 'ORIGIN';
        } else if (slug.includes('-therian')) {
          name = 'Therian Forme';
          shortName = 'Therian';
          formType = 'special';
          typeBadge = 'THERIAN';
        } else if (slug.includes('-crowned')) {
          name = 'Crowned Form';
          shortName = 'Crowned';
          formType = 'special';
          typeBadge = 'CROWNED';
        } else {
          const parts = slug.split('-');
          const formWords = parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1));
          if (formWords.length > 0) {
            shortName = formWords.join(' ');
            name = `${formWords.join(' ')} Form`;
            typeBadge = formWords[0].toUpperCase();
            formType = 'special';
          }
        }
      }

      varieties.push({
        id: varietyId,
        slug,
        name,
        shortName,
        formType,
        typeBadge,
        isDefault: v.is_default,
        url
      });
    });

    // Filter to meaningful battle varieties (Standard, Mega, G-Max, Regional, Primal, Special)
    const filtered = varieties.filter(v => 
      v.isDefault || 
      ['mega', 'gmax', 'alola', 'galar', 'hisui', 'paldea', 'special'].includes(v.formType)
    );

    return filtered.length > 0 ? filtered : varieties;
  }

  /**
   * Fetch complete data for an alternative Pokémon variety (Mega, G-Max, Regional)
   */
  async getFormDetails(variety) {
    if (!variety || !variety.url) return null;
    const cacheKey = `poke_form_${variety.slug || variety.id}`;
    const raw = await this.fetchWithCache(variety.url, cacheKey);
    const numId = raw.id;

    const types = raw.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));

    const statsMap = {};
    raw.stats.forEach(s => {
      const name = s.stat.name;
      if (name === 'hp') statsMap.hp = s.base_stat;
      else if (name === 'attack') statsMap.attack = s.base_stat;
      else if (name === 'defense') statsMap.defense = s.base_stat;
      else if (name === 'special-attack') statsMap.spAtk = s.base_stat;
      else if (name === 'special-defense') statsMap.spDef = s.base_stat;
      else if (name === 'speed') statsMap.speed = s.base_stat;
    });

    const sprites = {
      officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numId}.png`,
      officialArtworkShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${numId}.png`,
      home3D: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${numId}.png`,
      home3DShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${numId}.png`,
      showdownAnimated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${numId}.gif`,
      showdownAnimatedShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${numId}.gif`,
      pixelFront: raw.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${numId}.png`,
      pixelShiny: raw.sprites?.front_shiny || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${numId}.png`
    };

    return {
      id: numId,
      slug: raw.name,
      name: variety.name,
      shortName: variety.shortName,
      formType: variety.formType,
      typeBadge: variety.typeBadge,
      isDefault: variety.isDefault,
      types,
      stats: statsMap,
      height: `${(raw.height / 10).toFixed(1)} m`,
      weight: `${(raw.weight / 10).toFixed(1)} kg`,
      sprites
    };
  }

  /**
   * Traverse Evolution Chain API response
   */
  async getEvolutionChain(chainUrl) {
    if (!chainUrl) return null;

    try {
      const data = await this.fetchWithCache(chainUrl, `poke_evo_${chainUrl}`);
      const nodes = [];
      const links = [];

      const traverse = (node, stage = 0) => {
        const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
        const numId = idMatch ? parseInt(idMatch[1], 10) : 1;
        const formattedId = String(numId).padStart(4, '0');
        const name = node.species.name.charAt(0).toUpperCase() + node.species.name.slice(1);

        nodes.push({
          id: formattedId,
          numId,
          name,
          stage,
          artworkUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numId}.png`,
          thumbUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${numId}.png`,
          has3D: has3DModel(numId)
        });

        node.evolves_to.forEach(child => {
          const childMatch = child.species.url.match(/\/pokemon-species\/(\d+)\//);
          const childNumId = childMatch ? parseInt(childMatch[1], 10) : 1;
          const childFormattedId = String(childNumId).padStart(4, '0');

          // Extract evolution trigger details
          let triggerLabel = 'Evolution';
          if (child.evolution_details && child.evolution_details.length > 0) {
            const detail = child.evolution_details[0];
            if (detail.min_level) triggerLabel = `Lv. ${detail.min_level}`;
            else if (detail.item) triggerLabel = detail.item.name.replace('-', ' ');
            else if (detail.trigger?.name === 'trade') triggerLabel = 'Trade';
            else if (detail.min_happiness) triggerLabel = 'Friendship';
          }

          links.push({
            source: formattedId,
            target: childFormattedId,
            label: triggerLabel
          });

          traverse(child, stage + 1);
        });
      };

      traverse(data.chain);

      return {
        isBranching: nodes.length > 3 || (nodes.length > 1 && links.length > 1 && links[0].source === links[1].source),
        nodes,
        links
      };
    } catch (e) {
      console.warn('Failed to parse evolution chain', e);
      return null;
    }
  }

  /**
   * Extracts historical sprite snapshots across all Pokemon Generations
   */
  extractGenerationSprites(spritesObj, numId) {
    const list = [];
    const versions = spritesObj?.versions || {};

    // Gen 1: Red/Blue/Yellow (1996)
    if (versions['generation-i']?.['red-blue']?.front_transparent || versions['generation-i']?.['red-blue']?.front_default) {
      list.push({
        genId: 1,
        title: 'Generation I',
        games: 'Red & Blue / Yellow',
        year: 1996,
        console: 'Game Boy (8-bit Monochrome)',
        url: versions['generation-i']['red-blue'].front_transparent || versions['generation-i']['red-blue'].front_default,
        notes: 'Original 56x56 pixel sprite rendered with 4 shades of monochrome Game Boy palette.'
      });
    }

    // Gen 2: Gold/Silver/Crystal (1999)
    if (versions['generation-ii']?.crystal?.front_default || versions['generation-ii']?.['gold']?.front_default) {
      list.push({
        genId: 2,
        title: 'Generation II',
        games: 'Gold, Silver & Crystal',
        year: 1999,
        console: 'Game Boy Color (16-bit Color)',
        url: versions['generation-ii'].crystal?.front_default || versions['generation-ii']['gold']?.front_default,
        notes: 'First generation to introduce full color sprites, animated entry frames, and shiny variants.'
      });
    }

    // Gen 3: Ruby/Sapphire/Emerald & FireRed (2002)
    if (versions['generation-iii']?.emerald?.front_default || versions['generation-iii']?.['ruby-sapphire']?.front_default) {
      list.push({
        genId: 3,
        title: 'Generation III',
        games: 'Ruby, Sapphire & Emerald',
        year: 2002,
        console: 'Game Boy Advance (32-bit Color)',
        url: versions['generation-iii'].emerald?.front_default || versions['generation-iii']['ruby-sapphire']?.front_default,
        notes: '64x64 pixel sprites with rich vibrant 15-bit color palettes and distinct battle stances.'
      });
    }

    // Gen 4: Diamond/Pearl/Platinum (2006)
    if (versions['generation-iv']?.['diamond-pearl']?.front_default || versions['generation-iv']?.platinum?.front_default) {
      list.push({
        genId: 4,
        title: 'Generation IV',
        games: 'Diamond, Pearl & Platinum',
        year: 2006,
        console: 'Nintendo DS (Dual Screen)',
        url: versions['generation-iv']['diamond-pearl']?.front_default || versions['generation-iv'].platinum?.front_default,
        notes: '80x80 pixel sprites with gender differences and dual-screen battle dynamics.'
      });
    }

    // Gen 5: Black & White (2010) - Animated
    if (versions['generation-v']?.['black-white']?.animated?.front_default || versions['generation-v']?.['black-white']?.front_default) {
      list.push({
        genId: 5,
        title: 'Generation V',
        games: 'Black & White / B2W2',
        year: 2010,
        console: 'Nintendo DS',
        url: versions['generation-v']['black-white'].animated?.front_default || versions['generation-v']['black-white'].front_default,
        notes: 'Pioneered continuously looping dynamic animated battle sprites and camera zooming.'
      });
    }

    // Gen 6: X & Y (2013)
    if (versions['generation-vi']?.['x-y']?.front_default) {
      list.push({
        genId: 6,
        title: 'Generation VI',
        games: 'X & Y / Omega Ruby & Alpha Sapphire',
        year: 2013,
        console: 'Nintendo 3DS (Stereoscopic 3D)',
        url: versions['generation-vi']['x-y'].front_default,
        notes: 'Transitioned the entire franchise into fully polygon-based real-time 3D models.'
      });
    }

    // Gen 7: Sun & Moon (2016)
    if (versions['generation-vii']?.['ultra-sun-ultra-moon']?.front_default) {
      list.push({
        genId: 7,
        title: 'Generation VII',
        games: 'Sun, Moon & Ultra S/M',
        year: 2016,
        console: 'Nintendo 3DS',
        url: versions['generation-vii']['ultra-sun-ultra-moon'].front_default,
        notes: 'Added realistic battle scaling, Z-Move camera cuts, and expressive idle animations.'
      });
    }

    // Modern 3D: Pokémon HOME / Showdown (Gen 8 & 9)
    list.push({
      genId: 8,
      title: 'Pokémon HOME (Modern 3D)',
      games: 'Sword & Shield, Scarlet & Violet',
      year: 2020,
      console: 'Nintendo Switch & Mobile',
      url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${numId}.png`,
      notes: 'High-definition 3D studio CGI render with PBR lighting and realistic surface materials.'
    });

    list.push({
      genId: 9,
      title: 'Official Sugimori / Ken Artwork',
      games: 'Master Artwork Archive',
      year: 2022,
      console: 'Official Pokémon Franchise Artwork',
      url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numId}.png`,
      notes: 'Full-resolution master digital vector artwork published by The Pokémon Company.'
    });

    return list;
  }
}

export const pokeApiClient = new PokeApiClient();
