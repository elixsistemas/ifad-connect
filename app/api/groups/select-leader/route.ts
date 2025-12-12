// app/api/groups/select-leader/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

const selectLeaderSchema = z.object({
  leaderId: z.string().min(1, "Líder inválido."),
});

// POST: membro seleciona / troca seu líder (mentor / grupo)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "É necessário estar logado." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as "MEMBER" | "LEADER" | "ADMIN";

    // Domínio: apenas MEMBER escolhe líder (mentor)
    if (role !== "MEMBER") {
      return NextResponse.json(
        { error: "Apenas membros podem selecionar um líder." },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsed = selectLeaderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { leaderId } = parsed.data;

    // Evita que alguém se coloque como próprio líder
    if (leaderId === userId) {
      return NextResponse.json(
        { error: "Você não pode ser líder de si mesmo." },
        { status: 400 }
      );
    }

    // Confere se o líder existe e realmente é LEADER
    const leader = await prisma.user.findUnique({
      where: { id: leaderId },
      select: { id: true, role: true, name: true },
    });

    if (!leader || leader.role !== "LEADER") {
      return NextResponse.json(
        { error: "Líder selecionado inválido." },
        { status: 400 }
      );
    }

    // Atualiza o membro com o leaderId selecionado
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { leaderId },
      select: {
        id: true,
        name: true,
        email: true,
        leaderId: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: `Líder ${leader.name} selecionado com sucesso.`,
        user: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[select-leader:POST] Erro ao selecionar líder", error);
    return NextResponse.json(
      { error: "Erro ao selecionar líder." },
      { status: 500 }
    );
  }
}

// GET: lista de líderes disponíveis para o membro escolher
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "É necessário estar logado." },
        { status: 401 }
      );
    }

    // Poderíamos restringir a quem pode ver a lista,
    // mas faz sentido qualquer usuário logado conseguir ver os líderes disponíveis.
    const leaders = await prisma.user.findMany({
      where: { role: "LEADER" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        // disciples apenas para contagem, não para listar tudo
        disciples: {
          select: { id: true },
        },
      },
    });

    const result = leaders.map((leader) => ({
      id: leader.id,
      name: leader.name,
      email: leader.email,
      disciplesCount: leader.disciples.length,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[select-leader:GET] Erro ao listar líderes", error);
    return NextResponse.json(
      { error: "Erro ao listar líderes." },
      { status: 500 }
    );
  }
}
