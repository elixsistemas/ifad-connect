// app/leader/MeetingForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MeetingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // yyyy-MM-dd
  const [time, setTime] = useState(""); // HH:mm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      if (!date) {
        setError("Selecione uma data.");
        setIsSubmitting(false);
        return;
      }

      const isoString = new Date(`${date}T${time || "19:30"}`).toISOString();

      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          meetingDate: isoString,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error || "Não foi possível registrar o encontro.";
        setError(msg);
        return;
      }

      setFeedback("Encontro registrado com sucesso.");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");

      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Erro de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabled =
    isSubmitting || title.trim().length < 3 || !date.trim().length;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-300">
          Título do encontro
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          placeholder="Ex: Estudo em Mateus 5, Culto no lar..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300">
            Horário
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
          <p className="mt-1 text-[10px] text-gray-500">
            Se vazio, será usado um horário padrão (19:30).
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-300">
          Anotações (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          placeholder="Resumo, pessoas presentes, direcionamentos, testemunhos..."
        />
      </div>

      {feedback && (
        <p className="text-xs text-emerald-300 bg-emerald-500/10 rounded-md px-3 py-2">
          {feedback}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-300 bg-red-500/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Registrando..." : "Registrar encontro"}
      </button>
    </form>
  );
}
