"use client";

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useDashboard, useMapPins } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { LeagueProgressBar } from "@/components/LeagueProgress";
import { StadiumMap } from "@/components/StadiumMap";
import { StadiumCard } from "@/components/StadiumCard";
import { formatDate, formatVisitType } from "@/utils/formatters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leagueService as ls } from "@/services/leagueService";
import { userService } from "@/services/userService";
import { ApiError } from "@/services/apiClient";

type Tab = "actividad" | "cuenta";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [tab, setTab] = useState<Tab>("actividad");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Tab switcher */}
      <div className="flex border-b border-gray-200 mb-8">
        {(
          [
            { id: "actividad", label: "📊 Mi actividad" },
            { id: "cuenta", label: "⚙️ Mi cuenta" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "actividad" ? <ActividadTab /> : <CuentaTab />}
    </div>
  );
}

function ActividadTab() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: pins } = useMapPins();
  const queryClient = useQueryClient();

  const { data: allLeagues } = useQuery({
    queryKey: ["leagues"],
    queryFn: ls.list,
  });

  const { data: myLeagues } = useQuery({
    queryKey: ["myLeagues"],
    queryFn: ls.myLeagues,
  });

  const { data: visitedStadiums } = useQuery({
    queryKey: ["visitedStadiums"],
    queryFn: userService.visitedStadiums,
  });

  const leaveLeague = useMutation({
    mutationFn: ls.leave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLeagues"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const joinLeague = useMutation({
    mutationFn: ls.join,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myLeagues"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const myLeagueIds = new Set(myLeagues?.map((l) => l.id) ?? []);
  const availableToJoin = allLeagues?.filter((l) => !myLeagueIds.has(l.id)) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats strip */}
      {dashboard && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Estadios visitados", value: dashboard.total_stadiums_visited },
            { label: "Visitas totales", value: dashboard.total_visit_entries },
            { label: "Países", value: dashboard.countries_covered },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-green-700">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Map */}
      {pins && pins.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Mapa de visitas</h2>
          <StadiumMap pins={pins} />
        </section>
      )}

      {/* Visited stadiums list */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Estadios visitados</h2>
        {!visitedStadiums || visitedStadiums.length === 0 ? (
          <p className="text-sm text-gray-400">
            Aún no has visitado ningún estadio.{" "}
            <Link href="/estadios" className="text-green-700 hover:underline">
              Explorar estadios
            </Link>
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visitedStadiums.map((s) => (
              <StadiumCard key={s.id} stadium={s} />
            ))}
          </div>
        )}
      </section>

      {/* League progress */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Mis ligas</h2>

        {dashboard?.league_progress && dashboard.league_progress.length > 0 ? (
          <div className="space-y-3 mb-4">
            {dashboard.league_progress.map((progress) => (
              <LeagueProgressBar
                key={progress.league_id}
                progress={progress}
                onLeave={() => leaveLeague.mutate(progress.league_id)}
                isLeaving={leaveLeague.isPending}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4">
            No sigues ninguna liga. Selecciona una para ver tu progreso.
          </p>
        )}

        {availableToJoin.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Añadir liga
            </p>
            <div className="flex flex-wrap gap-2">
              {availableToJoin.map((league) => (
                <button
                  key={league.id}
                  onClick={() => joinLeague.mutate(league.id)}
                  disabled={joinLeague.isPending}
                  className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:border-green-500 hover:text-green-700 disabled:opacity-50"
                >
                  + {league.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recent activity */}
      {dashboard?.recent_visits && dashboard.recent_visits.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Actividad reciente</h2>
          <div className="space-y-2">
            {dashboard.recent_visits.map((v) => (
              <Link
                key={v.id}
                href={`/estadios/${v.stadium_id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:border-green-300 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{v.stadium_name}</p>
                  <p className="text-xs text-gray-500">
                    {v.stadium_city} · {formatVisitType(v.visit_type)} · {formatDate(v.date)}
                  </p>
                </div>
                <span className="text-lg">{v.visit_type === "matchday" ? "⚽" : "🏟"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CuentaTab() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: (data: { email?: string }) => userService.updateMe(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["me"], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.detail : "Error al guardar.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    updateMutation.mutate({ email });
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Información de cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {user?.created_at && (
            <p className="text-xs text-gray-400">
              Cuenta creada el {formatDate(user.created_at)}
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {saved && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              ✓ Cambios guardados
            </p>
          )}

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {updateMutation.isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Sesión
        </h2>
        <button
          onClick={() => logout()}
          className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
