// app/admin/groups/page.tsx
import { AppLayout } from "@/app/components/AppLayout";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth-guards";

export default async function AdminGroupsPage() {
  await requireAdmin("/admin/groups");

    const ONLINE_WINDOW_MS = 10 * 60 * 1000;
    const onlineThreshold = new Date(Date.now() - ONLINE_WINDOW_MS);

  const [leaders, membersWithoutLeader] = await Promise.all([
    prisma.user.findMany({
      where: { role: "LEADER" },
      orderBy: { name: "asc" },
      include: {
        disciples: {
          where: { role: "MEMBER" },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            email: true,
            lastActivityAt: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "MEMBER", leaderId: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        lastActivityAt: true,
      },
    }),
  ]);

  const leaderStats = leaders.map((leader) => {
    const total = leader.disciples.length;

    const online = leader.disciples.filter((d) => {
      if (!d.lastActivityAt) return false;
      return d.lastActivityAt >= onlineThreshold;
    }).length;

    const offline = total - online;

    return {
      id: leader.id,
      name: leader.name,
      email: leader.email,
      total,
      online,
      offline,
      disciples: leader.disciples,
    };
  });

  const totalGroups = leaderStats.length;
  const groupsWithMembers = leaderStats.filter((g) => g.total > 0).length;

  const isOnline = (lastActivityAt: Date | null | undefined) =>
    !!lastActivityAt && lastActivityAt >= onlineThreshold;

  return (
    <AppLayout
      title="Grupos"
      subtitle="Acompanhe líderes, membros vinculados e pessoas sem grupo."
    >
      <div className="space-y-8">
        {/* Resumo rápido */}
        <section className="grid gap-4 md:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] text-gray-400">Grupos cadastrados</p>
            <p className="mt-2 text-2xl font-semibold text-gray-50">
              {totalGroups}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              {groupsWithMembers} com membros •{" "}
              {totalGroups - groupsWithMembers} vazios
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-900/10 p-4">
            <p className="text-[11px] text-amber-200">
              Membros sem líder / grupo
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-100">
              {membersWithoutLeader.length}
            </p>
            <p className="mt-1 text-[11px] text-amber-200">
              Pessoas que ainda não escolheram um líder.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-4">
            <p className="text-[11px] text-emerald-200">Orientação</p>
            <p className="mt-2 text-xs text-emerald-100">
              Os grupos são formados a partir do líder escolhido pelo membro em{" "}
              <span className="font-semibold">“Escolher líder / grupo”</span>.
            </p>
          </div>
        </section>

        {/* Lista de grupos por líder */}
        <section>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">
            Grupos por líder
          </h2>

          <div className="space-y-3">
            {leaderStats.length === 0 && (
              <p className="text-xs text-gray-500">
                Ainda não há líderes cadastrados. Defina usuários como LEADER
                na tela de usuários.
              </p>
            )}

            {leaderStats.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-50">
                      {g.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{g.email}</p>
                  </div>
                  <div className="text-right text-[11px] text-gray-400">
                    <p>
                      {g.total} membro(s) • {g.online} on-line • {g.offline}{" "}
                      off-line
                    </p>
                  </div>
                </div>

                <ul className="mt-3 space-y-1 max-h-40 overflow-y-auto pr-1">
                  {g.total === 0 && (
                    <li className="text-[11px] text-gray-500">
                      Nenhum membro vinculado a este líder ainda.
                    </li>
                  )}

                  {g.disciples.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between rounded-lg bg-slate-950/60 px-2 py-1"
                    >
                      <div>
                        <p className="text-gray-100">{d.name}</p>
                        <p className="text-[10px] text-gray-500">{d.email}</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          isOnline(d.lastActivityAt)
                            ? "text-emerald-300"
                            : "text-gray-500"
                        }`}
                      >
                        {isOnline(d.lastActivityAt) ? "online" : "offline"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Membros sem grupo */}
        <section>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">
            Membros sem grupo
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
            {membersWithoutLeader.length === 0 ? (
              <p className="text-xs text-gray-500">
                Todos os membros já estão vinculados a algum líder / grupo.
              </p>
            ) : (
              <ul className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {membersWithoutLeader.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-lg bg-slate-950/60 px-2 py-1"
                  >
                    <div>
                      <p className="text-gray-100">{m.name}</p>
                      <p className="text-[10px] text-gray-500">{m.email}</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        isOnline(m.lastActivityAt)
                          ? "text-emerald-300"
                          : "text-gray-500"
                      }`}
                    >
                      {isOnline(m.lastActivityAt) ? "online" : "offline"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
