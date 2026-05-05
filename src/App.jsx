import { useState, useCallback, useEffect } from "react";
import groups from "./data/groups";
import { prefetchImages } from "./hooks/useWikiImages";
import {
  createRankings,
  recordChoice,
  getNextMatchup,
  getRankings,
  getAccuracy,
} from "./engine/ranking";
import Welcome from "./components/Welcome";
import VSBattle from "./components/VSBattle";
import Results from "./components/Results";

const ACCURACY_UNLOCK = 20; // show "See my ranking" button at 20% accuracy

function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | battle | results
  const [state, setState] = useState(null);
  const [matchup, setMatchup] = useState(null);

  // Prefetch all Wikipedia images on mount
  useEffect(() => {
    prefetchImages(groups);
  }, []);

  const startGame = useCallback(() => {
    const initial = createRankings(groups);
    const firstMatchup = getNextMatchup(initial, groups);
    setState(initial);
    setMatchup(firstMatchup);
    setScreen("battle");
  }, []);

  const handleChoice = useCallback(
    (winnerId, loserId) => {
      const newState = recordChoice(state, winnerId, loserId);
      setState(newState);
      const next = getNextMatchup(newState, groups);
      setMatchup(next);
    },
    [state]
  );

  const handleShowResults = useCallback(() => {
    setScreen("results");
  }, []);

  const handleContinueFromResults = useCallback(() => {
    setScreen("battle");
    const next = getNextMatchup(state, groups);
    setMatchup(next);
  }, [state]);

  const accuracy = state ? getAccuracy(state, groups) : 0;
  const canSeeResults = accuracy >= ACCURACY_UNLOCK;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
          bg-gradient-to-b from-purple-500/8 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {screen === "welcome" && <Welcome onStart={startGame} />}

        {screen === "battle" && matchup && (
          <div className="min-h-screen flex flex-col items-center justify-center py-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-black
                bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                KSMASH
              </h1>
            </div>

            <div key={`${matchup.groupA.id}-${matchup.groupB.id}`} className="animate-fade-in-up w-full">
              <VSBattle
                groupA={matchup.groupA}
                groupB={matchup.groupB}
                onChoose={handleChoice}
                round={state.totalComparisons + 1}
              />
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
                  className="text-sm text-pink-400/70 hover:text-pink-300 transition-colors cursor-pointer"
                >
                  See my ranking
                </button>
              )}
            </div>
          </div>
        )}

        {screen === "results" && state && (
          <Results
            rankings={getRankings(state, groups)}
            totalRounds={state.totalComparisons}
            accuracy={accuracy}
            onPlayAgain={startGame}
            onContinue={handleContinueFromResults}
          />
        )}
      </div>
    </div>
  );
}

export default App;
