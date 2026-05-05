import { useWikiImage } from "../hooks/useWikiImages";

export default function SongCard({ song, side, onClick }) {
  const isLeft = side === "left";
  const { url: imageUrl, loading } = useWikiImage(song.wiki);

  return (
    <button
      onClick={onClick}
      className={`group relative flex-1 min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center p-6 cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:z-10
        active:scale-[0.98]
        ${isLeft
          ? "bg-gradient-to-br from-violet-950/80 to-indigo-950/80 hover:from-violet-900/90 hover:to-indigo-900/90"
          : "bg-gradient-to-br from-blue-950/80 to-cyan-950/80 hover:from-blue-900/90 hover:to-cyan-900/90"
        }
        border-2 border-white/10 hover:border-white/30
        rounded-2xl md:rounded-3xl
        backdrop-blur-sm
        overflow-hidden
      `}
    >
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* Artist image */}
      <div className="relative w-full max-w-[220px] aspect-square rounded-xl overflow-hidden mb-4
        shadow-2xl shadow-black/50 border border-white/10">
        {loading ? (
          <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-violet-400 animate-spin" />
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={song.artistName}
            className="w-full h-full object-cover object-top"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        {/* Fallback */}
        <div
          className={`${!imageUrl && !loading ? "flex" : "hidden"} w-full h-full items-center justify-center
            bg-gradient-to-br ${isLeft ? "from-violet-600/30 to-indigo-600/30" : "from-blue-600/30 to-cyan-600/30"}`}
          style={imageUrl ? { display: "none" } : undefined}
        >
          <span className="text-4xl">🎵</span>
        </div>
      </div>

      {/* Song title */}
      <h2 className="text-xl md:text-2xl font-black text-white tracking-tight text-center
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight max-w-[260px]">
        {song.title}
      </h2>

      {/* Artist name */}
      <p className="text-sm text-white/50 mt-2 font-medium">
        {song.artistName}
      </p>

      {/* Click hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          Click to choose
        </span>
      </div>
    </button>
  );
}
