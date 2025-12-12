// app/member/PrayerRequestForm.tsx
"use client";

import { useState } from "react";

export function PrayerRequestForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.error || "Não foi possível enviar seu pedido agora.";
        setError(msg);
        return;
      }

      setFeedback("Pedido enviado com sucesso. Seu líder poderá acompanhá-lo.");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Erro de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabled =
    isSubmitting ||
    subject.trim().length < 3 ||
    message.trim().length < 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-300">
          Assunto
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          placeholder="Ex: fortalecimento espiritual, família, saúde..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-300">
          Mensagem
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          placeholder="Compartilhe detalhes para que possamos orar com entendimento."
        />
        <p className="mt-1 text-[11px] text-gray-500">
          Mínimo: 3 caracteres para o assunto e 10 para a mensagem.
        </p>
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
        {isSubmitting ? "Enviando..." : "Enviar pedido"}
      </button>
    </form>
  );
}
