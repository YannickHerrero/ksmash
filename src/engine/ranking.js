// ELO-based ranking system for K-pop group comparison

const K_FACTOR = 32;
const DEFAULT_RATING = 1500;

export function createRankings(groups) {
  const ratings = {};
  const matchups = {};
  const appearances = {};

  for (const group of groups) {
    ratings[group.id] = DEFAULT_RATING;
    matchups[group.id] = new Set();
    appearances[group.id] = 0;
  }

  return { ratings, matchups, appearances, totalComparisons: 0 };
}

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function recordChoice(state, winnerId, loserId) {
  const { ratings, matchups, appearances } = state;

  const expectedA = expectedScore(ratings[winnerId], ratings[loserId]);
  const expectedB = 1 - expectedA;

  ratings[winnerId] += K_FACTOR * (1 - expectedA);
  ratings[loserId] += K_FACTOR * (0 - expectedB);

  matchups[winnerId].add(loserId);
  matchups[loserId].add(winnerId);

  appearances[winnerId]++;
  appearances[loserId]++;

  return { ...state, totalComparisons: state.totalComparisons + 1 };
}

export function getNextMatchup(state, groups) {
  const { ratings, matchups, appearances } = state;

  // Find the minimum appearance count
  const minAppearances = Math.min(...groups.map((g) => appearances[g.id]));

  // Groups that have been seen the least
  const underExposed = groups.filter((g) => appearances[g.id] === minAppearances);

  // Always pick at least one group from the least-seen pool
  const firstPick = underExposed[Math.floor(Math.random() * underExposed.length)];

  // For the opponent, build candidates and score them
  const candidates = groups.filter((g) => g.id !== firstPick.id);

  const scored = candidates.map((g) => {
    const ratingDiff = Math.abs(ratings[firstPick.id] - ratings[g.id]);
    const closeness = 1 / (1 + ratingDiff);
    const unseenBonus = matchups[firstPick.id].has(g.id) ? 0 : 2;
    const exposureBonus = 1 / (1 + appearances[g.id]);
    // Combined score: favor unseen pairs, under-exposed groups, then closeness
    const score = unseenBonus + exposureBonus + closeness * 0.5;
    return { group: g, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick from top candidates with some randomness
  const topN = Math.min(5, scored.length);
  const secondPick = scored[Math.floor(Math.random() * topN)].group;

  // Randomly swap sides
  if (Math.random() > 0.5) {
    return { groupA: firstPick, groupB: secondPick };
  }
  return { groupA: secondPick, groupB: firstPick };
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
