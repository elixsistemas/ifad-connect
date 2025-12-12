// app/lib/readingPlans.ts
import { prisma } from "@/app/lib/prisma";
import { ReadingPlanStatus } from "@prisma/client";

export type ReadingPlanDay = {
  dayNumber: number;
  title: string;
  readingRef: string; // texto humano (“Salmo 13”)
  devotionalSlug?: string;

  // dados estruturados para chamar getChapter / montar URL
  bibleVersion?: string; // ex: "nvi"
  bibleBookAbbrev?: string; // ex: "sl", "fp", "jo"
  bibleChapter?: number; // ex: 13
};

export type ReadingPlanDefinition = {
  slug: string;
  title: string;
  description: string;
  durationDays: number;
  highlight?: string;
  bannerImage?: string;
  audience?: string;
  days: ReadingPlanDay[];
};

// Catálogo local de planos.
// IMPORTANTE: inclui o slug "reading-plan", que aparece em /meus-planos.
const READING_PLANS: ReadingPlanDefinition[] = [
  {
    slug: "reading-plan",
    title: "Uma fé que persevera",
    description:
      "Um plano curto, de 1 dia, para lembrar que a fé não é ausência de luta, mas perseverança em meio a ela.",
    durationDays: 1,
    highlight:
      "Para quando você precisa de um recomeço rápido e um empurrão de esperança.",
    bannerImage: "/planos/uma-fe-que-persevera.jpg",
    audience:
      "Quem está recomeçando a leitura bíblica ou passando por dias difíceis.",
    days: [
      {
        dayNumber: 1,
        title: "Uma fé que persevera",
        readingRef: "Hebreus 10.35–39",
        // Devocional opcional
        // devotionalSlug: "quando-o-dia-comeca-pesado",
        bibleVersion: "nvi",
        bibleBookAbbrev: "hb",
        bibleChapter: 10,
      },
    ],
  },
  {
    slug: "caminho-de-emaus",
    title: "Caminho de Emaús",
    description:
      "Um plano de 7 dias para caminhar com Jesus pelas Escrituras, ligando coração, mente e prática diária.",
    durationDays: 7,
    highlight:
      "Inspirado na jornada dos discípulos a caminho de Emaús: o coração que arde enquanto Ele fala.",
    bannerImage: "/planos/caminho-de-emaus.jpg",
    audience: "Qualquer pessoa que deseja retomar a leitura bíblica de forma guiada.",
    days: [
      {
        dayNumber: 1,
        title: "Quando o dia começa pesado",
        readingRef: "Filipenses 4.4–7",
        devotionalSlug: "quando-o-dia-comeca-pesado",
        bibleVersion: "nvi",
        bibleBookAbbrev: "fp",
        bibleChapter: 4,
      },
      {
        dayNumber: 2,
        title: "Quando Deus parece em silêncio",
        readingRef: "Salmo 13",
        devotionalSlug: "quando-deus-parece-em-silencio",
        bibleVersion: "nvi",
        bibleBookAbbrev: "sl",
        bibleChapter: 13,
      },
      {
        dayNumber: 3,
        title: "Nascer de novo",
        readingRef: "João 3.1–8",
        devotionalSlug: "nascer-de-novo",
        bibleVersion: "nvi",
        bibleBookAbbrev: "jo",
        bibleChapter: 3,
      },
      {
        dayNumber: 4,
        title: "Caminhando com Jesus nas dúvidas",
        readingRef: "Lucas 24.13–35",
        bibleVersion: "nvi",
        bibleBookAbbrev: "lc",
        bibleChapter: 24,
      },
      {
        dayNumber: 5,
        title: "Quando o coração queima pela Palavra",
        readingRef: "Jeremias 15.16",
        bibleVersion: "nvi",
        bibleBookAbbrev: "jr",
        bibleChapter: 15,
      },
      {
        dayNumber: 6,
        title: "Abrindo os olhos na mesa",
        readingRef: "Apocalipse 3.20",
        bibleVersion: "nvi",
        bibleBookAbbrev: "ap",
        bibleChapter: 3,
      },
      {
        dayNumber: 7,
        title: "Voltando para a missão",
        readingRef: "Atos 1.6–11",
        bibleVersion: "nvi",
        bibleBookAbbrev: "at",
        bibleChapter: 1,
      },
    ],
  },
];

export async function listReadingPlanDefinitions(): Promise<
  ReadingPlanDefinition[]
> {
  return READING_PLANS;
}

export function getReadingPlanDefinitionBySlug(
  slug: string
): ReadingPlanDefinition | undefined {
  return READING_PLANS.find((p) => p.slug === slug);
}

// ================== Execuções (runs) no banco ==================

export async function getActiveRunForPlan(userId: string, planSlug: string) {
  return prisma.readingPlanRun.findFirst({
    where: { userId, planSlug, status: ReadingPlanStatus.IN_PROGRESS },
    orderBy: { startedAt: "desc" },
  });
}

type JoinReadingPlanParams = {
  userId: string;
  planSlug: string;
  totalDays?: number | null;
};

export async function joinReadingPlan({
  userId,
  planSlug,
  totalDays,
}: JoinReadingPlanParams) {
  const activeRun = await getActiveRunForPlan(userId, planSlug);
  if (activeRun) return activeRun;

  const planDef = getReadingPlanDefinitionBySlug(planSlug);
  const resolvedTotalDays = totalDays ?? planDef?.durationDays ?? null;

  const lastRun = await prisma.readingPlanRun.findFirst({
    where: { userId, planSlug },
    orderBy: { iteration: "desc" },
  });

  const nextIteration = (lastRun?.iteration ?? 0) + 1;

  return prisma.readingPlanRun.create({
    data: {
      userId,
      planSlug,
      iteration: nextIteration,
      status: ReadingPlanStatus.IN_PROGRESS,
      currentDay: 1,
      totalDays: resolvedTotalDays,
    },
  });
}

export async function updateReadingProgress(runId: string, nextDay: number) {
  const run = await prisma.readingPlanRun.findUnique({
    where: { id: runId },
  });

  if (!run) {
    throw new Error("ReadingPlanRun não encontrado");
  }

  const totalDays = run.totalDays ?? nextDay;
  const clampedNextDay = Math.min(nextDay, totalDays);
  const isCompleted = clampedNextDay >= totalDays;

  const updated = await prisma.readingPlanRun.update({
    where: { id: runId },
    data: {
      currentDay: clampedNextDay,
      status: isCompleted
        ? ReadingPlanStatus.COMPLETED
        : ReadingPlanStatus.IN_PROGRESS,
      totalDays,
      completedAt: isCompleted ? new Date() : null,
    },
  });

  return updated;
}
