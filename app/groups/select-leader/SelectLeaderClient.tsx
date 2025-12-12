// app/groups/select-leader/SelectLeaderClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LeaderSummary {
  id: string;
  name: string;
  email: string;
  disciplesCount: number;
}

interface SelectLeaderClientProps {
  leaders: LeaderSummary[];
  currentLeaderId: string | null;
}

export function SelectLeaderClient({
  leaders,
  currentLeaderId,
}: SelectLeaderClientProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(
    currentLeaderId
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSelect(leaderId: string) {
    setError(null);
    setMessage(null);
    setLoadingId(leaderId);

    try {
      const res = await fetch("/api/groups/select-leader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leaderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível selecionar o líder.");
      } else {
        setSelectedLeaderId(leaderId);
        setMessage(data.message ?? "Líder selecionado com sucesso.");
        // Revalida dados em server components (menu, dashboards, etc)
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Erro de comunicação com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-amber-300">
          Escolher líder / grupo
        </h1>
        <p className="text-sm text-gray-300">
          Selecione um líder para acompanhar sua jornada de leitura, oração e
          encontros. Você pode alterar essa escolha quando for necessário.
        </p>
      </header>

      {message && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-900/30 px-3 py-2 text-sm text-emerald-100">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-900/30 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      {leaders.length === 0 ? (
        <p className="text-sm text-gray-400">
          Ainda não há líderes cadastrados. Fale com a liderança da igreja para
          configurar os líderes no sistema.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => {
            const isCurrent = selectedLeaderId === leader.id;
            const isLoading = loadingId === leader.id;

            return (
              <button
                key={leader.id}
                type="button"
                onClick={() => handleSelect(leader.id)}
                disabled={isLoading}
                className={`group flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition
                  ${
                    isCurrent
                      ? "border-amber-400 bg-amber-950/40"
                      : "border-white/10 bg-white/5 hover:border-amber-400/70 hover:bg-amber-950/20"
                  }
                  ${isLoading ? "opacity-70" : ""}`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">
                    {leader.name}
                  </span>

                  {isCurrent && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Meu líder
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-300">{leader.email}</p>

                <p className="mt-2 text-[11px] text-gray-400">
                  Acompanha {leader.disciplesCount} membro(s).
                </p>

                <span className="mt-3 inline-flex items-center text-[11px] font-medium text-amber-200 opacity-90">
                  {isLoading
                    ? "Atualizando..."
                    : isCurrent
                    ? "Líder atual"
                    : "Escolher como líder"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
