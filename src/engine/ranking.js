// ELO-based ranking system for K-pop group comparison

const DEFAULT_RATING = 1500;

// Adaptive K-factor: higher when a group has few appearances (early wins matter more)
function kFactor(appearances) {
  if (appearances < 3) return 80;
  if (appearances < 6) return 56;
  if (appearances < 10) return 40;
  return 32;
}

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

  const kW = kFactor(appearances[winnerId]);
  const kL = kFactor(appearances[loserId]);

  ratings[winnerId] += kW * (1 - expectedA);
  ratings[loserId] += kL * (0 - expectedB);

  matchups[winnerId].add(loserId);
  matchups[loserId].add(winnerId);

  appearances[winnerId]++;
  appearances[loserId]++;

  return { ...state, totalComparisons: state.totalComparisons + 1 };
}

function ladderMatchup(state, groups) {
  const { ratings } = state;
  // Sort by rating descending, pick from the top 10
  const sorted = [...groups].sort((a, b) => ratings[b.id] - ratings[a.id]);
  const topPool = sorted.slice(0, Math.min(10, sorted.length));

  // Pick two different groups from the top pool
  const i = Math.floor(Math.random() * topPool.length);
  let j = Math.floor(Math.random() * (topPool.length - 1));
  if (j >= i) j++;

  return { groupA: topPool[i], groupB: topPool[j] };
}

function discoveryMatchup(state, groups) {
  const { matchups, appearances } = state;

  // Find the minimum appearance count
  const minAppearances = Math.min(...groups.map((g) => appearances[g.id]));

  // Groups that have been seen the least
  const underExposed = groups.filter((g) => appearances[g.id] === minAppearances);

  // Always pick at least one group from the least-seen pool
  const firstPick = underExposed[Math.floor(Math.random() * underExposed.length)];

  // For the opponent, build candidates and score them
  const candidates = groups.filter((g) => g.id !== firstPick.id);

  const scored = candidates.map((g) => {
    const unseenBonus = matchups[firstPick.id].has(g.id) ? 0 : 3;
    const exposureBonus = 1 / (1 + appearances[g.id]);
    const randomness = Math.random() * 0.5;
    const score = unseenBonus + exposureBonus + randomness;
    return { group: g, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topN = Math.min(5, scored.length);
  const secondPick = scored[Math.floor(Math.random() * topN)].group;

  return { groupA: firstPick, groupB: secondPick };
}

// Minimum rounds before ladder matches kick in
const LADDER_THRESHOLD = 15;
// Chance of a ladder match once threshold is reached
const LADDER_CHANCE = 0.3;

export function getNextMatchup(state, groups) {
  let pick;

  // After enough rounds, occasionally pit top-ranked groups against each other
  if (state.totalComparisons >= LADDER_THRESHOLD && Math.random() < LADDER_CHANCE) {
    pick = ladderMatchup(state, groups);
  } else {
    pick = discoveryMatchup(state, groups);
  }

  // Randomly swap sides
  if (Math.random() > 0.5) {
    return { groupA: pick.groupA, groupB: pick.groupB };
  }
  return { groupA: pick.groupB, groupB: pick.groupA };
}

export function getRankings(state, groups) {
  return groups
    .map((g) => ({
      ...g,
      rating: Math.round(state.ratings[g.id]),
    }))
    .sort((a, b) => b.rating - a.rating);
}

export const RESULTS_THRESHOLD = 50;
