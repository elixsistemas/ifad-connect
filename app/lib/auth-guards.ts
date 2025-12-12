// app/lib/auth-guards.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Role } from "@prisma/client";

function buildLoginRedirect(callbackUrl?: string) {
  if (!callbackUrl) return "/login";
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

/**
 * Garante que exista um usuário logado.
 * Se não houver sessão, redireciona para /login com callbackUrl.
 */
export async function requireUser(callbackUrl: string = "/dashboard") {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect(buildLoginRedirect(callbackUrl));
  }

  return session;
}

/**
 * Garante que o usuário logado tenha um dos papéis informados.
 * Se não tiver, redireciona para /dashboard (ou outra rota que você queira).
 */
export async function requireRole(
  roles: Role[],
  callbackUrl: string = "/dashboard"
) {
  const session = await requireUser(callbackUrl);

  const role = session.user.role as Role | undefined;

  if (!role || !roles.includes(role)) {
    redirect("/dashboard");
  }

  return session;
}

/**
 * Garante que o usuário logado seja ADMIN.
 * - Se não estiver logado: manda pro login com callbackUrl.
 * - Se estiver logado mas não for admin: manda pro /dashboard.
 */
export async function requireAdmin(callbackUrl: string = "/admin") {
  return requireRole(["ADMIN"], callbackUrl);
}
