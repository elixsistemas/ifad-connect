// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { AppLayout } from "@/app/components/AppLayout";

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = (session.user as any)?.role;

  if (role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  const ONLINE_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
  const onlineThreshold = new Date(Date.now() - ONLINE_WINDOW_MS);

  const [
    totalUsers,
    totalMembers,
    totalLeaders,
    totalAdmins,
    membersWithLeader,
    onlineMembers,
    totalPrayerRequests,
    totalMeetings,
    leadersFromDb,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "LEADER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({
      where: { role: "MEMBER", leaderId: { not: null } },
    }),
    prisma.user.count({
      where: {
        role: "MEMBER",
        lastActivityAt: { gte: onlineThreshold },
      },
    }),
    prisma.prayerRequest.count(),
    prisma.meeting.count(),
    prisma.user.findMany({
      where: { role: "LEADER" },
      orderBy: { name: "asc" },
      include: {
        disciples: {
          select: {
            id: true,
            lastActivityAt: true,
          },
        },
      },
    }),
  ]);

  const membersWithoutLeader = totalMembers - membersWithLeader;

  const leaderStats = leadersFromDb.map((leader) => {
    const total = leader.disciples.length;

    const online = leader.disciples.filter((d) => {
      if (!d.lastActivityAt) return false;
      return d.lastActivityAt >= onlineThreshold;
    }).length;

    const offline = total - online;

    return {
      id: leader.id,
      name: leader.name,
      total,
      online,
      offline,
    };
  });

  const totalGroupsWithMembers = leaderStats.filter((g) => g.total > 0).length;

  return (
    <AppLayout
      title="Painel administrativo"
      subtitle="Visão geral do IFAD Connect: pessoas, grupos e jornadas."
    >
      <div className="space-y-8">
        {/* VISÃO GERAL */}
        <section>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">
            Visão geral
          </h2>
          <div className="grid gap-4 md:grid-cols-4 text-xs">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] text-gray-400">Usuários cadastrados</p>
              <p className="mt-2 text-2xl font-semibold text-gray-50">
                {totalUsers}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                {totalMembers} membros • {totalLeaders} líderes • {totalAdmins}{" "}
                admins
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-900/10 p-4">
              <p className="text-[11px] text-emerald-200">
                Engajamento dos membros
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-100">
                {onlineMembers}
              </p>
              <p className="mt-1 text-[11px] text-emerald-200">
                on-line nos últimos 10 minutos
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-900/10 p-4">
              <p className="text-[11px] text-amber-200">
                Vínculo com líderes / grupos
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-100">
                {membersWithLeader}
              </p>
              <p className="mt-1 text-[11px] text-amber-200">
                membros com líder • {membersWithoutLeader} sem líder
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-900/10 p-4">
              <p className="text-[11px] text-indigo-200">Vida espiritual</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-100">
                {totalPrayerRequests}
              </p>
              <p className="mt-1 text-[11px] text-indigo-200">
                pedidos de oração • {totalMeetings} encontros registrados
              </p>
            </div>
          </div>
        </section>

        {/* GRUPOS E LÍDERES */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-amber-300">
              Grupos e líderes
            </h2>
            <p className="text-[11px] text-gray-400">
              {totalLeaders} líderes cadastrados • {totalGroupsWithMembers}{" "}
              grupos com membros
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            {leaderStats.length === 0 ? (
              <p className="text-xs text-gray-500">
                Ainda não há líderes cadastrados. Configure líderes em
                &quot;Usuários&quot;.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-xs">
                {leaderStats.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-xl border border-white/10 bg-slate-950/60 p-3"
                  >
                    <p className="text-sm font-semibold text-gray-50">
                      {g.name}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      {g.total === 0
                        ? "Nenhum membro vinculado ainda."
                        : `${g.total} membro(s) • ${g.online} on-line • ${g.offline} off-line`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ATALHOS DE ADMINISTRAÇÃO */}
        <section>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">
            Administração
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <a
              href="/admin/users"
              className="rounded-2xl border border-amber-500/20 bg-white/5 p-4 hover:border-amber-400 transition"
            >
              <h3 className="font-semibold text-gray-50 mb-1">Usuários</h3>
              <p className="text-xs text-gray-400">
                Ver contas, papéis (member / leader / admin) e permissões.
              </p>
            </a>

            <a
              href="/admin/groups"
              className="rounded-2xl border border-amber-500/20 bg-white/5 p-4 hover:border-amber-400 transition"
            >
              <h3 className="font-semibold text-gray-50 mb-1">Grupos</h3>
              <p className="text-xs text-gray-400">
                Gestão futura de grupos, células e ministérios.
              </p>
            </a>

            <a
              href="/admin/devotionals"
              className="rounded-2xl border border-amber-500/20 bg-white/5 p-4 hover:border-amber-400 transition"
            >
              <h3 className="font-semibold text-gray-50 mb-1">Devocionais</h3>
              <p className="text-xs text-gray-400">
                Administração de devocionais diários (Strapi / IA).
              </p>
            </a>

            <a
              href="/admin/plans"
              className="rounded-2xl border border-amber-500/20 bg-white/5 p-4 hover:border-amber-400 transition"
            >
              <h3 className="font-semibold text-gray-50 mb-1">
                Planos de leitura
              </h3>
              <p className="text-xs text-gray-400">
                Configuração dos planos bíblicos e cronogramas.
              </p>
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
