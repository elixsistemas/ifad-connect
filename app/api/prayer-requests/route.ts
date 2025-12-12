// app/api/prayer-requests/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

const createPrayerSchema = z.object({
  subject: z.string().min(3, "Assunto muito curto"),
  message: z.string().min(10, "Mensagem muito curta"),
  // líder para o qual o pedido será direcionado (opcional)
  leaderId: z.string().optional().nullable(),
});

// POST: membro cria pedido de oração
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "É necessário estar logado." },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id as string;

  const json = await req.json();
  const parsed = createPrayerSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { subject, message } = parsed.data;
  let leaderId = parsed.data.leaderId ?? undefined;

  // Normaliza leaderId vazio vindo do front ("")
  if (leaderId && leaderId.trim().length === 0) {
    leaderId = undefined;
  }

  // Se não veio leaderId no body, tentamos usar o líder principal do usuário
  if (!leaderId) {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { leaderId: true },
    });

    if (me?.leaderId) {
      leaderId = me.leaderId;
    }
  }

  // Se houver leaderId, validamos se é um LEADER de verdade
  if (leaderId) {
    const leader = await prisma.user.findUnique({
      where: { id: leaderId },
      select: { id: true, role: true },
    });

    if (!leader || leader.role !== "LEADER") {
      return NextResponse.json(
        { error: "Líder selecionado inválido." },
        { status: 400 }
      );
    }
  }

  const prayer = await prisma.prayerRequest.create({
    data: {
      userId,
      leaderId: leaderId ?? null,
      subject,
      message,
    },
  });

  return NextResponse.json(prayer, { status: 201 });
}

// GET: líder/admin vê pedidos de oração
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "É necessário estar logado." },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as "MEMBER" | "LEADER" | "ADMIN";

  if (role === "ADMIN") {
    // Admin vê todos os pedidos
    const prayers = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        leader: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(prayers);
  }

  if (role === "LEADER") {
    // Líder vê apenas os pedidos direcionados a ele
    const prayers = await prisma.prayerRequest.findMany({
      where: {
        leaderId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        leader: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(prayers);
  }

  // MEMBER (ou qualquer outro não autorizado) não acessa essa listagem
  return NextResponse.json(
    { error: "Apenas líderes ou administradores podem ver os pedidos." },
    { status: 403 }
  );
}
