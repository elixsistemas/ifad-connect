// app/lib/readingPlansWithProgress.ts
import { prisma } from "@/app/lib/prisma";
import {
  getReadingPlans,
  getReadingPlanBySlug,
  ReadingPlan,
} from "./strapi/readingPlans";
import { ReadingPlanRun, ReadingPlanStatus } from "@prisma/client";

/**
 * DTO para devolver plano + progresso resumido para a UI
 */
export interface ReadingPlanWithProgress extends ReadingPlan {
  progressSummary?: {
    activeRun?: {
      id: string;
      iteration: number;
      status: ReadingPlanStatus;
      currentDay: number;
      totalDays: number | null;
      startedAt: string;
      completedAt: string | null;
    };
    totalRuns: number;
    completedRuns: number;
  };
}

/**
 * Lista planos do Strapi + agrega progressos do usuário (para tela /meus-planos)
 */
export async function getReadingPlansForUser(
  userId: string
): Promise<ReadingPlanWithProgress[]> {
  const [plans, runs] = await Promise.all([
    getReadingPlans(),
    prisma.readingPlanRun.findMany({
      where: { userId },
      orderBy: [{ startedAt: "desc" }],
    }),
  ]);

  return plans.map((plan) => {
    const runsForPlan = runs.filter((r) => r.planSlug === plan.slug);

    const activeRun = runsForPlan.find(
      (r) => r.status === ReadingPlanStatus.IN_PROGRESS
    );

    const completedRuns = runsForPlan.filter(
      (r) => r.status === ReadingPlanStatus.COMPLETED
    );

    return {
      ...plan,
      progressSummary: {
        activeRun: activeRun
          ? {
              id: activeRun.id,
              iteration: activeRun.iteration,
              status: activeRun.status,
              currentDay: activeRun.currentDay,
              totalDays: activeRun.totalDays ?? null,
              startedAt: activeRun.startedAt.toISOString(),
              completedAt: activeRun.completedAt?.toISOString() ?? null,
            }
          : undefined,
        totalRuns: runsForPlan.length,
        completedRuns: completedRuns.length,
      },
    };
  });
}

/**
 * Um plano específico + progresso detalhado do usuário
 * – perfeito para /planos/[slug]
 */
export async function getReadingPlanDetailForUser(
  userId: string,
  slug: string
): Promise<ReadingPlanWithProgress | null> {
  const [plan, runsForPlan] = await Promise.all([
    getReadingPlanBySlug(slug),
    prisma.readingPlanRun.findMany({
      where: { userId, planSlug: slug },
      orderBy: [{ startedAt: "desc" }],
    }),
  ]);

  if (!plan) return null;

  const activeRun = runsForPlan.find(
    (r) => r.status === ReadingPlanStatus.IN_PROGRESS
  );
  const completedRuns = runsForPlan.filter(
    (r) => r.status === ReadingPlanStatus.COMPLETED
  );

  return {
    ...plan,
    progressSummary: {
      activeRun: activeRun
        ? {
            id: activeRun.id,
            iteration: activeRun.iteration,
            status: activeRun.status,
            currentDay: activeRun.currentDay,
            totalDays: activeRun.totalDays ?? null,
            startedAt: activeRun.startedAt.toISOString(),
            completedAt: activeRun.completedAt?.toISOString() ?? null,
          }
        : undefined,
      totalRuns: runsForPlan.length,
      completedRuns: completedRuns.length,
    },
  };
}
