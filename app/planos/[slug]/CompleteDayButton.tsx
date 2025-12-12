// app/planos/[slug]/CompleteDayButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CompleteDayButtonProps {
  runId: string;
  currentDay: number;
  totalDays?: number | null;
}

export function CompleteDayButton({
  runId,
  currentDay,
  totalDays,
}: CompleteDayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const nextDay =
        totalDays && currentDay + 1 > totalDays
          ? totalDays
          : currentDay + 1;

      const res = await fetch("/api/reading-plans/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, nextDay }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Não foi possível atualizar o progresso.");
      } else {
        setFeedback(
          data.status === "COMPLETED"
            ? "Plano concluído! 🙌"
            : `Dia ${data.currentDay} registrado.`
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

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="text-xs rounded-full bg-emerald-500 text-slate-950 px-3 py-1 font-semibold hover:bg-emerald-400 disabled:opacity-60 transition"
      >
        {loading ? "Salvando..." : "Concluir dia"}
      </button>
      {feedback && (
        <p className="text-[10px] text-emerald-300">{feedback}</p>
      )}
      {error && (
        <p className="text-[10px] text-rose-400">{error}</p>
      )}
    </div>
  );
}
