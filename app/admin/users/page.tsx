// app/admin/users/page.tsx
import type { Role } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { AppLayout } from "@/app/components/AppLayout";
import { touchUserActivity } from "@/app/lib/touchUserActivity";
import { UsersTable } from "./UsersTable";
import { requireAdmin } from "@/app/lib/auth-guards";

type UserForClient = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isOnline: boolean;
  lastLoginAt: string | null;
};

export default async function AdminUsersPage() {
  // garante que só ADMIN entra e já trata redirect
  const _session = await requireAdmin("/admin/users");

  // registra atividade do admin ao abrir a tela
  await touchUserActivity();

  const usersFromDb = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      lastActivityAt: true,
    },
  });

  const now = Date.now();
  const ONLINE_WINDOW_MS = 10 * 60 * 1000; // 10 minutos

  const usersForClient: UserForClient[] = usersFromDb.map((user) => {
    const lastActivity = user.lastActivityAt?.getTime() ?? 0;

    const isOnline =
      lastActivity > 0 && now - lastActivity < ONLINE_WINDOW_MS;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isOnline,
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    };
  });

  return (
    <AppLayout
      title="Usuários"
      subtitle="Gerencie os papéis de acesso aos módulos do IFAD Connect."
    >
      <UsersTable users={usersForClient} />
    </AppLayout>
  );
}
