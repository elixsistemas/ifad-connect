// app/planos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BrandBadge } from "@/app/components/BrandBadge";
import { listReadingPlanDefinitions } from "@/app/lib/readingPlans";

export const metadata: Metadata = {
  title: "Planos de leitura – IFAD Connect",
  description:
    "Escolha um plano de leitura bíblica e acompanhe seu progresso com o IFAD Connect.",
};

export const revalidate = 60;

export default async function ReadingPlansPage() {
  const plans = await listReadingPlanDefinitions();

  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* topo */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <BrandBadge />
          <nav className="text-xs flex flex-col items-end gap-1">
            <Link
              href="/"
              className="text-gray-300 hover:text-amber-300 transition"
            >
              Voltar para o início
            </Link>
            <Link
              href="/meus-planos"
              className="text-gray-400 hover:text-amber-300 transition"
            >
              Meus planos
            </Link>
          </nav>
        </header>

        {/* texto de abertura */}
        <section className="mb-6 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400">
            Planos de leitura
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Caminhos para permanecer na Palavra
          </h1>
          <p className="text-sm text-gray-200 max-w-2xl">
            Escolha um plano que faça sentido para a sua fase. Cada jornada
            tem duração definida, referências bíblicas e, em alguns casos,
            devocionais conectados.
          </p>
        </section>

        {/* lista de planos - estilo Bible App */}
        <section className="space-y-4">
          {plans.map((plan) => (
            <Link
              key={plan.slug}
              href={`/planos/${plan.slug}`}
              className="block rounded-3xl border border-white/10 bg-black/40 hover:bg-black/70 hover:border-amber-400 transition shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                {/* “thumbnail” do plano */}
                <div className="md:w-44 flex-shrink-0 p-4 flex md:flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-500/80 via-amber-600/70 to-slate-950">
                  <div className="h-14 w-14 rounded-2xl bg-black/20 border border-amber-200/40 flex flex-col items-center justify-center text-center text-[10px] font-semibold text-amber-50 shadow-inner">
                    <span className="text-xs font-bold">
                      {plan.durationDays}
                    </span>
                    <span className="text-[9px] uppercase tracking-wide">
                      {plan.durationDays === 1 ? "Dia" : "Dias"}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col text-[10px] text-amber-50">
                    <span className="uppercase tracking-[0.22em]">
                      Plano
                    </span>
                    <span className="opacity-80">
                      {plan.audience || "Para qualquer etapa da fé"}
                    </span>
                  </div>
                </div>

                {/* conteúdo principal do card */}
                <div className="flex-1 p-4 md:p-5 flex flex-col gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base md:text-lg font-semibold text-gray-50">
                      {plan.title}
                    </h2>
                    {plan.highlight && (
                      <p className="text-xs text-amber-200">
                        {plan.highlight}
                      </p>
                    )}
                    <p className="text-xs md:text-sm text-gray-300">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-black/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      {plan.durationDays}{" "}
                      {plan.durationDays === 1 ? "dia" : "dias"}
                    </span>
                    {plan.audience && (
                      <span className="inline-flex px-2 py-0.5 rounded-full border border-white/10 bg-black/30">
                        {plan.audience}
                      </span>
                    )}
                    <span className="inline-flex px-2 py-0.5 rounded-full border border-white/10 bg-black/30">
                      Estrutura: {plan.days.length}{" "}
                      {plan.days.length === 1 ? "etapa" : "etapas"}
                    </span>
                  </div>

                  {/* CTA inferior */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-[11px] text-gray-400">
                      Toque para ver a estrutura do plano, devocionais ligados
                      e iniciar a jornada.
                    </p>
                    <span className="text-[11px] text-amber-300 font-semibold">
                      Ver plano →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {plans.length === 0 && (
            <p className="text-sm text-gray-300">
              Em breve você encontrará planos de leitura publicados aqui.
            </p>
          )}
        </section>

        <footer className="mt-8 text-[11px] text-gray-500">
          Em todos os planos, mantenha a Bíblia aberta, o coração sensível e
          a mente disposta a obedecer.
        </footer>
      </div>
    </main>
  );
}
