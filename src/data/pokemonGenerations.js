/**
 * Pokémon Generation Metadata & Regional Pokedex Ranges
 */

export const GENERATIONS = [
  { id: 1, name: 'Gen I', region: 'Kanto', range: [1, 151], year: 1996, games: 'Red, Blue, Yellow', console: 'Game Boy' },
  { id: 2, name: 'Gen II', region: 'Johto', range: [152, 251], year: 1999, games: 'Gold, Silver, Crystal', console: 'Game Boy Color' },
  { id: 3, name: 'Gen III', region: 'Hoenn', range: [252, 386], year: 2002, games: 'Ruby, Sapphire, Emerald', console: 'Game Boy Advance' },
  { id: 4, name: 'Gen IV', region: 'Sinnoh', range: [387, 493], year: 2006, games: 'Diamond, Pearl, Platinum', console: 'Nintendo DS' },
  { id: 5, name: 'Gen V', region: 'Unova', range: [494, 649], year: 2010, games: 'Black, White, B2/W2', console: 'Nintendo DS' },
  { id: 6, name: 'Gen VI', region: 'Kalos', range: [650, 721], year: 2013, games: 'X & Y, ORAS', console: 'Nintendo 3DS' },
  { id: 7, name: 'Gen VII', region: 'Alola', range: [722, 809], year: 2016, games: 'Sun, Moon, Ultra S/M', console: 'Nintendo 3DS' },
  { id: 8, name: 'Gen VIII', region: 'Galar', range: [810, 905], year: 2019, games: 'Sword, Shield, Arceus', console: 'Nintendo Switch' },
  { id: 9, name: 'Gen IX', region: 'Paldea', range: [906, 1025], year: 2022, games: 'Scarlet & Violet', console: 'Nintendo Switch' }
];

/**
 * List of Pokémon IDs that currently have interactive procedural 3D models implemented
 */
export const AVAILABLE_3D_MODELS = new Set([
  1, 2, 3,        // Bulbasaur, Ivysaur, Venusaur
  4, 5, 6,        // Charmander, Charmeleon, Charizard
  7, 8, 9,        // Squirtle, Wartortle, Blastoise
  25, 26, 172,    // Pikachu, Raichu, Pichu
  92, 93, 94,     // Gastly, Haunter, Gengar
  133, 134, 135, 136 // Eevee, Vaporeon, Jolteon, Flareon
]);

export function has3DModel(pokemonId) {
  const numId = parseInt(pokemonId, 10);
  return AVAILABLE_3D_MODELS.has(numId);
}
