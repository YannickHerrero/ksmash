import SongCard from "./SongCard";

export default function VSSongBattle({ songA, songB, onChoose, round }) {
  return (
    <div className="relative flex flex-col items-center w-full max-w-5xl mx-auto px-4">
      {/* Round counter */}
      <div className="mb-6 text-center">
        <span className="text-white/40 text-sm font-medium tracking-widest uppercase">
          Round {round}
        </span>
      </div>

      {/* Battle area */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full items-stretch">
        <SongCard song={songA} side="left" onClick={() => onChoose(songA.id, songB.id)} />

        {/* VS badge */}
        <div className="flex items-center justify-center md:self-center shrink-0 z-20">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-400 via-blue-500 to-cyan-500
              flex items-center justify-center shadow-lg shadow-blue-500/30
              animate-pulse">
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter">VS</span>
            </div>
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-violet-400/20 via-blue-500/20 to-cyan-500/20
              blur-md -z-10" />
          </div>
        </div>

        <SongCard song={songB} side="right" onClick={() => onChoose(songB.id, songA.id)} />
      </div>

      {/* Instruction */}
      <p className="mt-6 text-white/30 text-sm text-center">
        Choose the song you prefer
      </p>
    </div>
  );
}
