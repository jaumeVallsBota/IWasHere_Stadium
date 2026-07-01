"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { stadiumService } from "@/services/stadiumService";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { TeamBadge } from "@/components/TeamBadge";
import { StarRating } from "@/components/StarRating";
import { formatDate } from "@/utils/formatters";
import type { Visit, StadiumListItem } from "@/types";

export default function EquipoPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: encodedName } = use(params);
  const teamName = decodeURIComponent(encodedName);
  const { isAuthenticated } = useAuth();

  const { data: stadiums, isLoading } = useQuery({
    queryKey: ["stadiums", { team: teamName }],
    queryFn: () => stadiumService.search({ team: teamName, limit: 50 }),
  });

  const { data: allVisits } = useQuery({
    queryKey: ["allVisits"],
    queryFn: userService.allVisits,
    enabled: isAuthenticated,
  });

  const stadiumIds = new Set(stadiums?.map((s) => s.id) ?? []);

  const teamVisits = allVisits?.filter((v) => stadiumIds.has(v.stadium_id)) ?? [];

  const matchdayVisits = teamVisits.filter((v) => v.visit_type === "matchday");
  const tourVisits = teamVisits.filter((v) => v.visit_type === "tour");
  const ratedVisits = teamVisits.filter((v) => v.rating != null);
  const avgRating =
    ratedVisits.length > 0
      ? ratedVisits.reduce((sum, v) => sum + (v.rating ?? 0), 0) / ratedVisits.length
      : null;

  const stadiumById = Object.fromEntries((stadiums ?? []).map((s) => [s.id, s]));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Back link */}
      <Link href="/estadios" className="text-sm text-green-700 hover:underline">
        ← Estadios
      </Link>

      {/* Team header */}
      <div className="flex items-center gap-5">
        <TeamBadge name={teamName} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
          {stadiums && stadiums.length > 0 && (
            <p className="text-gray-500 mt-1">{stadiums[0].country}</p>
          )}
        </div>
      </div>

      {/* My stats — authenticated only */}
      {isAuthenticated && teamVisits.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Mis estadísticas</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-700">{matchdayVisits.length}</p>
              <p className="text-xs text-gray-500 mt-1">Partidos</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-700">{tourVisits.length}</p>
              <p className="text-xs text-gray-500 mt-1">Tours</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              {avgRating != null ? (
                <>
                  <p className="text-3xl font-bold text-green-700">{avgRating.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Valoración media</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-300">—</p>
                  <p className="text-xs text-gray-500 mt-1">Sin valoración</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stadiums */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Estadios</h2>
        {!stadiums || stadiums.length === 0 ? (
          <p className="text-sm text-gray-400">No se encontraron estadios para este equipo.</p>
        ) : (
          <div className="space-y-3">
            {stadiums.map((stadium) => {
              const visitCount = teamVisits.filter((v) => v.stadium_id === stadium.id).length;
              return (
                <Link
                  key={stadium.id}
                  href={`/estadios/${stadium.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-green-300 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{stadium.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {stadium.city}
                      {stadium.capacity
                        ? ` · ${stadium.capacity.toLocaleString("es-ES")} espectadores`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && visitCount > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {visitCount} {visitCount === 1 ? "visita" : "visitas"}
                      </span>
                    )}
                    <span className="text-gray-400">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Reviews */}
      {isAuthenticated && teamVisits.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Mis visitas</h2>
          <div className="space-y-3">
            {teamVisits.map((visit) => (
              <VisitSummaryCard
                key={visit.id}
                visit={visit}
                stadium={stadiumById[visit.stadium_id]}
              />
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && teamVisits.length === 0 && stadiums && stadiums.length > 0 && (
        <section className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">Aún no has visitado ningún estadio de {teamName}.</p>
          <Link
            href={`/estadios/${stadiums[0].id}`}
            className="mt-3 inline-block text-sm text-green-700 hover:underline"
          >
            Añadir primera visita →
          </Link>
        </section>
      )}

      {!isAuthenticated && (
        <section className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">
            <Link href="/login" className="text-green-700 hover:underline">
              Inicia sesión
            </Link>{" "}
            para ver tus estadísticas y visitas a este equipo.
          </p>
        </section>
      )}
    </div>
  );
}

function VisitSummaryCard({
  visit,
  stadium,
}: {
  visit: Visit;
  stadium: StadiumListItem | undefined;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {stadium && (
            <p className="text-xs font-medium text-green-700 mb-1">{stadium.name}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {visit.visit_type === "matchday" ? "⚽ Partido" : "🏟 Tour"}
            </span>
            <span className="text-sm text-gray-700">{formatDate(visit.date)}</span>
          </div>
          {visit.visit_type === "matchday" && visit.match_home_team && (
            <p className="mt-1 text-sm text-gray-600">
              {visit.match_home_team} vs {visit.match_away_team}
              {visit.match_score && ` · ${visit.match_score}`}
            </p>
          )}
          {visit.notes && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{visit.notes}</p>
          )}
        </div>
        {visit.rating && (
          <div className="shrink-0">
            <StarRating value={visit.rating} readOnly size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
