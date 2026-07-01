"use client";

import { useState } from "react";
import Link from "next/link";
import { useStadiums } from "@/hooks/useStadiums";
import { useAuth } from "@/hooks/useAuth";
import { StadiumCard } from "@/components/StadiumCard";
import { SearchFilters } from "@/components/SearchFilters";
import type { StadiumSearchParams } from "@/types";

export default function EstadiosPage() {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useState<StadiumSearchParams>({ limit: 20 });
  const { data: stadiums, isLoading, error } = useStadiums(params);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estadios</h1>
        {isAuthenticated && (
          <Link
            href="/estadios/nuevo"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + Añadir estadio
          </Link>
        )}
      </div>

      <SearchFilters onSearch={setParams} isLoading={isLoading} />

      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Error al cargar estadios. Inténtalo de nuevo.
          </p>
        )}

        {!isLoading && stadiums && stadiums.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No se encontraron estadios con esos filtros.</p>
            {isAuthenticated && (
              <Link
                href="/estadios/nuevo"
                className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                Añadir estadio
              </Link>
            )}
          </div>
        )}

        {stadiums && stadiums.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {stadiums.map((s) => (
              <StadiumCard key={s.id} stadium={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
