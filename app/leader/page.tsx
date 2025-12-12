// app/leader/page.tsx
import { AppLayout } from "@/app/components/AppLayout";
import { requireRole } from "@/app/lib/auth-guards";
import { prisma } from "@/app/lib/prisma";
import { MeetingForm } from "./MeetingForm";

export default async function LeaderPage() {
  const session = await requireRole(["LEADER", "ADMIN"], "/leader");

  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as "LEADER" | "ADMIN";

  const prayersWhere =
    role === "ADMIN"
      ? {}
      : {
          leaderId: userId,
        };

  const [prayers, meetings, leaderWithGroup] = await Promise.all([
    prisma.prayerRequest.findMany({
      where: prayersWhere,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        leader: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.meeting.findMany({
      where: { leaderId: userId },
      orderBy: { meetingDate: "desc" },
    }),
    role === "LEADER"
      ? prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            disciples: {
              select: {
                id: true,
                name: true,
                email: true,
                lastActivityAt: true,
              },
              orderBy: { name: "asc" },
            },
          },
        })
      : null,
  ]);

  const disciples = leaderWithGroup?.disciples ?? [];
  const now = Date.now();
  const ONLINE_WINDOW_MS = 10 * 60 * 1000; // 10 minutos

  return (
    <AppLayout
      title="Espaço do Líder"
      subtitle="Acompanhe pedidos de oração, o grupo e registre os encontros."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr,1.3fr]">
        {/* Coluna esquerda: pedidos de oração */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-amber-300">
            Pedidos de oração recebidos
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Mensagens enviadas pelos membros para você (ou todos, no caso de
            administrador). Use isso como base de intercessão e cuidado
            pastoral.
          </p>

          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {prayers.length === 0 && (
              <p className="text-xs text-gray-500">
                Nenhum pedido de oração direcionado a você ainda.
              </p>
            )}

            {prayers.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-100">
                      {p.user.name || "Membro"}
                    </p>
                    <p className="text-[11px] text-gray-500">{p.user.email}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-300">
                    {new Date(p.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>

                <p className="text-amber-200 font-medium">{p.subject}</p>
                <p className="mt-1 text-gray-200 whitespace-pre-line">
                  {p.message}
                </p>

                {role === "ADMIN" && p.leader && (
                  <p className="mt-1 text-[10px] text-gray-400">
                    Líder associado: {p.leader.name}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Coluna direita: registro de encontro + visão do grupo */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-amber-300">
            Registrar encontro do grupo
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Use este espaço para registrar momentos de comunhão, estudo e
            visitas.
          </p>

          <div className="mt-4">
            <MeetingForm />
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-xs font-semibold text-gray-300">
              Encontros recentes
            </h3>
            <ul className="mt-2 space-y-2 text-xs text-gray-300">
              {meetings.length === 0 && (
                <li className="text-gray-500">
                  Nenhum encontro registrado ainda.
                </li>
              )}

              {meetings.map((m) => (
                <li key={m.id} className="rounded-lg bg-slate-950/60 p-2">
                  <p className="font-medium text-amber-200">{m.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(m.meetingDate).toLocaleString("pt-BR")}
                  </p>
                  {m.description && (
                    <p className="mt-1 text-gray-200 whitespace-pre-line">
                      {m.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {role === "LEADER" && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="text-xs font-semibold text-gray-300">
                Membros do seu grupo
              </h3>
              <p className="mt-1 text-[11px] text-gray-400">
                Pessoas que selecionaram você como líder / mentor.
              </p>

              <ul className="mt-2 space-y-1 text-xs text-gray-300 max-h-40 overflow-y-auto pr-1">
                {disciples.length === 0 && (
                  <li className="text-gray-500">
                    Nenhum membro vinculou você como líder ainda.
                  </li>
                )}

                {disciples.map((d) => {
                  const isOnline =
                    !!d.lastActivityAt &&
                    now - d.lastActivityAt.getTime() <= ONLINE_WINDOW_MS;

                  return (
                    <li
                      key={d.id}
                      className="flex items-center justify-between rounded-lg bg-slate-950/60 px-2 py-1"
                    >
                      <div>
                        <p className="font-medium text-gray-100">{d.name}</p>
                        <p className="text-[10px] text-gray-500">{d.email}</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          isOnline ? "text-emerald-300" : "text-gray-500"
                        }`}
                      >
                        {isOnline ? "online" : "offline"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
