// app/api/admin/users/role/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import type { Role } from "@prisma/client";

type Body = {
  userId?: string;
  role?: Role;
};

const ALLOWED_ROLES: Role[] = ["MEMBER", "LEADER", "ADMIN"];

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  // 1) Só ADMIN pode alterar papel
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Sem permissão para alterar papéis." },
      { status: 403 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "JSON inválido." },
      { status: 400 }
    );
  }

  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json(
      { error: "userId e role são obrigatórios." },
      { status: 400 }
    );
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Papel inválido." },
      { status: 400 }
    );
  }

  // 2) Verifica se o usuário alvo existe
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 404 }
    );
  }

  // 3) Não deixar ADMIN se auto-rebaixar
  if (targetUser.id === session.user.id) {
    if (session.user.role === "ADMIN" && role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Você não pode alterar o seu próprio papel para algo diferente de ADMIN.",
        },
        { status: 400 }
      );
    }
  }

  // 4) Não deixar remover o último ADMIN do sistema
  if (targetUser.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Não é possível remover o último ADMIN do sistema." },
        { status: 400 }
      );
    }
  }

  // 5) Atualiza o papel
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      role: true,
    },
  });

  return NextResponse.json(updated);
}
