import { TYPE_COLORS, calculateTypeEffectiveness, getStatRating, ALL_POKEMON_TYPES } from '../data/pokemonData.js';

export class DetailsPanel {
  constructor(container) {
    this.container = container;
  }

  update(pokemon) {
    const stats = pokemon.stats || { hp: 50, attack: 50, defense: 50, spAtk: 50, spDef: 50, speed: 50 };
    const bst = Object.values(stats).reduce((a, b) => a + b, 0);

    // BST Tier assessment
    let bstTier = 'STANDARD';
    let bstColor = 'text-sky-300 border-sky-500/30 bg-sky-500/10';
    if (bst >= 650) {
      bstTier = 'LEGENDARY / UBER';
      bstColor = 'text-amber-300 border-amber-500/40 bg-amber-500/15 shadow-sm shadow-amber-500/20';
    } else if (bst >= 550) {
      bstTier = 'ELITE / PSEUDO';
      bstColor = 'text-purple-300 border-purple-500/40 bg-purple-500/15 shadow-sm shadow-purple-500/20';
    } else if (bst >= 480) {
      bstTier = 'COMPETITIVE';
      bstColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15';
    } else if (bst < 350) {
      bstTier = 'BASIC / EARLY';
      bstColor = 'text-slate-400 border-slate-600 bg-slate-800/40';
    }

    const statSpecs = [
      { key: 'hp', label: 'HP', max: 200 },
      { key: 'attack', label: 'ATTACK', max: 200 },
      { key: 'defense', label: 'DEFENSE', max: 200 },
      { key: 'spAtk', label: 'SP. ATK', max: 200 },
      { key: 'spDef', label: 'SP. DEF', max: 200 },
      { key: 'speed', label: 'SPEED', max: 200 }
    ];

    // Compute Type Effectiveness Matrix for current Pokémon typing
    const currentTypes = pokemon.types || ['Normal'];
    const eff = calculateTypeEffectiveness(currentTypes);

    const helperRenderTypeChips = (typeList, multiplierLabel, badgeStyle) => {
      if (!typeList || typeList.length === 0) {
        return `<span class="text-[11px] font-mono text-slate-500 italic">None</span>`;
      }
      return typeList.map(t => {
        const typeInfo = TYPE_COLORS[t] || { badge: 'bg-slate-700 text-slate-200 border-slate-600' };
        return `
          <div class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-xs font-mono font-semibold ${typeInfo.badge} shadow-sm">
            <span>${t}</span>
            <span class="px-1 py-0.1 rounded text-[10px] font-bold ${badgeStyle}">${multiplierLabel}</span>
          </div>
        `;
      }).join(' ');
    };

    this.container.innerHTML = `
      <div class="space-y-6 select-none">
        <!-- Top Row: Base Stats Visualization & Type Effectiveness Matrix -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <!-- 1. STAT VISUALIZATION (Base Stats Animated Horizontal Progress Bars) -->
          <div class="lg:col-span-6 p-4 glass-panel rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <div>
                    <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">BASE STATS VISUALIZATION</h2>
                    <span class="text-[10px] font-mono text-slate-400">Color-coded telemetry by stat strength</span>
                  </div>
                </div>
                <div class="flex items-center space-x-1.5 text-xs font-mono">
                  <span class="text-slate-400">BST:</span>
                  <span class="font-bold px-2 py-0.5 rounded border ${bstColor}">${bst}</span>
                </div>
              </div>

              <!-- Animated Color-Coded Stat Progress Bars -->
              <div class="mt-4 space-y-3">
                ${statSpecs.map(({ key, label, max }) => {
                  const val = stats[key] || 0;
                  const pct = Math.min(100, Math.max(8, Math.round((val / max) * 100)));
                  const rating = getStatRating(val);

                  return `
                    <div class="group">
                      <div class="flex items-center justify-between text-xs font-mono mb-1">
                        <div class="flex items-center space-x-2">
                          <span class="text-slate-400 w-16 font-semibold">${label}</span>
                          <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border ${rating.badge}">${rating.tier}</span>
                        </div>
                        <div class="flex items-center space-x-1.5">
                          <span class="font-bold font-mono text-sm ${rating.textColor}">${val}</span>
                          <span class="text-[10px] text-slate-500 font-normal">/ 200</span>
                        </div>
                      </div>
                      
                      <!-- Track & Animated Bar -->
                      <div class="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                        <div 
                          class="stat-progress-bar h-full rounded-full bg-gradient-to-r ${rating.barGradient} ${rating.glowShadow} transition-all duration-1000 ease-out" 
                          style="width: 0%;"
                          data-target-pct="${pct}"
                        ></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Color Coding Legend & Grade Breakdown -->
            <div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
              <span class="text-slate-400 font-semibold">STRENGTH MATRIX:</span>
              <div class="flex items-center space-x-2">
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span><span class="text-rose-400">&lt;60 Low</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="text-amber-400">60+ Avg</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-lime-400"></span><span class="text-lime-400">80+ Good</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span><span class="text-emerald-400">110+ High</span></span>
                <span class="flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-cyan-400"></span><span class="text-cyan-300">140+ Elite</span></span>
              </div>
            </div>
          </div>

          <!-- 2. WEAKNESS & RESISTANCE CHART (Type Effectiveness Matrix) -->
          <div class="lg:col-span-6 p-4 glass-panel rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <div>
                    <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">TYPE EFFECTIVENESS & BATTLE MATRIX</h2>
                    <span class="text-[10px] font-mono text-slate-400">Battle reference for incoming attack damage</span>
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  ${currentTypes.map(t => {
                    const info = TYPE_COLORS[t] || { badge: 'bg-slate-700 text-slate-200' };
                    return `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${info.badge}">${t}</span>`;
                  }).join('')}
                </div>
              </div>

              <!-- Grouped Weaknesses & Resistances -->
              <div class="mt-4 space-y-3">
                <!-- 4x Super Weakness (if any) -->
                ${eff.weaknesses4x.length > 0 ? `
                  <div class="p-2.5 rounded-xl bg-red-950/30 border border-red-500/40">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-mono font-bold text-red-400 flex items-center space-x-1.5">
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span>4× ULTRA WEAKNESS (EXTREME DAMAGE)</span>
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      ${helperRenderTypeChips(eff.weaknesses4x, '4×', 'bg-red-500 text-white font-extrabold')}
                    </div>
                  </div>
                ` : ''}

                <!-- 2x Weakness -->
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>2× WEAKNESS (SUPER EFFECTIVE)</span>
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">${eff.weaknesses2x.length} types</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${helperRenderTypeChips(eff.weaknesses2x, '2×', 'bg-amber-500/30 text-amber-200 border border-amber-500/50')}
                  </div>
                </div>

                <!-- 0x Immunities (if any) -->
                ${eff.immunities.length > 0 ? `
                  <div class="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs font-mono font-bold text-purple-300 flex items-center space-x-1.5">
                        <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span>0× IMMUNITY (NO DAMAGE TAKEN)</span>
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      ${helperRenderTypeChips(eff.immunities, '0×', 'bg-purple-500/30 text-purple-200 border border-purple-500/50 font-bold')}
                    </div>
                  </div>
                ` : ''}

                <!-- Resistances (0.25x & 0.5x) -->
                <div class="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>RESISTANCES (REDUCED DAMAGE)</span>
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">${eff.resistancesHalf.length + eff.resistancesQuarter.length} types</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    ${eff.resistancesQuarter.length > 0 ? helperRenderTypeChips(eff.resistancesQuarter, '¼×', 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 font-bold') : ''}
                    ${helperRenderTypeChips(eff.resistancesHalf, '½×', 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Full 18-Type Compact Reference Matrix -->
            <div class="mt-4 pt-3 border-t border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-mono text-slate-400 font-semibold tracking-wide">ALL 18 TYPES MATCHUP:</span>
              </div>
              <div class="grid grid-cols-6 sm:grid-cols-9 gap-1 text-center font-mono">
                ${ALL_POKEMON_TYPES.map(t => {
                  const mult = eff.multipliers[t];
                  let multText = '1×';
                  let multClass = 'bg-slate-900/70 text-slate-400 border-white/5';
                  if (mult === 4) {
                    multText = '4×';
                    multClass = 'bg-red-500/30 text-red-300 border-red-500/60 font-bold';
                  } else if (mult === 2) {
                    multText = '2×';
                    multClass = 'bg-amber-500/25 text-amber-300 border-amber-500/50 font-bold';
                  } else if (mult === 0.5) {
                    multText = '½×';
                    multClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                  } else if (mult === 0.25) {
                    multText = '¼×';
                    multClass = 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 font-bold';
                  } else if (mult === 0) {
                    multText = '0×';
                    multClass = 'bg-purple-500/25 text-purple-300 border-purple-500/50 font-bold';
                  }

                  const shortName = t.slice(0, 3).toUpperCase();
                  return `
                    <div class="p-1 rounded-lg border ${multClass} flex flex-col items-center justify-center transition-transform hover:scale-105" title="${t}: ${multText}">
                      <span class="text-[9px] text-slate-300">${shortName}</span>
                      <span class="text-[10px] font-bold">${multText}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Lore & Signature Combat Moves -->
        <div class="p-4 glass-panel rounded-2xl border border-white/10 shadow-xl">
          <div class="flex items-center space-x-2 pb-2 border-b border-white/10">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h2 class="font-tech text-sm font-bold tracking-wider text-slate-100">POKÉDEX LORE & MOVES</h2>
          </div>

          <p class="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
            "${pokemon.description || 'A remarkable specimen documented in the regional Pokédex archive.'}"
          </p>

          <!-- Abilities -->
          <div class="mt-3 pt-3 border-t border-white/5">
            <span class="text-[11px] font-mono text-slate-400 block mb-1.5 font-semibold">SPECIAL ABILITIES:</span>
            <div class="flex flex-wrap gap-1.5">
              ${(pokemon.abilities || []).map(a => `
                <span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-sky-300 border border-slate-700">
                  ${a}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Signature Moves -->
          <div class="mt-3 pt-3 border-t border-white/5">
            <span class="text-[11px] font-mono text-slate-400 block mb-1.5 font-semibold">SIGNATURE COMBAT MOVES:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${(pokemon.signatureMoves || []).map(m => {
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

    // Trigger smooth horizontal animation for all stat progress bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        const bars = this.container.querySelectorAll('.stat-progress-bar');
        bars.forEach(bar => {
          if (bar.dataset.targetPct) {
            bar.style.width = bar.dataset.targetPct + '%';
          }
        });
      }, 50);
    });
  }
}
