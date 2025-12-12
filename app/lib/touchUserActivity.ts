// app/lib/touchUserActivity.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function touchUserActivity() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActivityAt: new Date() },
    });
  } catch (err) {
    console.error("Erro ao atualizar lastActivityAt:", err);
  }
}
