"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface JoinPlanButtonProps {
  planSlug: string;
  totalDays?: number | null;
  hasActiveRun?: boolean;
}

export function JoinPlanButton({
  planSlug,
  totalDays,
  hasActiveRun,
}: JoinPlanButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setFeedback(null);

    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (status === "loading") {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reading-plans/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          totalDays:
            typeof totalDays === "number" && totalDays > 0
              ? totalDays
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Não foi possível salvar seu progresso.");
      } else {
        // pode ter sido criação ou reaproveitamento da run
        setFeedback(
          hasActiveRun
            ? "Seu plano está atualizado."
            : "Plano associado à sua conta."
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  const label =
    status === "unauthenticated"
      ? "Entrar no plano (faça login)"
      : loading
      ? "Salvando..."
      : hasActiveRun
      ? "Continuar plano"
      : "Entrar neste plano";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 text-xs md:text-sm font-semibold 
                   hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {label}
      </button>

      {feedback && (
        <p className="text-[11px] text-emerald-400">{feedback}</p>
      )}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
}
