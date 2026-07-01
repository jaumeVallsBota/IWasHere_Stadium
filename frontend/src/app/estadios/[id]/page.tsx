"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStadium } from "@/hooks/useStadiums";
import { useAuth } from "@/hooks/useAuth";
import { useStadiumVisits, useDeleteVisit } from "@/hooks/useVisits";
import { VisitCard } from "@/components/VisitCard";
import { StadiumMap } from "@/components/StadiumMap";
import { TeamBadge } from "@/components/TeamBadge";

export default function EstadioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: stadium, isLoading, error } = useStadium(id);
  const { data: visits } = useStadiumVisits(id);
  const { mutate: deleteVisit, isPending: isDeleting } = useDeleteVisit(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !stadium) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-500">No se encontró el estadio.</p>
        <Link href="/estadios" className="mt-4 inline-block text-green-700 hover:underline">
          ← Volver a estadios
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/estadios" className="text-sm text-green-700 hover:underline">
          ← Estadios
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{stadium.name}</h1>
            <p className="text-gray-500 mt-1">
              {stadium.city}, {stadium.country}
            </p>
          </div>
          {stadium.status === "pending_review" && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Pendiente de aprobación
            </span>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stadium.capacity && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700">
              {stadium.capacity.toLocaleString("es-ES")}
            </p>
            <p className="text-xs text-gray-500 mt-1">Aforo</p>
          </div>
        )}
        {stadium.year_opened && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-700">{stadium.year_opened}</p>
            <p className="text-xs text-gray-500 mt-1">Inaugurado</p>
          </div>
        )}
        {stadium.current_team && (
          <Link
            href={`/equipos/${encodeURIComponent(stadium.current_team)}`}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-green-300 transition flex flex-col items-center gap-2"
          >
            <TeamBadge name={stadium.current_team} size="md" />
            <p className="text-sm font-semibold text-gray-800 truncate">{stadium.current_team}</p>
            <p className="text-xs text-gray-500">Equipo actual</p>
          </Link>
        )}
      </div>

      {/* Map */}
      <StadiumMap
        pins={[]}
        singlePin={{ lat: stadium.latitude, lng: stadium.longitude, name: stadium.name }}
      />

      {/* History */}
      {stadium.history && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Historia</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {stadium.history}
          </p>
        </section>
      )}

      {/* Teams hosted */}
      {stadium.teams.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Equipos</h2>
          <div className="space-y-2">
            {stadium.teams.map((team) => (
              <Link
                key={team.id}
                href={`/equipos/${encodeURIComponent(team.name)}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-green-300 transition"
              >
                <TeamBadge name={team.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-800 truncate">{team.name}</p>
                    <p className="text-xs text-gray-500 shrink-0">{team.years_at_stadium}</p>
                  </div>
                  {team.notes && <p className="text-xs text-gray-400 mt-0.5">{team.notes}</p>}
                </div>
                <span className="text-gray-400 shrink-0">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* My visits */}
      {isAuthenticated && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Mis visitas</h2>
            <Link
              href={`/estadios/${id}/visita/nueva`}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              + Añadir visita
            </Link>
          </div>

          {!visits || visits.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              Aún no has registrado ninguna visita a este estadio.
            </p>
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  onEdit={() => router.push(`/estadios/${id}/visita/${visit.id}/editar`)}
                  onDelete={() => deleteVisit(visit.id)}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
