import { useState, useCallback, useEffect } from "react";
import groups from "./data/groups";
import songs from "./data/songs";
import { prefetchImages } from "./hooks/useWikiImages";
import {
  createRankings,
  recordChoice,
  getNextMatchup,
  getRankings,
  getAccuracy,
} from "./engine/ranking";
import {
  createSongRankings,
  recordSongChoice,
  getNextSongMatchup,
  getArtistRankings,
  getSongAccuracy,
} from "./engine/songRanking";
import Welcome from "./components/Welcome";
import VSBattle from "./components/VSBattle";
import VSSongBattle from "./components/VSSongBattle";
import Results from "./components/Results";

const ACCURACY_UNLOCK = 20;

function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | battle | results
  const [mode, setMode] = useState(null); // "groups" | "songs"
  const [state, setState] = useState(null);
  const [matchup, setMatchup] = useState(null);

  useEffect(() => {
    prefetchImages(groups);
  }, []);

  const startGame = useCallback((selectedMode) => {
    setMode(selectedMode);

    if (selectedMode === "groups") {
      const initial = createRankings(groups);
      const firstMatchup = getNextMatchup(initial, groups);
      setState(initial);
      setMatchup(firstMatchup);
    } else {
      const initial = createSongRankings(songs);
      const firstMatchup = getNextSongMatchup(initial, songs);
      setState(initial);
      setMatchup(firstMatchup);
    }

    setScreen("battle");
  }, []);

  const handleGroupChoice = useCallback(
    (winnerId, loserId) => {
      const newState = recordChoice(state, winnerId, loserId);
      setState(newState);
      setMatchup(getNextMatchup(newState, groups));
    },
    [state]
  );

  const handleSongChoice = useCallback(
    (winnerId, loserId) => {
      const newState = recordSongChoice(state, winnerId, loserId);
      setState(newState);
      setMatchup(getNextSongMatchup(newState, songs));
    },
    [state]
  );

  const handleShowResults = useCallback(() => {
    setScreen("results");
  }, []);

  const handleContinue = useCallback(() => {
    setScreen("battle");
    if (mode === "groups") {
      setMatchup(getNextMatchup(state, groups));
    } else {
      setMatchup(getNextSongMatchup(state, songs));
    }
  }, [state, mode]);

  const handlePlayAgain = useCallback(() => {
    setScreen("welcome");
    setState(null);
    setMatchup(null);
    setMode(null);
  }, []);

  const accuracy = state
    ? mode === "groups"
      ? getAccuracy(state, groups)
      : getSongAccuracy(state, songs)
    : 0;

  const canSeeResults = accuracy >= ACCURACY_UNLOCK;

  const rankings = state
    ? mode === "groups"
      ? getRankings(state, groups)
      : getArtistRankings(state, songs, groups)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
          ${mode === "songs"
            ? "bg-gradient-to-b from-blue-500/8 to-transparent"
            : "bg-gradient-to-b from-purple-500/8 to-transparent"
          } rounded-full blur-3xl`} />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {screen === "welcome" && <Welcome onStart={startGame} />}

        {screen === "battle" && matchup && (
          <div className="min-h-screen flex flex-col items-center justify-center py-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className={`text-2xl md:text-3xl font-black bg-clip-text text-transparent
                ${mode === "songs"
                  ? "bg-gradient-to-r from-violet-400 to-blue-400"
                  : "bg-gradient-to-r from-pink-400 to-purple-400"
                }`}>
                KSMASH
              </h1>
              <p className="text-white/20 text-xs mt-1">
                {mode === "songs" ? "Music Mode" : "Groups Mode"}
              </p>
            </div>

            <div
              key={mode === "groups"
                ? `${matchup.groupA.id}-${matchup.groupB.id}`
                : `${matchup.songA.id}-${matchup.songB.id}`
              }
              className="animate-fade-in-up w-full"
            >
              {mode === "groups" ? (
                <VSBattle
                  groupA={matchup.groupA}
                  groupB={matchup.groupB}
                  onChoose={handleGroupChoice}
                  round={state.totalComparisons + 1}
                />
              ) : (
                <VSSongBattle
                  songA={matchup.songA}
                  songB={matchup.songB}
                  onChoose={handleSongChoice}
                  round={state.totalComparisons + 1}
                />
              )}
            </div>

            {/* Accuracy bar + See Results button */}
            <div className="mt-8 w-full max-w-xs flex flex-col items-center gap-3">
              <div className="w-full">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      accuracy < 40
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : accuracy < 70
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-400"
                    }`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-white/20 text-xs">
                    {state.totalComparisons} comparisons
                  </p>
                  <p className={`text-xs font-medium ${
                    accuracy < 40
                      ? "text-orange-400/70"
                      : accuracy < 70
                        ? "text-yellow-400/70"
                        : "text-emerald-400/70"
                  }`}>
                    {accuracy}% accuracy
                  </p>
                </div>
              </div>

              {canSeeResults && (
                <button
                  onClick={handleShowResults}
                  className={`text-sm transition-colors cursor-pointer ${
                    mode === "songs"
                      ? "text-violet-400/70 hover:text-violet-300"
                      : "text-pink-400/70 hover:text-pink-300"
                  }`}
                >
                  See my ranking
                </button>
              )}
            </div>
          </div>
        )}

        {screen === "results" && state && (
          <Results
            rankings={rankings}
            totalRounds={state.totalComparisons}
            accuracy={accuracy}
            onPlayAgain={handlePlayAgain}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}

export default App;
