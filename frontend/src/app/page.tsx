"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-700 to-green-600 px-4 py-24 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tu historial de estadios,
          <br />
          siempre contigo.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-green-100">
          Registra cada partido y tour que hayas vivido en estadios de fútbol de todo el mundo. Guarda tus recuerdos, sigue tu progreso por ligas y revive cada visita.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-green-700 shadow hover:bg-green-50"
              >
                Mi panel
              </Link>
              <Link
                href="/estadios"
                className="rounded-xl border border-white/40 px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                Explorar estadios
              </Link>
            </>
          ) : !isLoading ? (
            <>
              <Link
                href="/register"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-green-700 shadow hover:bg-green-50"
              >
                Empezar gratis
              </Link>
              <Link
                href="/estadios"
                className="rounded-xl border border-white/40 px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                Explorar estadios
              </Link>
            </>
          ) : null}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-12">
          Todo lo que necesitas para tu diario futbolero
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: "⚽",
              title: "Registra partidos y tours",
              desc: "Anota el marcador, el equipo rival, tus impresiones del tour guiado y mucho más.",
            },
            {
              icon: "📊",
              title: "Sigue tu progreso",
              desc: "Consulta cuántos estadios has visitado por liga, país o continente.",
            },
            {
              icon: "🗺️",
              title: "Mapa de visitas",
              desc: "Visualiza en el mapa todos los estadios que has pisado alrededor del mundo.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — only shown when not logged in */}
      {!isLoading && !isAuthenticated && (
        <section className="bg-green-50 border-t border-green-100 px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">¿Listo para empezar?</h2>
          <p className="mt-3 text-gray-500">
            Crea tu cuenta gratis y empieza a registrar tus visitas hoy mismo.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700"
          >
            Crear cuenta
          </Link>
        </section>
      )}
    </div>
  );
}
