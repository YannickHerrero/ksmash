import { useWikiImage } from "../hooks/useWikiImages";

export default function ResultsImage({ group, size = "sm" }) {
  const { url } = useWikiImage(group.wiki);

  const sizeClasses = size === "lg"
    ? "w-20 h-20 md:w-28 md:h-28 rounded-xl"
    : "w-10 h-10 rounded-lg";

  if (!url) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center shrink-0`}>
        <span className={`font-bold text-white/30 ${size === "lg" ? "text-2xl" : "text-xs"}`}>
          {group.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} overflow-hidden border border-white/10 shrink-0`}>
      <img
        src={url}
        alt={group.name}
        className="w-full h-full object-cover object-top"
        referrerPolicy="no-referrer"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </div>
  );
}
