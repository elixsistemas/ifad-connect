"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

type AppRole = "MEMBER" | "LEADER" | "ADMIN";

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const { data: session, status } = useSession();

  // garante boolean puro
  const isAuth: boolean = status === "authenticated" && !!session?.user;
  const role = (session?.user as any)?.role as AppRole | undefined;

  // em algumas tipagens o pathname pode ser null → protege
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "";

  const isPanelRoute =
    pathname.startsWith("/member") ||
    pathname.startsWith("/leader") ||
    pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      {/* topo */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {!isAuth && (
            <>
              <Link
                href="/login"
                className="text-gray-200 hover:text-amber-300 transition"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition"
              >
                Criar conta
              </Link>
            </>
          )}

          {isAuth && (
            <>
              {isPanelRoute ? (
                <Link href="/" className="hover:text-amber-300 transition">
                  Início
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="hover:text-amber-300 transition"
                >
                  Painel
                </Link>
              )}

              {role === "ADMIN" && (
                <Link
                  href="/admin/users"
                  className="hover:text-amber-300 transition"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-white/20 px-4 py-1.5 text-xs hover:border-amber-400 hover:text-amber-300"
              >
                Sair
              </button>
            </>
          )}
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

export default AppLayout;
