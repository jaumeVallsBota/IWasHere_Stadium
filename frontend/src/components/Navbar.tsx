"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700 text-lg">
          🏟 IWasHere
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link href="/estadios" className="text-gray-600 hover:text-gray-900">
            Estadios
          </Link>
          {!isLoading && isAuthenticated && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Mi panel
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-green-600 px-3 py-1.5 text-white hover:bg-green-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          <span className="block h-0.5 w-5 bg-gray-700 mb-1" />
          <span className="block h-0.5 w-5 bg-gray-700 mb-1" />
          <span className="block h-0.5 w-5 bg-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium sm:hidden">
          <Link href="/estadios" onClick={() => setMenuOpen(false)} className="text-gray-700">
            Estadios
          </Link>
          {!isLoading && isAuthenticated && (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700">
                Mi panel
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="text-left text-gray-700"
              >
                Cerrar sesión
              </button>
            </>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-700">
                Iniciar sesión
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="text-gray-700">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
