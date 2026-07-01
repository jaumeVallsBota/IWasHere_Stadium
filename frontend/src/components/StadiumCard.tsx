import Link from "next/link";
import type { StadiumListItem } from "@/types";

interface StadiumCardProps {
  stadium: StadiumListItem;
  visitCount?: number;
  visitTypes?: ("matchday" | "tour")[];
}

export function StadiumCard({ stadium, visitCount, visitTypes }: StadiumCardProps) {
  const isVisited = !!visitCount && visitCount > 0;

  return (
    <Link
      href={`/estadios/${stadium.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-green-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{stadium.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {stadium.city}, {stadium.country}
          </p>
          {stadium.current_team && (
            <p className="text-xs text-gray-400 mt-1">🏠 {stadium.current_team}</p>
          )}
          {stadium.capacity && (
            <p className="text-xs text-gray-400">👥 {stadium.capacity.toLocaleString("es-ES")} espectadores</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isVisited && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Visitado
            </span>
          )}
          {stadium.status === "pending_review" && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Pendiente
            </span>
          )}
          {visitTypes && visitTypes.length > 0 && (
            <div className="flex gap-1">
              {visitTypes.includes("matchday") && <span title="Partido">⚽</span>}
              {visitTypes.includes("tour") && <span title="Tour">🏟</span>}
            </div>
          )}
          {visitCount && visitCount > 0 && (
            <span className="text-xs text-gray-400">{visitCount} {visitCount === 1 ? "visita" : "visitas"}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
