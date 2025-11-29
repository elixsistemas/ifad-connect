// app/register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao registrar");
      } else {
        setSuccess("Conta criada! Agora você já pode entrar.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Erro de comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-2 rounded-full border border-amber-400/40">
              <Image
                src="/ifad-logo.png"
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
                Crie sua conta e comece a jornada
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/80 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 px-8 py-7 space-y-5 backdrop-blur"
        >
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta
            </h1>
            <p className="text-xs text-slate-400">
              Use um e-mail que você acesse com frequência
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Nome
              </label>
              <input
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-300 transition shadow-md shadow-amber-500/30"
          >
            {loading ? "Salvando..." : "Criar conta"}
          </button>

          <div className="pt-1 text-center text-xs text-slate-400">
            <span>Já tem conta? </span>
            <Link
              href="/login"
              className="font-semibold text-amber-300 hover:text-amber-200 underline-offset-4 hover:underline"
            >
              Voltar para login
            </Link>
          </div>
        </form>

        <p className="mt-4 text-[11px] text-center text-slate-500">
          IFAD &mdash; servindo quem serve.
        </p>
      </div>
    </main>
  );
}
