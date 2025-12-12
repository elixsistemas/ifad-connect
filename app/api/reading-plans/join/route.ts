// app/api/reading-plans/join/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { joinReadingPlan } from "@/app/lib/readingPlans";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => null);

  if (!body || !body.planSlug) {
    return NextResponse.json(
      { error: "planSlug é obrigatório" },
      { status: 400 }
    );
  }

  const { planSlug, totalDays } = body as {
    planSlug: string;
    totalDays?: number;
  };

  try {
    const run = await joinReadingPlan({ userId, planSlug, totalDays });

    return NextResponse.json(
      {
        run,
        message: "Plano iniciado com sucesso",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Erro ao entrar no plano:", err);
    return NextResponse.json(
      { error: "Não foi possível entrar no plano" },
      { status: 500 }
    );
  }
}
