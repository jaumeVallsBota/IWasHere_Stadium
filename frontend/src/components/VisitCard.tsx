"use client";

import { useState } from "react";
import type { Visit } from "@/types";
import { formatDate } from "@/utils/formatters";
import { StarRating } from "./StarRating";

interface VisitCardProps {
  visit: Visit;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function VisitCard({ visit, onEdit, onDelete, isDeleting }: VisitCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start p-4 gap-2">
        <button
          type="button"
          className="flex-1 min-w-0 text-left"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {visit.visit_type === "matchday" ? "⚽ Partido" : "🏟 Tour"}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {formatDate(visit.date)}
            </span>
          </div>
          {visit.visit_type === "matchday" && visit.match_home_team && (
            <p className="mt-1 text-sm text-gray-600">
              {visit.match_home_team} vs {visit.match_away_team}
              {visit.match_score && ` · ${visit.match_score}`}
            </p>
          )}
          {visit.visit_type === "tour" && visit.tour_overall_impression && (
            <p className="mt-1 text-sm text-gray-600">
              Impresión: {visit.tour_overall_impression}
            </p>
          )}
        </button>
        <div className="shrink-0 flex flex-col items-end gap-1">
          {visit.rating && <StarRating value={visit.rating} readOnly />}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-xs text-gray-400 px-1"
            aria-label={expanded ? "Colapsar" : "Expandir"}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-2 text-sm text-gray-600">
          {visit.visit_type === "matchday" && (
            <>
              {visit.match_competition && <p>🏆 {visit.match_competition}</p>}
              {visit.match_score && <p>Resultado: {visit.match_score}</p>}
            </>
          )}
          {visit.visit_type === "tour" && (
            <>
              {visit.tour_highlights && (
                <div>
                  <p className="font-medium text-gray-700">Destacado</p>
                  <p className="mt-0.5 whitespace-pre-wrap">{visit.tour_highlights}</p>
                </div>
              )}
              {visit.tour_guide_quality && (
                <p>Guía: {visit.tour_guide_quality}</p>
              )}
              {visit.tour_duration_minutes && (
                <p>Duración: ~{visit.tour_duration_minutes} min</p>
              )}
              {visit.tour_would_recommend !== undefined && visit.tour_would_recommend !== null && (
                <p>¿Lo recomiendas? {visit.tour_would_recommend ? "Sí" : "No"}</p>
              )}
            </>
          )}
          {visit.notes && (
            <div>
              <p className="font-medium text-gray-700">Notas</p>
              <p className="mt-0.5 whitespace-pre-wrap">{visit.notes}</p>
            </div>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-400"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:border-red-400 disabled:opacity-50"
                >
                  {isDeleting ? "Eliminando…" : "Eliminar"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
