"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatters";
import { ApiError } from "@/services/apiClient";

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilContent />
    </ProtectedRoute>
  );
}

function PerfilContent() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    updateMutation.mutate({ email });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Mi perfil</h1>

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
              onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
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
