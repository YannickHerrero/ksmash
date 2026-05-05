// Song-level Glicko ranking that aggregates to artist rankings
// Reuses the same Glicko math as the group ranking engine

const DEFAULT_RATING = 1500;
const DEFAULT_RD = 350;
const MIN_RD = 50;

const Q = Math.log(10) / 400;

function g(rd) {
  return 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / (Math.PI * Math.PI));
}

function expectedScore(myRating, oppRating, oppRd) {
  return 1 / (1 + Math.pow(10, -g(oppRd) * (myRating - oppRating) / 400));
}

export function createSongRankings(songs) {
  const ratings = {};
  const rd = {};
  const matchups = {};
  const appearances = {};
  const opponentRatingSum = {};

  for (const song of songs) {
    ratings[song.id] = DEFAULT_RATING;
    rd[song.id] = DEFAULT_RD;
    matchups[song.id] = new Set();
    appearances[song.id] = 0;
    opponentRatingSum[song.id] = 0;
  }

  return { ratings, rd, matchups, appearances, opponentRatingSum, skippedSongs: new Set(), totalComparisons: 0 };
}

export function skipSongs(state, songAId, songBId) {
  state.skippedSongs.add(songAId);
  state.skippedSongs.add(songBId);
  return { ...state };
}

export function recordSongChoice(state, winnerId, loserId) {
  const { ratings, rd, matchups, appearances, opponentRatingSum } = state;

  opponentRatingSum[winnerId] += ratings[loserId];
  opponentRatingSum[loserId] += ratings[winnerId];

  // Update winner
  const gL = g(rd[loserId]);
  const eW = expectedScore(ratings[winnerId], ratings[loserId], rd[loserId]);
  const dSqW = 1 / (Q * Q * gL * gL * eW * (1 - eW));
  const newRdW = Math.max(MIN_RD, Math.sqrt(1 / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)));
  ratings[winnerId] += (Q / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)) * gL * (1 - eW);
  rd[winnerId] = newRdW;

  // Update loser
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

// --- Matchup selection (songs from different artists only) ---

function informationGain(state, aId, bId) {
  const { ratings, rd } = state;
  const e = expectedScore(ratings[aId], ratings[bId], rd[bId]);
  const entropy = -(e * Math.log2(e + 1e-10) + (1 - e) * Math.log2(1 - e + 1e-10));
  const uncertainty = rd[aId] + rd[bId];
  return entropy * uncertainty;
}

function medianRating(state, songs) {
  const sorted = songs.map((s) => state.ratings[s.id]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function discoverySongMatchup(state, songs) {
  const { matchups, appearances, rd } = state;

  const maxRd = Math.max(...songs.map((s) => rd[s.id]));
  const minApp = Math.min(...songs.map((s) => appearances[s.id]));

  // Pool: songs with fewest appearances or high uncertainty
  const pool = songs.filter(
    (s) => appearances[s.id] === minApp || rd[s.id] > maxRd * 0.8
  );
  const firstPick = pool[Math.floor(Math.random() * pool.length)];

  // Candidates: songs from DIFFERENT artists only
  const candidates = songs.filter(
    (s) => s.id !== firstPick.id && s.artistId !== firstPick.artistId
  );

  const median = medianRating(state, songs);
  const firstAvgOpp = appearances[firstPick.id] > 0
    ? state.opponentRatingSum[firstPick.id] / appearances[firstPick.id]
    : DEFAULT_RATING;

  const scored = candidates.map((s) => {
    const infoGain = informationGain(state, firstPick.id, s.id);
    const unseenBonus = matchups[firstPick.id].has(s.id) ? 0 : 2;
    const randomness = Math.random() * 0.3;

    let balanceBonus = 0;
    if (appearances[firstPick.id] > 0) {
      const oppRating = state.ratings[s.id];
      if (firstAvgOpp > median && oppRating < median) balanceBonus = 1;
      if (firstAvgOpp < median && oppRating >= median) balanceBonus = 1;
    }

    const score = infoGain * 0.01 + unseenBonus + balanceBonus + randomness;
    return { song: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topN = Math.min(5, scored.length);
  const secondPick = scored[Math.floor(Math.random() * topN)].song;

  return { songA: firstPick, songB: secondPick };
}

function bracketSongMatchup(state, songs) {
  const { ratings, rd } = state;
  const sorted = [...songs].sort((a, b) => ratings[b.id] - ratings[a.id]);
  const topPool = sorted.slice(0, Math.min(30, sorted.length));

  let bestPair = null;
  let bestGain = -1;

  // Sample pairs from top pool (full O(n^2) would be 435 pairs, fine)
  for (let i = 0; i < topPool.length; i++) {
    for (let j = i + 1; j < topPool.length; j++) {
      // Skip same-artist pairs
      if (topPool[i].artistId === topPool[j].artistId) continue;

      const gain = informationGain(state, topPool[i].id, topPool[j].id);
      const score = gain + Math.random() * gain * 0.3;
      if (score > bestGain) {
        bestGain = score;
        bestPair = { songA: topPool[i], songB: topPool[j] };
      }
    }
  }

  // Fallback to discovery if no valid pair found
  if (!bestPair) return discoverySongMatchup(state, songs);
  return bestPair;
}

const PHASE2_START = 80;
const PHASE3_START = 120;

export function getNextSongMatchup(state, songs) {
  // Filter out skipped songs
  const available = songs.filter((s) => !state.skippedSongs.has(s.id));

  let pick;
  const round = state.totalComparisons;

  if (round < PHASE2_START) {
    pick = discoverySongMatchup(state, available);
  } else if (round < PHASE3_START) {
    pick = Math.random() < 0.4
      ? bracketSongMatchup(state, available)
      : discoverySongMatchup(state, available);
  } else {
    pick = Math.random() < 0.6
      ? bracketSongMatchup(state, available)
      : discoverySongMatchup(state, available);
  }

  // Randomly swap sides
  if (Math.random() > 0.5) {
    return { songA: pick.songA, songB: pick.songB };
  }
  return { songA: pick.songB, songB: pick.songA };
}

// --- Aggregate song ratings into artist rankings ---

export function getArtistRankings(state, songs, groups) {
  const artistSongs = {};

  for (const song of songs) {
    if (!artistSongs[song.artistId]) {
      artistSongs[song.artistId] = [];
    }
    artistSongs[song.artistId].push(state.ratings[song.id]);
  }

  return groups
    .map((g) => {
      const songRatings = artistSongs[g.id] || [];
      const avgRating =
        songRatings.length > 0
          ? songRatings.reduce((a, b) => a + b, 0) / songRatings.length
          : DEFAULT_RATING;
      return {
        ...g,
        rating: Math.round(avgRating),
      };
    })
    .sort((a, b) => b.rating - a.rating);
}

export function getSongAccuracy(state, songs) {
  const avgRd =
    songs.reduce((sum, s) => sum + state.rd[s.id], 0) / songs.length;
  const pct = ((DEFAULT_RD - avgRd) / (DEFAULT_RD - MIN_RD)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
