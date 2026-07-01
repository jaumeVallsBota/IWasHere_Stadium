import type { LeagueProgress } from "@/types";

interface LeagueProgressProps {
  progress: LeagueProgress;
  onLeave?: () => void;
  isLeaving?: boolean;
}

export function LeagueProgressBar({ progress, onLeave, isLeaving }: LeagueProgressProps) {
  const pct = Math.min(100, Math.round(progress.percentage));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-800">{progress.league_name}</p>
          <p className="text-xs text-gray-500">
            {progress.visited} de {progress.total} estadios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-green-700">{pct}%</span>
          {onLeave && (
            <button
              onClick={onLeave}
              disabled={isLeaving}
              className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50"
              title="Dejar de seguir"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
