/**
 * Comprehensive Pokédex Roster Data & Evolution Graphs
 */

export const TYPE_COLORS = {
  Electric: { bg: '#eab308', text: '#000000', glow: '#fde047', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  Fire: { bg: '#ef4444', text: '#ffffff', glow: '#f87171', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  Water: { bg: '#0284c7', text: '#ffffff', glow: '#38bdf8', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  Grass: { bg: '#22c55e', text: '#ffffff', glow: '#4ade80', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  Poison: { bg: '#a855f7', text: '#ffffff', glow: '#c084fc', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  Flying: { bg: '#818cf8', text: '#ffffff', glow: '#a5b4fc', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  Ghost: { bg: '#7e22ce', text: '#ffffff', glow: '#a855f7', badge: 'bg-purple-700/20 text-purple-300 border-purple-600/40' },
  Normal: { bg: '#94a3b8', text: '#000000', glow: '#cbd5e1', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40' }
};

export const POKEMON_ROSTER = [
  // --- BULBASAUR LINE ---
  {
    id: '0001',
    name: 'Bulbasaur',
    japaneseName: 'フシギダネ (Fushigidane)',
    genus: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    primaryColor: '#10b981',
    accentColor: '#059669',
    glowColor: '#34d399',
    height: '0.7 m',
    weight: '6.9 kg',
    stats: { hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
    description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
    abilities: ['Overgrow', 'Chlorophyll (Hidden)'],
    signatureMoves: [
      { name: 'Vine Whip', type: 'Grass', power: 45, accuracy: 100 },
      { name: 'Leech Seed', type: 'Grass', power: 0, accuracy: 90 },
      { name: 'Sludge Bomb', type: 'Poison', power: 90, accuracy: 100 }
    ],
    evolutionFamily: 'bulbasaur',
    evolutionStage: 0,
    evolutionRequirement: 'Base Form',
    modelKey: 'bulbasaur'
  },
  {
    id: '0002',
    name: 'Ivysaur',
    japaneseName: 'フシギソウ (Fushigisou)',
    genus: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    primaryColor: '#059669',
    accentColor: '#ec4899',
    glowColor: '#10b981',
    height: '1.0 m',
    weight: '13.0 kg',
    stats: { hp: 60, attack: 62, defense: 63, spAtk: 80, spDef: 80, speed: 60 },
    description: 'When the bud on its back starts swelling, a sweet aroma wafts to indicate the flower’s coming bloom.',
    abilities: ['Overgrow', 'Chlorophyll (Hidden)'],
    signatureMoves: [
      { name: 'Razor Leaf', type: 'Grass', power: 55, accuracy: 95 },
      { name: 'Sweet Scent', type: 'Normal', power: 0, accuracy: 100 },
      { name: 'Solar Beam', type: 'Grass', power: 120, accuracy: 100 }
    ],
    evolutionFamily: 'bulbasaur',
    evolutionStage: 1,
    evolutionRequirement: 'Level 16',
    modelKey: 'ivysaur'
  },
  {
    id: '0003',
    name: 'Venusaur',
    japaneseName: 'フシギバナ (Fushigibana)',
    genus: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    primaryColor: '#047857',
    accentColor: '#f43f5e',
    glowColor: '#10b981',
    height: '2.0 m',
    weight: '100.0 kg',
    stats: { hp: 80, attack: 82, defense: 83, spAtk: 100, spDef: 100, speed: 80 },
    description: 'The plant blooms when it absorbs solar energy. It stays on the move to seek sunlight across lush valleys.',
    abilities: ['Overgrow', 'Chlorophyll (Hidden)'],
    signatureMoves: [
      { name: 'Solar Beam', type: 'Grass', power: 120, accuracy: 100 },
      { name: 'Petal Dance', type: 'Grass', power: 120, accuracy: 100 },
      { name: 'Frenzy Plant', type: 'Grass', power: 150, accuracy: 90 }
    ],
    evolutionFamily: 'bulbasaur',
    evolutionStage: 2,
    evolutionRequirement: 'Level 32',
    modelKey: 'venusaur'
  },

  // --- CHARMANDER LINE ---
  {
    id: '0004',
    name: 'Charmander',
    japaneseName: 'ヒトカゲ (Hitokage)',
    genus: 'Lizard Pokémon',
    types: ['Fire'],
    primaryColor: '#f97316',
    accentColor: '#ef4444',
    glowColor: '#fb923c',
    height: '0.6 m',
    weight: '8.5 kg',
    stats: { hp: 39, attack: 52, defense: 43, spAtk: 60, spDef: 50, speed: 65 },
    description: 'The flame on its tail indicates Charmander’s life force. If it is healthy, the flame burns brightly even in rain.',
    abilities: ['Blaze', 'Solar Power (Hidden)'],
    signatureMoves: [
      { name: 'Ember', type: 'Fire', power: 40, accuracy: 100 },
      { name: 'Dragon Breath', type: 'Fire', power: 60, accuracy: 100 },
      { name: 'Fire Spin', type: 'Fire', power: 35, accuracy: 85 }
    ],
    evolutionFamily: 'charmander',
    evolutionStage: 0,
    evolutionRequirement: 'Base Form',
    modelKey: 'charmander'
  },
  {
    id: '0005',
    name: 'Charmeleon',
    japaneseName: 'リザード (Lizardo)',
    genus: 'Flame Pokémon',
    types: ['Fire'],
    primaryColor: '#dc2626',
    accentColor: '#f97316',
    glowColor: '#ef4444',
    height: '1.1 m',
    weight: '19.0 kg',
    stats: { hp: 58, attack: 64, defense: 58, spAtk: 80, spDef: 65, speed: 80 },
    description: 'It lashes about with its tail to knock down foes. In the excitement of battle, it spouts bluish flames.',
    abilities: ['Blaze', 'Solar Power (Hidden)'],
    signatureMoves: [
      { name: 'Flame Burst', type: 'Fire', power: 70, accuracy: 100 },
      { name: 'Slash', type: 'Normal', power: 70, accuracy: 100 },
      { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100 }
    ],
    evolutionFamily: 'charmander',
    evolutionStage: 1,
    evolutionRequirement: 'Level 16',
    modelKey: 'charmeleon'
  },
  {
    id: '0006',
    name: 'Charizard',
    japaneseName: 'リザードン (Lizardon)',
    genus: 'Flame Pokémon',
    types: ['Fire', 'Flying'],
    primaryColor: '#ea580c',
    accentColor: '#0284c7',
    glowColor: '#f97316',
    height: '1.7 m',
    weight: '90.5 kg',
    stats: { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
    description: 'It spits fire hot enough to melt boulders. Known to cause wildfires unintentionally when soaring overhead.',
    abilities: ['Blaze', 'Solar Power (Hidden)'],
    signatureMoves: [
      { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100 },
      { name: 'Fire Blast', type: 'Fire', power: 110, accuracy: 85 },
      { name: 'Air Slash', type: 'Flying', power: 75, accuracy: 95 }
    ],
    evolutionFamily: 'charmander',
    evolutionStage: 2,
    evolutionRequirement: 'Level 36',
    modelKey: 'charizard'
  },

  // --- SQUIRTLE LINE ---
  {
    id: '0007',
    name: 'Squirtle',
    japaneseName: 'ゼニガメ (Zenigame)',
    genus: 'Tiny Turtle Pokémon',
    types: ['Water'],
    primaryColor: '#38bdf8',
    accentColor: '#854d0e',
    glowColor: '#0ea5e9',
    height: '0.5 m',
    weight: '9.0 kg',
    stats: { hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
    description: 'When it retracts its long neck into its shell, it squirts water out with vigorous force.',
    abilities: ['Torrent', 'Rain Dish (Hidden)'],
    signatureMoves: [
      { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100 },
      { name: 'Bubble', type: 'Water', power: 40, accuracy: 100 },
      { name: 'Aqua Tail', type: 'Water', power: 90, accuracy: 90 }
    ],
    evolutionFamily: 'squirtle',
    evolutionStage: 0,
    evolutionRequirement: 'Base Form',
    modelKey: 'squirtle'
  },
  {
    id: '0008',
    name: 'Wartortle',
    japaneseName: 'カメール (Kameil)',
    genus: 'Turtle Pokémon',
    types: ['Water'],
    primaryColor: '#0284c7',
    accentColor: '#e0f2fe',
    glowColor: '#38bdf8',
    height: '1.0 m',
    weight: '22.5 kg',
    stats: { hp: 59, attack: 63, defense: 80, spAtk: 65, spDef: 80, speed: 58 },
    description: 'It is recognized as a symbol of longevity. If its shell has algae on it, that Wartortle is very old.',
    abilities: ['Torrent', 'Rain Dish (Hidden)'],
    signatureMoves: [
      { name: 'Water Pulse', type: 'Water', power: 60, accuracy: 100 },
      { name: 'Aqua Jet', type: 'Water', power: 40, accuracy: 100 },
      { name: 'Hydro Pump', type: 'Water', power: 110, accuracy: 80 }
    ],
    evolutionFamily: 'squirtle',
    evolutionStage: 1,
    evolutionRequirement: 'Level 16',
    modelKey: 'wartortle'
  },
  {
    id: '0009',
    name: 'Blastoise',
    japaneseName: 'カメックス (Kamex)',
    genus: 'Shellfish Pokémon',
    types: ['Water'],
    primaryColor: '#0369a1',
    accentColor: '#78716c',
    glowColor: '#0284c7',
    height: '1.6 m',
    weight: '85.5 kg',
    stats: { hp: 79, attack: 83, defense: 100, spAtk: 85, spDef: 105, speed: 78 },
    description: 'The rocket cannons on its shell fire jets of water capable of punching holes through thick sheet steel.',
    abilities: ['Torrent', 'Rain Dish (Hidden)'],
    signatureMoves: [
      { name: 'Hydro Cannon', type: 'Water', power: 150, accuracy: 90 },
      { name: 'Flash Cannon', type: 'Normal', power: 80, accuracy: 100 },
      { name: 'Skull Bash', type: 'Normal', power: 130, accuracy: 100 }
    ],
    evolutionFamily: 'squirtle',
    evolutionStage: 2,
    evolutionRequirement: 'Level 36',
    modelKey: 'blastoise'
  },

  // --- PIKACHU LINE ---
  {
    id: '0172',
    name: 'Pichu',
    japaneseName: 'ピチュー (Pichu)',
    genus: 'Tiny Mouse Pokémon',
    types: ['Electric'],
    primaryColor: '#facc15',
    accentColor: '#f43f5e',
    glowColor: '#fde047',
    height: '0.3 m',
    weight: '2.0 kg',
    stats: { hp: 20, attack: 40, defense: 15, spAtk: 35, spDef: 35, speed: 60 },
    description: 'It is not yet skilled at storing electricity. It may send out a jolt if amused or startled.',
    abilities: ['Static', 'Lightning Rod (Hidden)'],
    signatureMoves: [
      { name: 'Thunder Shock', type: 'Electric', power: 40, accuracy: 100 },
      { name: 'Charm', type: 'Normal', power: 0, accuracy: 100 },
      { name: 'Nuzzle', type: 'Electric', power: 20, accuracy: 100 }
    ],
    evolutionFamily: 'pikachu',
    evolutionStage: 0,
    evolutionRequirement: 'Baby Form',
    modelKey: 'pichu'
  },
  {
    id: '0025',
    name: 'Pikachu',
    japaneseName: 'ピカチュウ (Pikachu)',
    genus: 'Mouse Pokémon',
    types: ['Electric'],
    primaryColor: '#eab308',
    accentColor: '#ef4444',
    glowColor: '#facc15',
    height: '0.4 m',
    weight: '6.0 kg',
    stats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
    description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
    abilities: ['Static', 'Lightning Rod (Hidden)'],
    signatureMoves: [
      { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100 },
      { name: 'Volt Tackle', type: 'Electric', power: 120, accuracy: 100 },
      { name: 'Iron Tail', type: 'Normal', power: 100, accuracy: 75 }
    ],
    evolutionFamily: 'pikachu',
    evolutionStage: 1,
    evolutionRequirement: 'High Friendship',
    modelKey: 'pikachu'
  },
  {
    id: '0026',
    name: 'Raichu',
    japaneseName: 'ライチュウ (Raichu)',
    genus: 'Mouse Pokémon',
    types: ['Electric'],
    primaryColor: '#d97706',
    accentColor: '#fef08a',
    glowColor: '#f59e0b',
    height: '0.8 m',
    weight: '30.0 kg',
    stats: { hp: 60, attack: 90, defense: 55, spAtk: 90, spDef: 80, speed: 110 },
    description: 'Its long tail serves as a ground to protect itself from its own high voltage power discharges.',
    abilities: ['Static', 'Lightning Rod (Hidden)'],
    signatureMoves: [
      { name: 'Thunder', type: 'Electric', power: 110, accuracy: 70 },
      { name: 'Focus Blast', type: 'Normal', power: 120, accuracy: 70 },
      { name: 'Electro Ball', type: 'Electric', power: 80, accuracy: 100 }
    ],
    evolutionFamily: 'pikachu',
    evolutionStage: 2,
    evolutionRequirement: 'Thunder Stone',
    modelKey: 'raichu'
  },

  // --- GASTLY LINE ---
  {
    id: '0092',
    name: 'Gastly',
    japaneseName: 'ゴース (Ghos)',
    genus: 'Gas Pokémon',
    types: ['Ghost', 'Poison'],
    primaryColor: '#6b21a8',
    accentColor: '#c084fc',
    glowColor: '#a855f7',
    height: '1.3 m',
    weight: '0.1 kg',
    stats: { hp: 30, attack: 35, defense: 30, spAtk: 100, spDef: 35, speed: 80 },
    description: 'Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.',
    abilities: ['Levitate'],
    signatureMoves: [
      { name: 'Lick', type: 'Ghost', power: 30, accuracy: 100 },
      { name: 'Night Shade', type: 'Ghost', power: 50, accuracy: 100 },
      { name: 'Confuse Ray', type: 'Ghost', power: 0, accuracy: 100 }
    ],
    evolutionFamily: 'gastly',
    evolutionStage: 0,
    evolutionRequirement: 'Base Form',
    modelKey: 'gastly'
  },
  {
    id: '0093',
    name: 'Haunter',
    japaneseName: 'ゴースト (Ghost)',
    genus: 'Gas Pokémon',
    types: ['Ghost', 'Poison'],
    primaryColor: '#581c87',
    accentColor: '#d8b4fe',
    glowColor: '#9333ea',
    height: '1.6 m',
    weight: '0.1 kg',
    stats: { hp: 45, attack: 50, defense: 45, spAtk: 115, spDef: 55, speed: 95 },
    description: 'Because of its ability to slip through block walls, it is said to be from another dimension.',
    abilities: ['Levitate'],
    signatureMoves: [
      { name: 'Shadow Claw', type: 'Ghost', power: 70, accuracy: 100 },
      { name: 'Hypnosis', type: 'Ghost', power: 0, accuracy: 60 },
      { name: 'Dream Eater', type: 'Ghost', power: 100, accuracy: 100 }
    ],
    evolutionFamily: 'gastly',
    evolutionStage: 1,
    evolutionRequirement: 'Level 25',
    modelKey: 'haunter'
  },
  {
    id: '0094',
    name: 'Gengar',
    japaneseName: 'ゲンガー (Gangar)',
    genus: 'Shadow Pokémon',
    types: ['Ghost', 'Poison'],
    primaryColor: '#3b0764',
    accentColor: '#dc2626',
    glowColor: '#7e22ce',
    height: '1.5 m',
    weight: '40.5 kg',
    stats: { hp: 60, attack: 65, defense: 60, spAtk: 130, spDef: 75, speed: 110 },
    description: 'Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright.',
    abilities: ['Cursed Body'],
    signatureMoves: [
      { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100 },
      { name: 'Dark Pulse', type: 'Ghost', power: 80, accuracy: 100 },
      { name: 'Hex', type: 'Ghost', power: 65, accuracy: 100 }
    ],
    evolutionFamily: 'gastly',
    evolutionStage: 2,
    evolutionRequirement: 'Trade Link',
    modelKey: 'gengar'
  },

  // --- EEVEE LINE (BRANCHING) ---
  {
    id: '0133',
    name: 'Eevee',
    japaneseName: 'イーブイ (Eievui)',
    genus: 'Evolution Pokémon',
    types: ['Normal'],
    primaryColor: '#9a3412',
    accentColor: '#fef3c7',
    glowColor: '#ca8a04',
    height: '0.3 m',
    weight: '6.5 kg',
    stats: { hp: 55, attack: 55, defense: 50, spAtk: 45, spDef: 65, speed: 55 },
    description: 'Its irregular genetic code allows it to alter its form drastically depending on its environment.',
    abilities: ['Run Away', 'Adaptability', 'Anticipation (Hidden)'],
    signatureMoves: [
      { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100 },
      { name: 'Bite', type: 'Normal', power: 60, accuracy: 100 },
      { name: 'Last Resort', type: 'Normal', power: 140, accuracy: 100 }
    ],
    evolutionFamily: 'eevee',
    evolutionStage: 0,
    evolutionRequirement: 'Base Form',
    modelKey: 'eevee'
  },
  {
    id: '0134',
    name: 'Vaporeon',
    japaneseName: 'シャワーズ (Showers)',
    genus: 'Bubble Jet Pokémon',
    types: ['Water'],
    primaryColor: '#0284c7',
    accentColor: '#bae6fd',
    glowColor: '#38bdf8',
    height: '1.0 m',
    weight: '29.0 kg',
    stats: { hp: 130, attack: 65, defense: 60, spAtk: 110, spDef: 95, speed: 65 },
    description: 'Its cell structure is similar to water molecules. It will melt away and become invisible in water.',
    abilities: ['Water Absorb', 'Hydration (Hidden)'],
    signatureMoves: [
      { name: 'Hydro Pump', type: 'Water', power: 110, accuracy: 80 },
      { name: 'Acid Armor', type: 'Poison', power: 0, accuracy: 100 },
      { name: 'Aurora Beam', type: 'Water', power: 65, accuracy: 100 }
    ],
    evolutionFamily: 'eevee',
    evolutionStage: 1,
    evolutionRequirement: 'Water Stone',
    modelKey: 'vaporeon'
  },
  {
    id: '0135',
    name: 'Jolteon',
    japaneseName: 'サンダース (Thunders)',
    genus: 'Lightning Pokémon',
    types: ['Electric'],
    primaryColor: '#ca8a04',
    accentColor: '#ffffff',
    glowColor: '#facc15',
    height: '0.8 m',
    weight: '24.5 kg',
    stats: { hp: 65, attack: 65, defense: 60, spAtk: 110, spDef: 95, speed: 130 },
    description: 'It accumulates negative ions in the atmosphere to blast out 10,000-volt lightning bolts.',
    abilities: ['Volt Absorb', 'Quick Feet (Hidden)'],
    signatureMoves: [
      { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100 },
      { name: 'Pin Missile', type: 'Normal', power: 25, accuracy: 95 },
      { name: 'Thunder', type: 'Electric', power: 110, accuracy: 70 }
    ],
    evolutionFamily: 'eevee',
    evolutionStage: 1,
    evolutionRequirement: 'Thunder Stone',
    modelKey: 'jolteon'
  },
  {
    id: '0136',
    name: 'Flareon',
    japaneseName: 'ブースター (Booster)',
    genus: 'Flame Pokémon',
    types: ['Fire'],
    primaryColor: '#c2410c',
    accentColor: '#fef08a',
    glowColor: '#f97316',
    height: '0.9 m',
    weight: '25.0 kg',
    stats: { hp: 65, attack: 130, defense: 60, spAtk: 95, spDef: 110, speed: 65 },
    description: 'When storing thermal energy in its body, its internal temperature can reach 1,650 degrees Fahrenheit.',
    abilities: ['Flash Fire', 'Guts (Hidden)'],
    signatureMoves: [
      { name: 'Flare Blitz', type: 'Fire', power: 120, accuracy: 100 },
      { name: 'Fire Fang', type: 'Fire', power: 65, accuracy: 95 },
      { name: 'Lava Plume', type: 'Fire', power: 80, accuracy: 100 }
    ],
    evolutionFamily: 'eevee',
    evolutionStage: 1,
    evolutionRequirement: 'Fire Stone',
    modelKey: 'flareon'
  }
];

export const EVOLUTION_FAMILIES = {
  pikachu: {
    name: 'Pikachu Line',
    isBranching: false,
    nodes: [
      { id: '0172', name: 'Pichu', stage: 0, requirement: 'Baby' },
      { id: '0025', name: 'Pikachu', stage: 1, requirement: 'High Friendship' },
      { id: '0026', name: 'Raichu', stage: 2, requirement: 'Thunder Stone' }
    ],
    links: [
      { source: '0172', target: '0025', label: 'Friendship' },
      { source: '0025', target: '0026', label: 'Thunder Stone' }
    ]
  },
  charmander: {
    name: 'Charmander Line',
    isBranching: false,
    nodes: [
      { id: '0004', name: 'Charmander', stage: 0, requirement: 'Base' },
      { id: '0005', name: 'Charmeleon', stage: 1, requirement: 'Level 16' },
      { id: '0006', name: 'Charizard', stage: 2, requirement: 'Level 36' }
    ],
    links: [
      { source: '0004', target: '0005', label: 'Level 16' },
      { source: '0005', target: '0006', label: 'Level 36' }
    ]
  },
  bulbasaur: {
    name: 'Bulbasaur Line',
    isBranching: false,
    nodes: [
      { id: '0001', name: 'Bulbasaur', stage: 0, requirement: 'Base' },
      { id: '0002', name: 'Ivysaur', stage: 1, requirement: 'Level 16' },
      { id: '0003', name: 'Venusaur', stage: 2, requirement: 'Level 32' }
    ],
    links: [
      { source: '0001', target: '0002', label: 'Level 16' },
      { source: '0002', target: '0003', label: 'Level 32' }
    ]
  },
  squirtle: {
    name: 'Squirtle Line',
    isBranching: false,
    nodes: [
      { id: '0007', name: 'Squirtle', stage: 0, requirement: 'Base' },
      { id: '0008', name: 'Wartortle', stage: 1, requirement: 'Level 16' },
      { id: '0009', name: 'Blastoise', stage: 2, requirement: 'Level 36' }
    ],
    links: [
      { source: '0007', target: '0008', label: 'Level 16' },
      { source: '0008', target: '0009', label: 'Level 36' }
    ]
  },
  gastly: {
    name: 'Gastly Line',
    isBranching: false,
    nodes: [
      { id: '0092', name: 'Gastly', stage: 0, requirement: 'Base' },
      { id: '0093', name: 'Haunter', stage: 1, requirement: 'Level 25' },
      { id: '0094', name: 'Gengar', stage: 2, requirement: 'Trade Link' }
    ],
    links: [
      { source: '0092', target: '0093', label: 'Level 25' },
      { source: '0093', target: '0094', label: 'Trade Cable' }
    ]
  },
  eevee: {
    name: 'Eevee Line',
    isBranching: true,
    nodes: [
      { id: '0133', name: 'Eevee', stage: 0, requirement: 'Base' },
      { id: '0134', name: 'Vaporeon', stage: 1, requirement: 'Water Stone' },
      { id: '0135', name: 'Jolteon', stage: 1, requirement: 'Thunder Stone' },
      { id: '0136', name: 'Flareon', stage: 1, requirement: 'Fire Stone' }
    ],
    links: [
      { source: '0133', target: '0134', label: 'Water Stone' },
      { source: '0133', target: '0135', label: 'Thunder Stone' },
      { source: '0133', target: '0136', label: 'Fire Stone' }
    ]
  }
};
