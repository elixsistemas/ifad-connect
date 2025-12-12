// app/api/reading-plans/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { updateReadingProgress } from "@/app/lib/readingPlans";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const body = await req.json().catch(() => null);

  if (!body || !body.runId || typeof body.nextDay !== "number") {
    return NextResponse.json(
      { error: "Parâmetros inválidos" },
      { status: 400 }
    );
  }

  const { runId, nextDay } = body as { runId: string; nextDay: number };

  try {
    // segurança: garante que o run pertence ao usuário logado
    const run = await prisma.readingPlanRun.findUnique({
      where: { id: runId },
    });

    if (!run || run.userId !== userId) {
      return NextResponse.json(
        { error: "Execução não encontrada para este usuário" },
        { status: 404 }
      );
    }

    const updated = await updateReadingProgress(runId, nextDay);

    return NextResponse.json(
      {
        run: {
          id: updated.id,
          planSlug: updated.planSlug,
          currentDay: updated.currentDay,
          totalDays: updated.totalDays,
          status: updated.status,
          startedAt: updated.startedAt,
          completedAt: updated.completedAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[POST /api/reading-plans/progress] Erro:", err);
    return NextResponse.json(
      { error: "Não foi possível atualizar o progresso" },
      { status: 500 }
    );
  }
}
