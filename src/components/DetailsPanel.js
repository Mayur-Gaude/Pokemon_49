import { TYPE_COLORS } from '../data/pokemonData.js';

export class DetailsPanel {
  constructor(container) {
    this.container = container;
  }

  update(pokemon) {
    const stats = pokemon.stats;
    const bst = Object.values(stats).reduce((a, b) => a + b, 0);

    const statLabels = [
      { key: 'hp', label: 'HP', max: 160, color: 'from-emerald-500 to-green-400' },
      { key: 'attack', label: 'ATTACK', max: 160, color: 'from-amber-500 to-orange-400' },
      { key: 'defense', label: 'DEFENSE', max: 160, color: 'from-blue-500 to-cyan-400' },
      { key: 'spAtk', label: 'SP. ATK', max: 160, color: 'from-purple-500 to-pink-400' },
      { key: 'spDef', label: 'SP. DEF', max: 160, color: 'from-indigo-500 to-sky-400' },
      { key: 'speed', label: 'SPEED', max: 160, color: 'from-rose-500 to-red-400' }
    ];

    this.container.innerHTML = `
      <div class="space-y-4 select-none">
        <!-- Base Stats Breakdown Panel -->
        <div class="p-4 glass-panel rounded-2xl border border-white/10 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">BASE TELEMETRY STATS</h2>
            </div>
            <div class="flex items-center space-x-1.5 text-xs font-mono">
              <span class="text-slate-400">TOTAL:</span>
              <span class="text-sky-300 font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">${bst}</span>
            </div>
          </div>

          <!-- Animated Stat Bars -->
          <div class="mt-4 space-y-2.5">
            ${statLabels.map(({ key, label, max, color }) => {
              const val = stats[key] || 0;
              const pct = Math.min(100, Math.round((val / max) * 100));
              return `
                <div>
                  <div class="flex items-center justify-between text-xs font-mono mb-1">
                    <span class="text-slate-400">${label}</span>
                    <span class="text-slate-200 font-bold">${val}</span>
                  </div>
                  <div class="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      class="h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out" 
                      style="width: ${pct}%"
                    ></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lore & Abilities -->
        <div class="p-4 glass-panel rounded-2xl border border-white/10 shadow-xl">
          <div class="flex items-center space-x-2 pb-2 border-b border-white/10">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">POKÉDEX LORE & MOVES</h2>
          </div>

          <p class="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
            "${pokemon.description}"
          </p>

          <!-- Abilities -->
          <div class="mt-3 pt-3 border-t border-white/5">
            <span class="text-[11px] font-mono text-slate-400 block mb-1.5">SPECIAL ABILITIES:</span>
            <div class="flex flex-wrap gap-1.5">
              ${pokemon.abilities.map(a => `
                <span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-sky-300 border border-slate-700">
                  ${a}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Signature Moves -->
          <div class="mt-3 pt-3 border-t border-white/5">
            <span class="text-[11px] font-mono text-slate-400 block mb-1.5">SIGNATURE COMBAT MOVES:</span>
            <div class="space-y-1.5">
              ${pokemon.signatureMoves.map(m => {
                const typeStyle = TYPE_COLORS[m.type]?.badge || 'bg-slate-700 text-slate-200';
                return `
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs font-mono">
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 rounded text-[10px] border ${typeStyle}">${m.type}</span>
                      <span class="text-slate-200 font-semibold">${m.name}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-slate-400 text-[11px]">
                      <span>PWR: ${m.power || '--'}</span>
                      <span>ACC: ${m.accuracy}%</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
