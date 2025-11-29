// app/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Branding topo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-2 rounded-full border border-amber-400/40">
              <Image
                src="/ifad-logo.png" // ajuste o caminho se necessário
                alt="IFAD"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/80">
                IFAD Connect
              </p>
              <p className="text-sm text-slate-200">
                Jornada de leitura e devoção
              </p>
            </div>
          </div>
        </div>

        {/* Card de login */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/80 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 px-8 py-7 space-y-5 backdrop-blur"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Entrar
            </h1>
            <p className="text-xs text-slate-400">
              Acesse com sua conta para continuar a leitura
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                E-mail
              </label>
              <input
                type="email"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Senha
              </label>
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-300 transition shadow-md shadow-amber-500/30"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="pt-1 text-center text-xs text-slate-400">
            <span>Não tem conta ainda? </span>
            <Link
              href="/register"
              className="font-semibold text-amber-300 hover:text-amber-200 underline-offset-4 hover:underline"
            >
              Criar cadastro
            </Link>
          </div>
        </form>

        {/* Rodapé discreto */}
        <p className="mt-4 text-[11px] text-center text-slate-500">
          IFAD &mdash; Inspiração, Palavra e Caminho.
        </p>
      </div>
    </main>
  );
}
