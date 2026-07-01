"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCreateStadium } from "@/hooks/useStadiums";
import { ApiError } from "@/services/apiClient";
import type { StadiumCreate } from "@/types";

export default function NuevoEstadioPage() {
  return (
    <ProtectedRoute>
      <NuevoEstadioForm />
    </ProtectedRoute>
  );
}

function NuevoEstadioForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateStadium();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [yearOpened, setYearOpened] = useState("");
  const [currentTeam, setCurrentTeam] = useState("");
  const [history, setHistory] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      setError("Las coordenadas deben ser números válidos.");
      return;
    }

    const data: StadiumCreate = {
      name,
      city,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      capacity: capacity ? parseInt(capacity, 10) : null,
      year_opened: yearOpened ? parseInt(yearOpened, 10) : null,
      current_team: currentTeam || null,
      history: history || null,
    };

    try {
      const created = await mutateAsync(data);
      router.push(`/estadios/${created.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail : "Ha ocurrido un error inesperado.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Añadir estadio</h1>
      <p className="text-sm text-gray-500 mb-6">
        El estadio quedará visible solo para ti hasta que sea aprobado.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <input
              id="country"
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
              Latitud *
            </label>
            <input
              id="lat"
              type="text"
              required
              placeholder="40.4530"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
              Longitud *
            </label>
            <input
              id="lng"
              type="text"
              required
              placeholder="-3.6883"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Aforo
            </label>
            <input
              id="capacity"
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="yearOpened" className="block text-sm font-medium text-gray-700 mb-1">
              Año de inauguración
            </label>
            <input
              id="yearOpened"
              type="number"
              min={1800}
              max={new Date().getFullYear()}
              value={yearOpened}
              onChange={(e) => setYearOpened(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="currentTeam" className="block text-sm font-medium text-gray-700 mb-1">
            Equipo actual
          </label>
          <input
            id="currentTeam"
            type="text"
            value={currentTeam}
            onChange={(e) => setCurrentTeam(e.target.value)}
            placeholder="FC Barcelona"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="history" className="block text-sm font-medium text-gray-700 mb-1">
            Historia
          </label>
          <textarea
            id="history"
            rows={4}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Breve historia del estadio…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {isPending ? "Enviando…" : "Añadir estadio"}
        </button>
      </form>
    </div>
  );
}
