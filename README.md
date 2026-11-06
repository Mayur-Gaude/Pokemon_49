# ⚡ Pokédex 3D • Top Navigation & Card Grid Engine

A hyper-premium, interactive Pokédex application featuring a **Top Navigation Bar**, a **Dedicated Generation & Type Matrix (Zero Horizontal Scrolling)**, a **Responsive Pokémon Cards Grid** across all 9 generations (Kanto to Paldea), an in-depth **Detailed Inspection View** with official high-resolution artwork, all-generations sprite history, and an interactive **Realistic 3D WebGL Model Viewport**, with complete support for **Dark & Light Mode**.

---

## 🌟 UI Layout & Features

### 1. Top Navigation Bar & Selection Matrix (`TopNavbar.js`)
- **Branding & Unit Counter**: Displays total specimens indexed in the active region.
- **Real-Time Search Bar**: Instant live filtering by Pokémon name or national Pokédex index `#ID` (e.g. `Pikachu`, `25`, `Char`).
- **Dedicated Generation Section (No Horizontal Sliders)**:
  - Complete 9-button grid visible at once (3 columns on mobile, 9 columns on desktop):
    - **Gen I** (Kanto #1 - #151)
    - **Gen II** (Johto #152 - #251)
    - **Gen III** (Hoenn #252 - #386)
    - **Gen IV** (Sinnoh #387 - #493)
    - **Gen V** (Unova #494 - #649)
    - **Gen VI** (Kalos #650 - #721)
    - **Gen VII** (Alola #722 - #809)
    - **Gen VIII** (Galar #810 - #905)
    - **Gen IX** (Paldea #906 - #1025)
- **Dedicated Type Filter Section (Flex-Wrap, No Horizontal Sliders)**:
  - Clean flex-wrap row with all 18 elemental types (ALL, Fire, Water, Grass, Electric, Ghost, Normal, Poison, Flying, Bug, Psychic, Rock, Ground, Fighting, Dragon, Ice, Steel, Fairy).
  - **High-Contrast Theme-Adaptive Styling (No Violet)**:
    - In Light Mode: Selected category is rendered in rich, deep sky blue (`#0284c7`) with 100% crisp, pure white bold text (`#ffffff`) for maximum readability.
    - In Dark Mode: Glowing cyan/sky blue badge with bold text.
- **Dark & Light Mode Toggle**: One-click toggle between cybernetic Dark Mode (`🌙 DARK`) and clean studio Light Mode (`☀️ LIGHT`), with automatic `localStorage` persistence and dynamic 3D scene lighting/fog adaptation.
- **Audio Synthesizer Toggle**: Mute or enable Web Audio API sound effects.

### 2. Main Pokémon Cards Grid (`PokemonCardGrid.js`)
- **Responsive Layout**: 2 columns on mobile, 3 on tablet, 4 on desktop, 5-6 on widescreen.
- **Rich Card Visuals**:
  - Official high-definition PokéAPI artwork thumbnail.
  - Formatted national Pokédex index `#0025`.
  - Pokémon name with glowing hover transition.
  - Glowing **`3D`** indicator badge if an interactive 3D model is available.
  - Generation tag.
  - Hover elevation, zoom, and cybernetic border glow.
- **Click to Inspect**: Clicking any card immediately opens the comprehensive detailed inspection view!

### 3. Detailed Inspection View (`DetailModal.js`)
- **Header**: National ID, Pokémon name, Japanese Kanji/Katakana name, species category ("Mouse Pokémon"), Height, Weight, Era/Generation, Type badges, Next/Previous Pokémon buttons, and Close (`ESC`).
- **Visualizer Stage**:
  - `[ 🖼️ SPRITES & ARTWORK ]`: Official Sugimori Artwork, 3D Pokémon HOME CGI Render, Animated Showdown GIF, with Shiny Variant Toggle! Unobstructed, high-clearance image framing with low-profile bottom mode selector.
  - `[ 🌐 3D MODEL ]`: Realistic Three.js WebGL canvas with OrbitControls, PBR physical materials (`MeshPhysicalMaterial`), clearcoat, soft shadows, lighting presets, wireframe mode, and idle animations.
- **Synchronized Evolution Tree (`EvolutionTree.js`)**:
  - Live PokéAPI artwork thumbnails with evolution triggers (Level 16, Thunder Stone, Friendship, Trade).
  - **Light Mode Fixed**: Selected active node has a clean soft sky-blue card (`#e0f2fe`) with high-contrast, bold navy text (`#0c4a6e`) and blue `#ID` (`#0284c7`), fully visible and perfectly matching the light theme.
  - Clicking any evolution stage seamlessly morphs the detailed view to that Pokémon!
- **All-Generations Historical Sprite Archive (`GenerationSpriteArchive.js`)**:
  - Interactive timeline showing how that Pokémon looked from Gen 1 (1996) through Gen 9 (2022) with game titles, console hardware, and historical notes.
- **Base Telemetry Stats & Moves (`DetailsPanel.js`)**:
  - Animated progress bars for HP, Attack, Defense, Sp. Atk, Sp. Def, Speed and total BST.
  - Official Pokédex lore entry text.
  - Special Abilities and signature combat moves table.

---

## 🚀 Running the Project

In the terminal inside `Demo_Project`:

```powershell
cd Demo_Project
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

To build and preview production:
```powershell
npm run build
npm run preview
```
