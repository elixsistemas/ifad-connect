// app/planos/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getReadingPlanDefinitionBySlug,
  getActiveRunForPlan,
} from "@/app/lib/readingPlans";
import { BrandBadge } from "@/app/components/BrandBadge";
import { PlanDetailClient } from "./PlanDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const plan = getReadingPlanDefinitionBySlug(slug);

  if (!plan) {
    return {
      title: "Plano não encontrado – IFAD Connect",
    };
  }

  return {
    title: `${plan.title} – Plano de leitura`,
    description: plan.description,
  };
}

export const revalidate = 60;

export default async function ReadingPlanDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const plan = getReadingPlanDefinitionBySlug(slug);
  if (!plan) {
    return notFound();
  }

  const session = await getServerSession(authOptions);
  const isLogged = !!session;
  const userId = (session?.user as any)?.id as string | undefined;

  let safeRun: {
    id: string;
    currentDay: number;
    status: string;
    totalDays: number | null;
  } | null = null;

  if (userId) {
    const activeRun = await getActiveRunForPlan(userId, slug);
    if (activeRun) {
      safeRun = {
        id: activeRun.id,
        currentDay: activeRun.currentDay,
        status: activeRun.status,
        totalDays: activeRun.totalDays,
      };
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* topo */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <BrandBadge />
          <nav className="text-xs flex items-center gap-3">
            <Link
              href="/planos"
              className="text-gray-300 hover:text-amber-300 transition"
            >
              ← Voltar para planos
            </Link>
            <Link
              href="/biblia"
              className="text-gray-400 hover:text-amber-300 transition"
            >
              Leitura bíblica
            </Link>
          </nav>
        </header>

        {/* título e resumo + card interativo */}
        <section className="mb-6 grid gap-6 md:grid-cols-[3fr,2fr] items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400 mb-1">
              Plano de leitura
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {plan.title}
            </h1>
            {plan.highlight && (
              <p className="text-sm text-amber-200 mb-2">
                {plan.highlight}
              </p>
            )}
            <p className="text-sm text-gray-200 mb-2">
              {plan.description}
            </p>
            <p className="text-xs text-gray-400">
              Duração:{" "}
              <span className="font-semibold">
                {plan.durationDays} dias
              </span>
              {plan.audience ? ` · Para: ${plan.audience}` : null}
            </p>
          </div>

          <PlanDetailClient
            planSlug={plan.slug}
            durationDays={plan.durationDays}
            days={plan.days}
            initialRun={safeRun}
            isLogged={isLogged}
          />
        </section>

        {/* dias do plano (visão geral) */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold mb-3 text-gray-100">
            Estrutura do plano
          </h2>

          <div className="space-y-2 text-sm">
            {plan.days.map((day) => (
              <div
                key={day.dayNumber}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              >
                <div className="mt-0.5 h-6 w-6 rounded-full border border-amber-400 text-[11px] flex items-center justify-center text-amber-300">
                  {day.dayNumber}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-100 text-xs md:text-sm">
                    {day.title}
                  </p>
                  <p className="text-[11px] text-amber-200">
                    Leitura: {day.readingRef}
                  </p>
                  {day.devotionalSlug && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Devocional ligado:{" "}
                      <Link
                        href={`/devocionais/${day.devotionalSlug}`}
                        className="underline underline-offset-4 text-amber-300 hover:text-amber-200"
                      >
                        abrir devocional
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-gray-500">
            A seleção de dias e o botão de marcar concluído estão no card ao
            lado, para facilitar a jornada diária.
          </p>
        </section>
      </div>
    </main>
  );
}
