export default function CheckpointModal({ round, onContinue, onShowResults }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-3xl
        p-8 md:p-10 max-w-md w-full text-center shadow-2xl shadow-purple-500/10">
        {/* Decorative sparkles */}
        <div className="text-4xl mb-4">✨</div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Nice picks!
        </h2>
        <p className="text-white/50 mb-8">
          You've made <span className="text-pink-400 font-bold">{round}</span> choices.
          Your ranking is starting to take shape!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onShowResults}
            className="w-full py-3 px-6 rounded-xl font-bold text-white
              bg-gradient-to-r from-pink-500 to-purple-600
              hover:from-pink-400 hover:to-purple-500
              transition-all duration-200
              shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40
              active:scale-95 cursor-pointer"
          >
            Show my results
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 rounded-xl font-bold text-white/70
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:text-white
              transition-all duration-200
              active:scale-95 cursor-pointer"
          >
            Keep going for more accuracy
          </button>
        </div>

        <p className="text-xs text-white/20 mt-4">
          More rounds = more accurate results
        </p>
      </div>
    </div>
  );
}
