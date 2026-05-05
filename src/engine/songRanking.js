// Song-based battles that rank artists directly
// Each song win/loss updates the parent artist's Glicko rating
// Skipping penalizes both artists (not knowing songs = not a favorite)

const DEFAULT_RATING = 1500;
const DEFAULT_RD = 350;
const MIN_RD = 50;
const SKIP_PENALTY = 30; // rating points lost per skip

const Q = Math.log(10) / 400;

function g(rd) {
  return 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / (Math.PI * Math.PI));
}

function expectedScore(myRating, oppRating, oppRd) {
  return 1 / (1 + Math.pow(10, -g(oppRd) * (myRating - oppRating) / 400));
}

export function createSongRankings(songs, groups) {
  const ratings = {};
  const rd = {};
  const matchups = {};
  const appearances = {};
  const opponentRatingSum = {};
  const skippedSongs = new Set();

  for (const group of groups) {
    ratings[group.id] = DEFAULT_RATING;
    rd[group.id] = DEFAULT_RD;
    matchups[group.id] = new Set();
    appearances[group.id] = 0;
    opponentRatingSum[group.id] = 0;
  }

  return { ratings, rd, matchups, appearances, opponentRatingSum, skippedSongs, totalComparisons: 0 };
}

export function recordSongChoice(state, winnerSong, loserSong) {
  const { ratings, rd, matchups, appearances, opponentRatingSum } = state;
  const winnerId = winnerSong.artistId;
  const loserId = loserSong.artistId;

  opponentRatingSum[winnerId] += ratings[loserId];
  opponentRatingSum[loserId] += ratings[winnerId];

  // Update winner artist
  const gL = g(rd[loserId]);
  const eW = expectedScore(ratings[winnerId], ratings[loserId], rd[loserId]);
  const dSqW = 1 / (Q * Q * gL * gL * eW * (1 - eW));
  const newRdW = Math.max(MIN_RD, Math.sqrt(1 / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)));
  ratings[winnerId] += (Q / (1 / (rd[winnerId] * rd[winnerId]) + 1 / dSqW)) * gL * (1 - eW);
  rd[winnerId] = newRdW;

  // Update loser artist
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

export function skipSongs(state, songA, songB) {
  const { ratings, skippedSongs } = state;

  // Mark songs as skipped
  skippedSongs.add(songA.id);
  skippedSongs.add(songB.id);

  // Penalize both artists
  ratings[songA.artistId] = Math.max(1000, ratings[songA.artistId] - SKIP_PENALTY);
  ratings[songB.artistId] = Math.max(1000, ratings[songB.artistId] - SKIP_PENALTY);

  return { ...state };
}

// --- Matchup selection ---

function informationGain(state, aArtistId, bArtistId) {
  const { ratings, rd } = state;
  const e = expectedScore(ratings[aArtistId], ratings[bArtistId], rd[bArtistId]);
  const entropy = -(e * Math.log2(e + 1e-10) + (1 - e) * Math.log2(1 - e + 1e-10));
  const uncertainty = rd[aArtistId] + rd[bArtistId];
  return entropy * uncertainty;
}

function medianRating(state, groups) {
  const sorted = groups.map((g) => state.ratings[g.id]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pickRandomSong(songs, artistId, skippedSongs) {
  const available = songs.filter(
    (s) => s.artistId === artistId && !skippedSongs.has(s.id)
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function discoverySongMatchup(state, songs, groups) {
  const { matchups, appearances, rd, skippedSongs } = state;

  // Only consider artists that still have unskipped songs
  const availableGroups = groups.filter((g) =>
    songs.some((s) => s.artistId === g.id && !skippedSongs.has(s.id))
  );

  const maxRd = Math.max(...availableGroups.map((g) => rd[g.id]));
  const minApp = Math.min(...availableGroups.map((g) => appearances[g.id]));

  const pool = availableGroups.filter(
    (g) => appearances[g.id] === minApp || rd[g.id] > maxRd * 0.8
  );
  const firstArtist = pool[Math.floor(Math.random() * pool.length)];

  // Pick opponent artist (different artist with available songs)
  const candidates = availableGroups.filter((g) => g.id !== firstArtist.id);
  const median = medianRating(state, availableGroups);
  const firstAvgOpp = appearances[firstArtist.id] > 0
    ? state.opponentRatingSum[firstArtist.id] / appearances[firstArtist.id]
    : DEFAULT_RATING;

  const scored = candidates.map((g) => {
    const infoGain = informationGain(state, firstArtist.id, g.id);
    const unseenBonus = matchups[firstArtist.id].has(g.id) ? 0 : 2;
    const randomness = Math.random() * 0.3;

    let balanceBonus = 0;
    if (appearances[firstArtist.id] > 0) {
      const oppRating = state.ratings[g.id];
      if (firstAvgOpp > median && oppRating < median) balanceBonus = 1;
      if (firstAvgOpp < median && oppRating >= median) balanceBonus = 1;
    }

    const score = infoGain * 0.01 + unseenBonus + balanceBonus + randomness;
    return { group: g, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topN = Math.min(5, scored.length);
  const secondArtist = scored[Math.floor(Math.random() * topN)].group;

  // Pick random songs from each artist
  const songA = pickRandomSong(songs, firstArtist.id, skippedSongs);
  const songB = pickRandomSong(songs, secondArtist.id, skippedSongs);

  return { songA, songB };
}

function bracketSongMatchup(state, songs, groups) {
  const { ratings, skippedSongs } = state;

  const availableGroups = groups.filter((g) =>
    songs.some((s) => s.artistId === g.id && !skippedSongs.has(s.id))
  );

  const sorted = [...availableGroups].sort((a, b) => ratings[b.id] - ratings[a.id]);
  const topPool = sorted.slice(0, Math.min(15, sorted.length));

  let bestPair = null;
  let bestGain = -1;

  for (let i = 0; i < topPool.length; i++) {
    for (let j = i + 1; j < topPool.length; j++) {
      const gain = informationGain(state, topPool[i].id, topPool[j].id);
      const score = gain + Math.random() * gain * 0.3;
      if (score > bestGain) {
        bestGain = score;
        bestPair = { a: topPool[i], b: topPool[j] };
      }
    }
  }

  if (!bestPair) return discoverySongMatchup(state, songs, groups);

  const songA = pickRandomSong(songs, bestPair.a.id, skippedSongs);
  const songB = pickRandomSong(songs, bestPair.b.id, skippedSongs);

  if (!songA || !songB) return discoverySongMatchup(state, songs, groups);
  return { songA, songB };
}

const PHASE2_START = 60;
const PHASE3_START = 90;

export function getNextSongMatchup(state, songs, groups) {
  let pick;
  const round = state.totalComparisons;

  if (round < PHASE2_START) {
    pick = discoverySongMatchup(state, songs, groups);
  } else if (round < PHASE3_START) {
    pick = Math.random() < 0.4
      ? bracketSongMatchup(state, songs, groups)
      : discoverySongMatchup(state, songs, groups);
  } else {
    pick = Math.random() < 0.6
      ? bracketSongMatchup(state, songs, groups)
      : discoverySongMatchup(state, songs, groups);
  }

  if (Math.random() > 0.5) {
    return { songA: pick.songA, songB: pick.songB };
  }
  return { songA: pick.songB, songB: pick.songA };
}

export function getArtistRankings(state, groups) {
  return groups
    .map((g) => ({
      ...g,
      rating: Math.round(state.ratings[g.id]),
    }))
    .sort((a, b) => b.rating - a.rating);
}

export function getSongAccuracy(state, groups) {
  const avgRd =
    groups.reduce((sum, g) => sum + state.rd[g.id], 0) / groups.length;
  const pct = ((DEFAULT_RD - avgRd) / (DEFAULT_RD - MIN_RD)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
