// app/planos/[slug]/PlanDetailClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReadingPlanDay = {
  dayNumber: number;
  title: string;
  readingRef: string;
  devotionalSlug?: string;
  bibleVersion?: string;
  bibleBookAbbrev?: string;
  bibleChapter?: number;
};

type SafeRun = {
  id: string;
  currentDay: number;
  status: string;
  totalDays: number | null;
} | null;

type Props = {
  planSlug: string;
  durationDays: number;
  days: ReadingPlanDay[];
  initialRun: SafeRun;
  isLogged: boolean;
};

export function PlanDetailClient({
  planSlug,
  durationDays,
  days,
  initialRun,
  isLogged,
}: Props) {
  const router = useRouter();
  const [run, setRun] = useState<SafeRun>(initialRun);
  const [selectedDay, setSelectedDay] = useState<number>(
    initialRun?.currentDay || 1
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const totalDays = run?.totalDays ?? durationDays;
  const currentDay = run?.currentDay ?? 0;
  const progressPercent =
    totalDays && totalDays > 0
      ? Math.min(100, Math.round((currentDay / totalDays) * 100))
      : 0;

  const selectedDayDef =
    days.find((d) => d.dayNumber === selectedDay) || days[0] || null;

  async function handleStartPlan() {
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/reading-plans/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planSlug,
            totalDays: durationDays,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(
            data?.error || "Não foi possível iniciar o plano. Tente novamente."
          );
          return;
        }

        const data = await res.json();
        const newRun = data.run;

        setRun({
          id: newRun.id,
          currentDay: newRun.currentDay,
          status: newRun.status,
          totalDays: newRun.totalDays,
        });
        setSelectedDay(newRun.currentDay || 1);
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao iniciar o plano.");
      }
    });
  }

  async function handleMarkDayCompleted() {
    if (!run) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/reading-plans/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            runId: run.id,
            nextDay: selectedDay,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(
            data?.error ||
              "Não foi possível atualizar o progresso. Tente novamente."
          );
          return;
        }

        const data = await res.json();
        const updated = data.run;

        setRun({
          id: updated.id,
          currentDay: updated.currentDay,
          status: updated.status,
          totalDays: updated.totalDays,
        });
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao atualizar o progresso.");
      }
    });
  }

  if (!isLogged) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
          Entre para acompanhar
        </p>
        <p className="text-gray-200 mb-3">
          Você pode visualizar a estrutura do plano livremente. Para acompanhar
          o progresso dia a dia, entre ou crie sua conta.
        </p>
        <a
          href={`/login?callbackUrl=/planos/${planSlug}`}
          className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition"
        >
          Entrar e começar plano
        </a>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
          Começar este plano
        </p>
        <p className="text-gray-200">
          Ao iniciar, o IFAD Connect vai registrar seu progresso dia a dia
          para você acompanhar a jornada.
        </p>
        <button
          type="button"
          onClick={handleStartPlan}
          disabled={isPending}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isPending ? "Iniciando plano..." : "Começar plano agora"}
        </button>
        {error && (
          <p className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  const dayAlreadyDone = selectedDay <= (run.currentDay ?? 0);
  const isCompleted = run.status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm space-y-4">
      {/* status geral */}
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
          Plano em andamento
        </p>
        <p className="text-gray-200">
          Você está no{" "}
          <span className="font-semibold">
            dia {run.currentDay}
            {totalDays ? ` de ${totalDays}` : ""}
          </span>{" "}
          deste plano.
        </p>
        {isCompleted && (
          <p className="text-xs text-emerald-300 mt-1">
            Parabéns! Você concluiu este plano.
          </p>
        )}
        {totalDays > 0 && (
          <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* seleção de dias */}
      <div>
        <p className="text-xs text-gray-300 mb-1">
          Escolha um dia para ver a leitura e marcar o progresso:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {days.map((day) => {
            const isSelected = day.dayNumber === selectedDay;
            const isDone = day.dayNumber <= (run.currentDay ?? 0);

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDay(day.dayNumber)}
                className={[
                  "px-2.5 py-1 rounded-full text-[11px] border transition",
                  isSelected
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : isDone
                    ? "border-emerald-500/50 text-emerald-200 bg-emerald-900/20"
                    : "border-white/15 text-gray-200 bg-black/40 hover:border-amber-300 hover:text-amber-200",
                ].join(" ")}
              >
                Dia {day.dayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* detalhes do dia selecionado */}
      {selectedDayDef && (
        <DayDetail selectedDayDef={selectedDayDef} />
      )}

      {/* ação: marcar como concluído */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleMarkDayCompleted}
          disabled={isPending || dayAlreadyDone || isCompleted}
          className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isCompleted
            ? "Plano concluído"
            : dayAlreadyDone
            ? "Dia já concluído"
            : isPending
            ? "Atualizando..."
            : `Marcar dia ${selectedDay} como concluído`}
        </button>
        {error && (
          <p className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

type DayDetailProps = {
  selectedDayDef: ReadingPlanDay;
};

function DayDetail({ selectedDayDef }: DayDetailProps) {
  const hasStructuredBible =
    !!selectedDayDef.bibleBookAbbrev && !!selectedDayDef.bibleChapter;

  const bibleHref = hasStructuredBible
    ? `/biblia?version=${encodeURIComponent(
        selectedDayDef.bibleVersion ?? "nvi"
      )}&book=${encodeURIComponent(
        selectedDayDef.bibleBookAbbrev!
      )}&chapter=${selectedDayDef.bibleChapter}`
    : `/biblia?ref=${encodeURIComponent(selectedDayDef.readingRef)}`;

  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-1.5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400">
        Dia {selectedDayDef.dayNumber}
      </p>
      <p className="text-sm font-semibold text-gray-100">
        {selectedDayDef.title}
      </p>
      <p className="text-xs text-amber-200">
        Leitura bíblica: {selectedDayDef.readingRef}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
        <Link
          href={bibleHref}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-400/60 text-amber-200 hover:border-amber-300 hover:text-amber-100 transition"
        >
          Abrir leitura bíblica
        </Link>

        {selectedDayDef.devotionalSlug && (
          <span className="text-gray-400">
            · Devocional ligado:{" "}
            <Link
              href={`/devocionais/${selectedDayDef.devotionalSlug}`}
              className="underline underline-offset-4 text-amber-300 hover:text-amber-200"
            >
              abrir devocional
            </Link>
          </span>
        )}
      </div>

      <p className="text-[11px] text-gray-500 mt-1">
        A leitura será aberta na página da Bíblia, já com a referência deste dia.
      </p>
    </div>
  );
}
