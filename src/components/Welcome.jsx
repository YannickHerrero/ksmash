export default function Welcome({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 text-6xl">💜</div>

        <h1 className="text-5xl md:text-7xl font-black mb-4
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          KSMASH
        </h1>

        <p className="text-lg md:text-xl text-white/60 mb-2 max-w-md">
          Find out which K-pop group is your ultimate bias
        </p>
        <p className="text-sm text-white/30 mb-10 max-w-sm">
          Pick your favorite in a series of head-to-head battles.
          The more you play, the more accurate your ranking gets.
        </p>

        {/* Mode selection */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={() => onStart("groups")}
            className="relative py-4 px-8 rounded-2xl font-bold text-lg text-white
              bg-gradient-to-r from-pink-500 to-purple-600
              hover:from-pink-400 hover:to-purple-500
              transition-all duration-300
              shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50
              active:scale-95 cursor-pointer
              group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-2xl">👑</span>
              Groups Mode
            </span>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600
              opacity-30 blur-lg group-hover:opacity-50 transition-opacity -z-10" />
          </button>

          <button
            onClick={() => onStart("songs")}
            className="relative py-4 px-8 rounded-2xl font-bold text-lg text-white
              bg-gradient-to-r from-violet-500 to-blue-600
              hover:from-violet-400 hover:to-blue-500
              transition-all duration-300
              shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
              active:scale-95 cursor-pointer
              group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              Music Mode
            </span>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-600
              opacity-30 blur-lg group-hover:opacity-50 transition-opacity -z-10" />
          </button>
        </div>

        <div className="flex flex-col gap-1 text-xs text-white/20">
          <p><span className="text-pink-400/40">Groups</span> — compare artists head-to-head</p>
          <p><span className="text-violet-400/40">Music</span> — compare songs, rank the artists</p>
        </div>
      </div>
    </div>
  );
}
