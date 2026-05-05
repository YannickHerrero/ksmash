// Glicko-inspired ranking system for K-pop group comparison
//
// Each group has:
//   rating (mu)      — estimated strength, starts at 1500
//   rd (deviation)   — uncertainty, starts high (350) and shrinks with each appearance
//   opponentRatingSum — for opponent-strength balancing

const DEFAULT_RATING = 1500;
const DEFAULT_RD = 350; // high uncertainty at start
const MIN_RD = 50;      // floor so ratings always stay somewhat flexible

// --- Glicko math helpers ---

const Q = Math.log(10) / 400; // ~0.00575

function g(rd) {
  return 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / (Math.PI * Math.PI));
}

function expectedScore(myRating, oppRating, oppRd) {
  return 1 / (1 + Math.pow(10, -g(oppRd) * (myRating - oppRating) / 400));
}

// --- State management ---

export function createRankings(groups) {
  const ratings = {};
  const rd = {};
  const matchups = {};
  const appearances = {};
  const opponentRatingSum = {};

  for (const group of groups) {
    ratings[group.id] = DEFAULT_RATING;
    rd[group.id] = DEFAULT_RD;
    matchups[group.id] = new Set();
    appearances[group.id] = 0;
    opponentRatingSum[group.id] = 0;
  }

  return { ratings, rd, matchups, appearances, opponentRatingSum, totalComparisons: 0 };
}

export function recordChoice(state, winnerId, loserId) {
  const { ratings, rd, matchups, appearances, opponentRatingSum } = state;

  // Record opponent ratings before updating
  opponentRatingSum[winnerId] += ratings[loserId];
  opponentRatingSum[loserId] += ratings[winnerId];

  // --- Update winner ---
  const gL = g(rd[loserId]);
  const eW = expectedScore(ratings[winnerId], ratings[loserId], rd[loserId]);
  const dSqW = 1 / (Q * Q * gL * gL * eW * (1 - eW));
  const newRdW = Math.max(MIN_RD, Math.sqrt(1 / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)));
  ratings[winnerId] += (Q / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)) * gL * (1 - eW);
  rd[winnerId] = newRdW;

  // --- Update loser ---
  const gW = g(rd[winnerId]);
  const eL = expectedScore(ratings[loserId], ratings[winnerId], rd[winnerId]);
  const dSqL = 1 / (Q * Q * gW * gW * eL * (1 - eL));
  const newRdL = Math.max(MIN_RD, Math.sqrt(1 / (1 / (rd[loserId] * rd[loserId]) + 1 / dSqL)));
  ratings[loserId] += (Q / (1 / (rd[loserId] * rd[loserId]) + 1 / dSqL)) * gW * (0 - eL);
  rd[loserId] = newRdL;

  matchups[winnerId].add(loserId);
  matchups[loserId].add(winnerId);

  appearances[winnerId]++;
  appearances[loserId]++;

  return { ...state, totalComparisons: state.totalComparisons + 1 };
}

// --- Matchup selection ---

// How much information a matchup would give us (higher = more useful)
// Maximized when: both groups are uncertain AND the outcome is hard to predict
function informationGain(state, aId, bId) {
  const { ratings, rd } = state;
  const e = expectedScore(ratings[aId], ratings[bId], rd[bId]);
  // Entropy: highest when e ≈ 0.5 (we don't know who the user will pick)
  const entropy = -(e * Math.log2(e + 1e-10) + (1 - e) * Math.log2(1 - e + 1e-10));
  // Uncertainty: how much both groups still need data
  const uncertainty = rd[aId] + rd[bId];
  return entropy * uncertainty;
}

function medianRating(state, groups) {
  const sorted = groups.map((g) => state.ratings[g.id]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function avgOpponentRating(state, groupId) {
  if (state.appearances[groupId] === 0) return DEFAULT_RATING;
  return state.opponentRatingSum[groupId] / state.appearances[groupId];
}

// Discovery: maximize information gain while keeping exposure fair
function discoveryMatchup(state, groups) {
  const { matchups, appearances, rd } = state;

  // Pick the first group: prioritize high uncertainty, then low appearances
  const maxRd = Math.max(...groups.map((g) => rd[g.id]));
  const minApp = Math.min(...groups.map((g) => appearances[g.id]));

  // Pool: groups with the fewest appearances OR very high uncertainty
  const pool = groups.filter(
    (g) => appearances[g.id] === minApp || rd[g.id] > maxRd * 0.8
  );
  const firstPick = pool[Math.floor(Math.random() * pool.length)];

  // Score all opponents
  const candidates = groups.filter((g) => g.id !== firstPick.id);
  const median = medianRating(state, groups);
  const firstAvgOpp = avgOpponentRating(state, firstPick.id);

  const scored = candidates.map((g) => {
    const infoGain = informationGain(state, firstPick.id, g.id);
    const unseenBonus = matchups[firstPick.id].has(g.id) ? 0 : 2;
    const randomness = Math.random() * 0.3;

    // Opponent-strength balancing
    let balanceBonus = 0;
    if (appearances[firstPick.id] > 0) {
      const oppRating = state.ratings[g.id];
      if (firstAvgOpp > median && oppRating < median) balanceBonus = 1;
      if (firstAvgOpp < median && oppRating >= median) balanceBonus = 1;
    }

    // Info gain is the primary driver now
    const score = infoGain * 0.01 + unseenBonus + balanceBonus + randomness;
    return { group: g, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topN = Math.min(5, scored.length);
  const secondPick = scored[Math.floor(Math.random() * topN)].group;

  return { groupA: firstPick, groupB: secondPick };
}

// Bracket: refine the top of the leaderboard
function bracketMatchup(state, groups) {
  const { ratings, rd } = state;
  const sorted = [...groups].sort((a, b) => ratings[b.id] - ratings[a.id]);
  const topPool = sorted.slice(0, Math.min(15, sorted.length));

  // Among the top, pick the pair with the highest information gain
  let bestPair = null;
  let bestGain = -1;

  for (let i = 0; i < topPool.length; i++) {
    for (let j = i + 1; j < topPool.length; j++) {
      const gain = informationGain(state, topPool[i].id, topPool[j].id);
      // Add randomness to avoid always the same pair
      const score = gain + Math.random() * gain * 0.3;
      if (score > bestGain) {
        bestGain = score;
        bestPair = { groupA: topPool[i], groupB: topPool[j] };
      }
    }
  }

  return bestPair;
}

// --- Phase logic ---
// Phase 1 (rounds 1-59):  discovery only — broad exploration
// Phase 2 (rounds 60-89): mix of discovery (60%) and bracket (40%)
// Phase 3 (rounds 90+):   bracket-heavy (60%) with some discovery (40%)

const PHASE2_START = 60;
const PHASE3_START = 90;

export function getNextMatchup(state, groups) {
  let pick;
  const round = state.totalComparisons;

  if (round < PHASE2_START) {
    pick = discoveryMatchup(state, groups);
  } else if (round < PHASE3_START) {
    pick = Math.random() < 0.4
      ? bracketMatchup(state, groups)
      : discoveryMatchup(state, groups);
  } else {
    pick = Math.random() < 0.6
      ? bracketMatchup(state, groups)
      : discoveryMatchup(state, groups);
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
