"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VisitForm } from "@/components/VisitForm";
import { useStadium } from "@/hooks/useStadiums";
import { useCreateVisit } from "@/hooks/useVisits";
import type { VisitCreate } from "@/types";

export default function NuevaVisitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <NuevaVisitaForm stadiumId={id} />
    </ProtectedRoute>
  );
}

function NuevaVisitaForm({ stadiumId }: { stadiumId: string }) {
  const router = useRouter();
  const { data: stadium } = useStadium(stadiumId);
  const { mutateAsync, isPending } = useCreateVisit(stadiumId);

  async function handleSubmit(data: VisitCreate) {
    await mutateAsync(data);
    router.push(`/estadios/${stadiumId}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        href={`/estadios/${stadiumId}`}
        className="text-sm text-green-700 hover:underline"
      >
        ← {stadium?.name ?? "Estadio"}
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-gray-800 mb-6">Registrar visita</h1>

      <VisitForm
        stadiumCurrentTeam={stadium?.current_team}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
