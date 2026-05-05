// ELO-based ranking system for K-pop group comparison

const K_FACTOR = 32;
const DEFAULT_RATING = 1500;

export function createRankings(groups) {
  const ratings = {};
  const matchups = {};

  for (const group of groups) {
    ratings[group.id] = DEFAULT_RATING;
    matchups[group.id] = new Set();
  }

  return { ratings, matchups, totalComparisons: 0 };
}

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function recordChoice(state, winnerId, loserId) {
  const { ratings, matchups } = state;

  const expectedA = expectedScore(ratings[winnerId], ratings[loserId]);
  const expectedB = 1 - expectedA;

  ratings[winnerId] += K_FACTOR * (1 - expectedA);
  ratings[loserId] += K_FACTOR * (0 - expectedB);

  matchups[winnerId].add(loserId);
  matchups[loserId].add(winnerId);

  return { ...state, totalComparisons: state.totalComparisons + 1 };
}

export function getNextMatchup(state, groups) {
  const { ratings, matchups } = state;

  // Prioritize pairs that haven't faced each other yet
  const unseenPairs = [];
  const seenPairs = [];

  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i];
      const b = groups[j];
      const ratingDiff = Math.abs(ratings[a.id] - ratings[b.id]);

      if (!matchups[a.id].has(b.id)) {
        // Prefer matchups between similarly-rated groups (more interesting)
        unseenPairs.push({ a, b, closeness: 1 / (1 + ratingDiff) });
      } else {
        seenPairs.push({ a, b, closeness: 1 / (1 + ratingDiff) });
      }
    }
  }

  const pool = unseenPairs.length > 0 ? unseenPairs : seenPairs;

  // Sort by closeness (closest ratings first) and pick from top candidates with some randomness
  pool.sort((x, y) => y.closeness - x.closeness);
  const topN = Math.min(5, pool.length);
  const pick = pool[Math.floor(Math.random() * topN)];

  // Randomly swap sides so it's not always the same order
  if (Math.random() > 0.5) {
    return { groupA: pick.a, groupB: pick.b };
  }
  return { groupA: pick.b, groupB: pick.a };
}

export function getRankings(state, groups) {
  return groups
    .map((g) => ({
      ...g,
      rating: Math.round(state.ratings[g.id]),
    }))
    .sort((a, b) => b.rating - a.rating);
}

export const FIRST_CHECKPOINT = 25;
export const CHECKPOINT_INTERVAL = 15;
