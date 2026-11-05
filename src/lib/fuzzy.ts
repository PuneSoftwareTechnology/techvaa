/**
 * Small typo-tolerant text matcher for site search. Built for short lists
 * (tens to a few hundred records) ranked in memory — not a search engine.
 *
 * A record matches when EVERY query word is found in one of its fields,
 * either as a substring ("fic" → "fico") or within a small edit distance
 * ("intervew" → "interview"). Matches in heavier-weighted fields (e.g. the
 * title) rank higher.
 */

export type FuzzyField = { text: string | null | undefined; weight: number };

/** Lowercase, drop accents, glue "S/4HANA" → "s4hana", split other punctuation. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\//g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

/** 0–1 strength of `token` against one normalized field. */
function tokenScore(token: string, field: string, words: string[]): number {
  if (field.includes(token)) return 1;
  if (token.length < 3) return 0;
  const allowed = token.length <= 5 ? 1 : 2;
  let best = 0;
  for (const word of words) {
    // Compare against the whole word and its same-length prefix, so a typo in
    // a half-typed word ("intervi" vs "interview") still lands.
    const d = Math.min(
      levenshtein(token, word),
      levenshtein(token, word.slice(0, token.length)),
    );
    if (d <= allowed) best = Math.max(best, 1 - d / (allowed + 1));
  }
  return best;
}

/**
 * Filters `items` to those matching `query` and orders them best-first.
 * Ties keep the input order, so pass items pre-sorted (e.g. newest first).
 */
export function fuzzyRank<T>(
  query: string,
  items: readonly T[],
  fields: (item: T) => FuzzyField[],
): T[] {
  const q = normalize(query);
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length === 0) return [...items];
  const compactQuery = q.replace(/ /g, "");

  const scored: { item: T; score: number }[] = [];
  for (const item of items) {
    const prepared = fields(item)
      .filter((f) => f.text)
      .map((f) => {
        const text = normalize(f.text!);
        return { text, words: text.split(" "), weight: f.weight };
      });

    let score = 0;
    let matchedAll = true;
    for (const token of tokens) {
      let best = 0;
      for (const f of prepared) {
        best = Math.max(best, tokenScore(token, f.text, f.words) * f.weight);
      }
      if (best === 0) {
        matchedAll = false;
        break;
      }
      score += best;
    }

    // Also accept the query typed without/with different spacing ("s4 hana").
    if (!matchedAll) {
      const hit = prepared.find((f) =>
        f.text.replace(/ /g, "").includes(compactQuery),
      );
      if (!hit) continue;
      score = hit.weight * tokens.length;
    }
    scored.push({ item, score });
  }

  return scored
    .map((s, i) => ({ ...s, i }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((s) => s.item);
}
