"use client";

import { useState } from "react";
import type { TourGuideQuality, TourImpression, VisitCreate, VisitType } from "@/types";
import { StarRating } from "./StarRating";
import { ApiError } from "@/services/apiClient";

interface VisitFormProps {
  stadiumCurrentTeam?: string | null;
  initialData?: Partial<VisitCreate>;
  onSubmit: (data: VisitCreate) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

const IMPRESSIONS: TourImpression[] = ["Muy bueno", "Bueno", "Normal", "Malo"];
const GUIDE_QUALITY: TourGuideQuality[] = ["Excelente", "Bueno", "Regular", "Sin guía"];

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function VisitForm({
  stadiumCurrentTeam,
  initialData,
  onSubmit,
  submitLabel = "Guardar visita",
  isLoading = false,
}: VisitFormProps) {
  const [visitType, setVisitType] = useState<VisitType>(
    initialData?.visit_type ?? "matchday",
  );
  const [date, setDate] = useState(initialData?.date ?? today());
  const [homeTeam, setHomeTeam] = useState(
    initialData?.match_home_team ?? stadiumCurrentTeam ?? "",
  );
  const [awayTeam, setAwayTeam] = useState(initialData?.match_away_team ?? "");
  const [competition, setCompetition] = useState(initialData?.match_competition ?? "");
  const [score, setScore] = useState(initialData?.match_score ?? "");
  const [impression, setImpression] = useState<TourImpression | "">(
    initialData?.tour_overall_impression ?? "",
  );
  const [highlights, setHighlights] = useState(initialData?.tour_highlights ?? "");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(
    initialData?.tour_would_recommend ?? null,
  );
  const [guideQuality, setGuideQuality] = useState<TourGuideQuality | "">(
    initialData?.tour_guide_quality ?? "",
  );
  const [duration, setDuration] = useState(
    initialData?.tour_duration_minutes?.toString() ?? "",
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [rating, setRating] = useState<number | null>(initialData?.rating ?? null);
  const [error, setError] = useState<string | null>(null);

  const isMatchday = visitType === "matchday";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("La fecha es obligatoria.");
      return;
    }
    if (visitType === "tour" && !impression) {
      setError("La impresión general es obligatoria para tours.");
      return;
    }

    const data: VisitCreate = {
      visit_type: visitType,
      date,
      ...(isMatchday
        ? {
            match_home_team: homeTeam || null,
            match_away_team: awayTeam || null,
            match_competition: competition || null,
            match_score: score || null,
          }
        : {
            tour_overall_impression: impression as TourImpression,
            tour_highlights: highlights || null,
            tour_would_recommend: wouldRecommend,
            tour_guide_quality: (guideQuality as TourGuideQuality) || null,
            tour_duration_minutes: duration ? parseInt(duration, 10) : null,
          }),
      notes: notes || null,
      rating: rating,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Ha ocurrido un error inesperado.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Visit type selector */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Tipo de visita</p>
        <div className="grid grid-cols-2 gap-3">
          {(["matchday", "tour"] as VisitType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVisitType(type)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                visitType === type
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="block text-2xl mb-1">
                {type === "matchday" ? "⚽" : "🏟"}
              </span>
              <span className="block font-semibold text-gray-800">
                {type === "matchday" ? "Partido" : "Tour"}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {type === "matchday"
                  ? "Asistí a un partido"
                  : "Hice una visita guiada"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha *
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* Matchday fields */}
      {isMatchday && (
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700">Detalles del partido</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="homeTeam" className="block text-sm font-medium text-gray-700 mb-1">
                Equipo local
              </label>
              <input
                id="homeTeam"
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="FC Barcelona"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="awayTeam" className="block text-sm font-medium text-gray-700 mb-1">
                Equipo visitante
              </label>
              <input
                id="awayTeam"
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Real Madrid"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="competition" className="block text-sm font-medium text-gray-700 mb-1">
                Competición
              </label>
              <input
                id="competition"
                type="text"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                placeholder="La Liga"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                Resultado
              </label>
              <input
                id="score"
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="2–1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Tour fields */}
      {!isMatchday && (
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700">Detalles del tour</legend>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Impresión general *
            </p>
            <div className="flex flex-wrap gap-2">
              {IMPRESSIONS.map((imp) => (
                <button
                  key={imp}
                  type="button"
                  onClick={() => setImpression(imp)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    impression === imp
                      ? "border-green-500 bg-green-100 text-green-800"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {imp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué fue lo mejor del tour?
            </label>
            <textarea
              id="highlights"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">¿Lo recomiendas?</p>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setWouldRecommend(val)}
                  className={`rounded-full border px-4 py-1 text-sm transition ${
                    wouldRecommend === val
                      ? "border-green-500 bg-green-100 text-green-800"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {val ? "Sí" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="guideQuality" className="block text-sm font-medium text-gray-700 mb-1">
                Calidad del guía
              </label>
              <select
                id="guideQuality"
                value={guideQuality}
                onChange={(e) => setGuideQuality(e.target.value as TourGuideQuality | "")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="">—</option>
                {GUIDE_QUALITY.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duración (min)
              </label>
              <input
                id="duration"
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="90"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Shared fields */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notas personales
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Escribe aquí tus impresiones, recuerdos…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Puntuación general</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {isLoading ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
