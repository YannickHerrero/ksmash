import { useState, useCallback, useEffect } from "react";
import groups from "./data/groups";
import { prefetchImages } from "./hooks/useWikiImages";
import {
  createRankings,
  recordChoice,
  getNextMatchup,
  getRankings,
  CHECKPOINT_INTERVAL,
} from "./engine/ranking";
import Welcome from "./components/Welcome";
import VSBattle from "./components/VSBattle";
import CheckpointModal from "./components/CheckpointModal";
import Results from "./components/Results";

function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | battle | results
  const [state, setState] = useState(null);
  const [matchup, setMatchup] = useState(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);

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
    setShowCheckpoint(false);
  }, []);

  const handleChoice = useCallback(
    (winnerId, loserId) => {
      const newState = recordChoice(state, winnerId, loserId);
      setState(newState);

      // Check if we hit a checkpoint
      if (
        newState.totalComparisons % CHECKPOINT_INTERVAL === 0 &&
        newState.totalComparisons > 0
      ) {
        setShowCheckpoint(true);
      } else {
        const next = getNextMatchup(newState, groups);
        setMatchup(next);
      }
    },
    [state]
  );

  const handleContinue = useCallback(() => {
    setShowCheckpoint(false);
    const next = getNextMatchup(state, groups);
    setMatchup(next);
  }, [state]);

  const handleShowResults = useCallback(() => {
    setShowCheckpoint(false);
    setScreen("results");
  }, []);

  const handleContinueFromResults = useCallback(() => {
    setScreen("battle");
    const next = getNextMatchup(state, groups);
    setMatchup(next);
  }, [state]);

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

            {/* Progress bar */}
            <div className="mt-8 w-full max-w-xs">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (state.totalComparisons /
                        (CHECKPOINT_INTERVAL * 3)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-center text-white/20 text-xs mt-2">
                {state.totalComparisons} comparisons made
              </p>
            </div>
          </div>
        )}

        {screen === "results" && state && (
          <Results
            rankings={getRankings(state, groups)}
            totalRounds={state.totalComparisons}
            onPlayAgain={startGame}
            onContinue={handleContinueFromResults}
          />
        )}
      </div>

      {/* Checkpoint modal */}
      {showCheckpoint && (
        <CheckpointModal
          round={state.totalComparisons}
          onContinue={handleContinue}
          onShowResults={handleShowResults}
        />
      )}
    </div>
  );
}

export default App;
