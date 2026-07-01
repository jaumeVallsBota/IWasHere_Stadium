import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IWasHere — Estadios",
  description: "Registra y gestiona tu historial de visitas a estadios de fútbol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${inter.className} flex min-h-full flex-col bg-gray-50 text-gray-900 antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} IWasHere · Todos los derechos reservados
          </footer>
        </Providers>
      </body>
    </html>
  );
}
