// app/member/page.tsx
import { AppLayout } from "@/app/components/AppLayout";
import { requireUser } from "@/app/lib/auth-guards";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { PrayerRequestForm } from "./PrayerRequestForm";

export default async function MemberPage() {
  // Garante que está logado (e redireciona se não estiver)
  await requireUser("/member");

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = (session.user as any).id as string;

  // Descobre o líder atual (se houver)
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      leaderId: true,
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const meetings = me?.leaderId
    ? await prisma.meeting.findMany({
        where: { leaderId: me.leaderId },
        orderBy: { meetingDate: "desc" },
        take: 5,
      })
    : [];

  const leaderName = me?.leader?.name ?? null;

  return (
    <AppLayout
      title="Espaço do Membro"
      subtitle="Caminhe em leitura, oração e comunhão."
    >
      <div className="grid gap-6 md:grid-cols-[2fr,1.6fr]">
        {/* Coluna esquerda: devocional / plano de leitura */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-amber-300">
            Devocional de hoje
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            Aqui vamos integrar o conteúdo vindo do Strapi: devocionais e
            planos de leitura bíblica.
          </p>
        </section>

        {/* Coluna direita: pedido de oração */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-amber-300">
            Pedido de oração / mensagem ao líder
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Compartilhe pedidos, lutas ou agradecimentos. Seu líder poderá
            acompanhar por aqui.
          </p>

          {leaderName ? (
            <p className="mt-2 text-[11px] text-emerald-200">
              Líder atual: <span className="font-semibold">{leaderName}</span>.
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-amber-200">
              Você ainda não escolheu um líder.
            </p>
          )}

          {/* Botão para escolher / trocar líder */}
          <div className="mt-3">
            <Link
              href="/groups/select-leader"
              className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-200 hover:bg-amber-500/20 hover:border-amber-300 transition"
            >
              Escolher líder / grupo
            </Link>
          </div>

          <div className="mt-4">
            <PrayerRequestForm />
          </div>
        </section>
      </div>

      {/* Encontros recentes do grupo */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-amber-300">
          Encontros recentes do seu grupo
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Aqui aparecem os encontros registrados pelo seu líder. Se você ainda
          não escolheu um líder, selecione um em &quot;Escolher líder /
          grupo&quot;.
        </p>

        <ul className="mt-3 space-y-2 text-xs text-gray-300">
          {(!me?.leaderId || meetings.length === 0) && (
            <li className="text-gray-500">
              {me?.leaderId
                ? "Seu líder ainda não registrou encontros."
                : "Você ainda não está vinculado a um líder / grupo."}
            </li>
          )}

          {meetings.map((m) => (
            <li
              key={m.id}
              className="rounded-lg bg-slate-950/60 border border-white/10 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-amber-200">{m.title}</p>
                <span className="text-[11px] text-gray-400">
                  {new Date(m.meetingDate).toLocaleString("pt-BR")}
                </span>
              </div>
              {m.description && (
                <p className="mt-1 text-gray-200 whitespace-pre-line">
                  {m.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </AppLayout>
  );
}
