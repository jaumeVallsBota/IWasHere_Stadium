"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VisitForm } from "@/components/VisitForm";
import { useStadium } from "@/hooks/useStadiums";
import { useVisit, useUpdateVisit } from "@/hooks/useVisits";
import type { VisitCreate } from "@/types";

export default function EditarVisitaPage({
  params,
}: {
  params: Promise<{ id: string; visitId: string }>;
}) {
  const { id, visitId } = use(params);
  return (
    <ProtectedRoute>
      <EditarVisitaForm stadiumId={id} visitId={visitId} />
    </ProtectedRoute>
  );
}

function EditarVisitaForm({
  stadiumId,
  visitId,
}: {
  stadiumId: string;
  visitId: string;
}) {
  const router = useRouter();
  const { data: stadium } = useStadium(stadiumId);
  const { data: visit, isLoading } = useVisit(visitId);
  const { mutateAsync, isPending } = useUpdateVisit(visitId, stadiumId);

  async function handleSubmit(data: VisitCreate) {
    await mutateAsync(data);
    router.push(`/estadios/${stadiumId}`);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-gray-500">Visita no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        href={`/estadios/${stadiumId}`}
        className="text-sm text-green-700 hover:underline"
      >
        ← {stadium?.name ?? "Estadio"}
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-gray-800 mb-6">Editar visita</h1>

      <VisitForm
        stadiumCurrentTeam={stadium?.current_team}
        initialData={visit}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        isLoading={isPending}
      />
    </div>
  );
}
