"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      {/* topo */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 text-lg font-semibold">
            IF
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
              IFAD CONNECT
            </p>
            <p className="text-sm text-gray-300">
              Jornada de leitura e devoção
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-amber-300">
            Painel
          </Link>
          <Link href="/admin" className="hover:text-amber-300">
            Admin
          </Link>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs hover:border-amber-400 hover:text-amber-300"
            >
              Sair
            </button>
          </form>
        </nav>
      </header>

      {/* conteúdo */}
      <main className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-black/40 border border-white/10 shadow-xl p-6">
            {children}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        IFAD — Inspiração, Palavra e Caminho.
      </footer>
    </div>
  );
}
