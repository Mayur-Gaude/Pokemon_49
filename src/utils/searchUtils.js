/**
 * Search Utilities: Levenshtein Distance, Fuzzy Matching & Typo Tolerance
 */

export function levenshtein(a = '', b = '') {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,     // deletion
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i - 1] + 1  // substitution
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Fuzzy matches a search query against a Pokémon's name and ID.
 * Supports:
 * - Direct ID matches ('25', '025', '#0025')
 * - Exact and prefix matches ('char', 'pika')
 * - Substring matches ('saur', 'chu')
 * - Subsequence matches ('chrzd' -> 'charizard')
 * - Typo tolerance via Levenshtein edit distance ('charzard', 'pikachuu', 'bulbsaur', 'gengr')
 */
export function fuzzyMatchPokemon(query = '', name = '', numId = 0) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { match: true, score: 0, isFuzzy: false };
  }

  // 1. Pokédex ID Matching
  const cleanQ = q.replace(/^#/, '').trim();
  const numIdStr = String(numId);
  const formattedId = String(numId).padStart(4, '0');

  if (/^\d+$/.test(cleanQ)) {
    if (numIdStr === cleanQ || formattedId === cleanQ) {
      return { match: true, score: 100, isFuzzy: false, isIdMatch: true };
    }
    if (numIdStr.startsWith(cleanQ) || formattedId.includes(cleanQ)) {
      return { match: true, score: 85, isFuzzy: false, isIdMatch: true };
    }
  }

  const t = name.toLowerCase().trim();

  // 2. Exact Match
  if (t === q) {
    return { match: true, score: 100, isFuzzy: false };
  }

  // 3. Prefix Match
  if (t.startsWith(q)) {
    return { match: true, score: 90 - (t.length - q.length), isFuzzy: false };
  }

  // 4. Substring Match
  if (t.includes(q)) {
    return { match: true, score: 75 - (t.indexOf(q)), isFuzzy: false };
  }

  // 5. Fuzzy Subsequence (all letters in order)
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length && q.length >= 3) {
    return { match: true, score: 60, isFuzzy: true, reason: 'Abbreviation match' };
  }

  // 6. Typo Tolerance via Levenshtein Distance
  // Allow edit distance of 1 for 4-5 letter queries, 2 for 6+ letter queries
  if (q.length >= 4) {
    const maxAllowedDist = q.length <= 5 ? 1 : 2;
    const dist = levenshtein(q, t);

    if (dist <= maxAllowedDist) {
      return { 
        match: true, 
        score: 55 - dist * 10, 
        isFuzzy: true, 
        reason: `Typo matched (${dist} edit)` 
      };
    }

    // Check if query is close to any substring of target
    if (t.length > q.length) {
      for (let i = 0; i <= t.length - q.length; i++) {
        const sub = t.substring(i, i + q.length);
        const subDist = levenshtein(q, sub);
        if (subDist <= 1) {
          return { 
            match: true, 
            score: 45, 
            isFuzzy: true, 
            reason: 'Near match' 
          };
        }
      }
    }
  }

  return { match: false, score: 0, isFuzzy: false };
}
