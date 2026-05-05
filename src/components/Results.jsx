export default function Results({ rankings, totalRounds, onPlayAgain, onContinue }) {
  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3, 20);

  const medals = ["🥇", "🥈", "🥉"];
  const podiumHeights = ["h-40", "h-32", "h-28"];
  const podiumOrder = [1, 0, 2]; // silver, gold, bronze for visual layout

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
          Your Top K-pop
        </h1>
        <p className="text-white/40 text-sm">
          Based on {totalRounds} comparisons
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-12">
        {podiumOrder.map((idx) => {
          const group = top3[idx];
          if (!group) return null;
          return (
            <div key={group.id} className="flex flex-col items-center">
              {/* Photo */}
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden mb-2
                border-2 ${idx === 0 ? "border-yellow-400 shadow-yellow-400/30" : idx === 1 ? "border-gray-300 shadow-gray-300/20" : "border-amber-600 shadow-amber-600/20"} shadow-lg`}>
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              {/* Name */}
              <span className="text-white font-bold text-xs md:text-sm text-center mb-1 max-w-[100px] truncate">
                {group.name}
              </span>
              {/* Medal */}
              <span className="text-2xl md:text-3xl mb-1">{medals[idx]}</span>
              {/* Podium block */}
              <div className={`${podiumHeights[idx]} w-24 md:w-32 rounded-t-lg
                ${idx === 0
                  ? "bg-gradient-to-t from-yellow-600/40 to-yellow-400/20 border-t-2 border-x-2 border-yellow-400/30"
                  : idx === 1
                    ? "bg-gradient-to-t from-gray-500/30 to-gray-300/10 border-t-2 border-x-2 border-gray-400/20"
                    : "bg-gradient-to-t from-amber-700/30 to-amber-500/10 border-t-2 border-x-2 border-amber-600/20"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Full ranking list */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-white/60 text-sm font-medium">Full Rankings</h3>
        </div>
        <div className="divide-y divide-white/5">
          {rankings.slice(0, 20).map((group, i) => (
            <div
              key={group.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <span className={`w-8 text-right font-bold text-sm
                ${i < 3 ? "text-yellow-400" : "text-white/30"}`}>
                {i + 1}
              </span>
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{group.name}</p>
                <p className="text-white/30 text-xs">{group.company}</p>
              </div>
              <span className="text-white/20 text-xs font-mono">{group.rating}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <button
          onClick={onContinue}
          className="py-3 px-6 rounded-xl font-bold text-white
            bg-gradient-to-r from-pink-500 to-purple-600
            hover:from-pink-400 hover:to-purple-500
            transition-all duration-200
            shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40
            active:scale-95 cursor-pointer"
        >
          Refine my ranking
        </button>
        <button
          onClick={onPlayAgain}
          className="py-3 px-6 rounded-xl font-bold text-white/70
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:text-white
            transition-all duration-200
            active:scale-95 cursor-pointer"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
