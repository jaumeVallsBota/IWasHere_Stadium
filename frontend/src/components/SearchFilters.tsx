"use client";

import { useState } from "react";
import type { StadiumSearchParams } from "@/types";

interface SearchFiltersProps {
  onSearch: (params: StadiumSearchParams) => void;
  isLoading?: boolean;
}

const COUNTRY_FLAGS: { label: string; value: string; flag: string }[] = [
  { label: "Inglaterra", value: "Reino Unido", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { label: "España", value: "España", flag: "🇪🇸" },
  { label: "Italia", value: "Italia", flag: "🇮🇹" },
  { label: "Alemania", value: "Alemania", flag: "🇩🇪" },
  { label: "Francia", value: "Francia", flag: "🇫🇷" },
  { label: "Portugal", value: "Portugal", flag: "🇵🇹" },
  { label: "Países Bajos", value: "Países Bajos", flag: "🇳🇱" },
];

export function SearchFilters({ onSearch, isLoading }: SearchFiltersProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [capacityMin, setCapacityMin] = useState("");
  const [capacityMax, setCapacityMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");

  function toggleCountry(value: string) {
    const next = country === value ? "" : value;
    setCountry(next);
    onSearch(buildParams(next));
  }

  function buildParams(countryOverride?: string): StadiumSearchParams {
    return {
      name: name || undefined,
      city: city || undefined,
      country: (countryOverride !== undefined ? countryOverride : country) || undefined,
      team: team || undefined,
      capacity_min: capacityMin ? parseInt(capacityMin, 10) : undefined,
      capacity_max: capacityMax ? parseInt(capacityMax, 10) : undefined,
      year_min: yearMin ? parseInt(yearMin, 10) : undefined,
      year_max: yearMax ? parseInt(yearMax, 10) : undefined,
    };
  }

  function handleReset() {
    setName("");
    setCity("");
    setCountry("");
    setTeam("");
    setCapacityMin("");
    setCapacityMax("");
    setYearMin("");
    setYearMax("");
    onSearch({});
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(buildParams()); }}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
    >
      {/* Country flags */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">País</p>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_FLAGS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleCountry(c.value)}
              title={c.label}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
                country === c.value
                  ? "border-green-500 bg-green-50 text-green-800 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text filters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del estadio"
          className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:col-span-2"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <input
        type="text"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Equipo local"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="text-xs text-green-700 hover:underline"
      >
        {showAdvanced ? "Ocultar filtros avanzados" : "Filtros avanzados"}
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Aforo mín.</label>
            <input
              type="number"
              value={capacityMin}
              onChange={(e) => setCapacityMin(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Aforo máx.</label>
            <input
              type="number"
              value={capacityMax}
              onChange={(e) => setCapacityMax(e.target.value)}
              placeholder="100000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Año apertura mín.</label>
            <input
              type="number"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              placeholder="1900"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Año apertura máx.</label>
            <input
              type="number"
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value)}
              placeholder="2025"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
        >
          {isLoading ? "Buscando…" : "Buscar"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
