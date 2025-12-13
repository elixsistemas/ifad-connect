// app/meus-planos/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { getReadingPlansForUser } from "@/app/lib/readingPlansWithProgress";

export const revalidate = 0; // sempre fresh para o usuário

export default async function MyReadingPlansPage() {
  const session = await getServerSession(authOptions);

  // ✅ pega o id se existir, mas não depende dele
  const sessionUser = session?.user as any;
  const sessionUserId = (sessionUser?.id as string | undefined) ?? undefined;
  const email = (session?.user?.email as string | undefined) ?? undefined;

  if (!session || (!sessionUserId && !email)) {
    redirect("/login?callbackUrl=/meus-planos");
  }

  // ✅ resolve userId com segurança
  let userId = sessionUserId;

  if (!userId) {
    const user = await prisma.user.findUnique({
      where: { email: email! },
      select: { id: true },
    });

    if (!user) {
      // sessão existe mas o user não existe no banco (raro, mas possível)
      redirect("/login?callbackUrl=/meus-planos");
    }

    userId = user.id;
  }

  const plans = await getReadingPlansForUser(userId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <header className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 text-lg font-semibold">
              IF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                IFAD CONNECT
              </p>
              <p className="text-sm text-gray-300">Seus planos de leitura</p>
            </div>
          </div>

          <nav className="text-right text-xs space-y-1">
            <Link
              href="/"
              className="block text-gray-400 hover:text-amber-300 transition"
            >
              Voltar para o início
            </Link>
            <Link
              href="/planos"
              className="block text-gray-400 hover:text-amber-300 transition"
            >
              Encontrar novos planos
            </Link>
          </nav>
        </header>

        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-amber-200">
            Meus planos
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl">
            Aqui você acompanha os planos de leitura que já começou, com seu
            progresso salvo na conta IFAD Connect.
          </p>
        </section>

        {/* Lista de planos do usuário */}
        <section className="space-y-3">
          {plans.length === 0 && (
            <p className="text-sm text-slate-400">
              Você ainda não começou nenhum plano de leitura. Acesse{" "}
              <Link href="/planos" className="text-amber-300 hover:underline">
                a página de planos
              </Link>{" "}
              para iniciar o primeiro.
            </p>
          )}

          {plans.map((plan) => {
            const summary = plan.progressSummary;
            const activeRun = summary?.activeRun;
            const totalRuns = summary?.totalRuns ?? 0;
            const completedRuns = summary?.completedRuns ?? 0;

            const totalDays =
              activeRun?.totalDays ||
              plan.durationDays ||
              plan.devotionals.length ||
              0;

            const currentDay = activeRun?.currentDay ?? 0;

            const progressPercent =
              totalDays > 0
                ? Math.min(100, Math.round((currentDay / totalDays) * 100))
                : 0;

            return (
              <Link
                key={plan.id}
                href={`/planos/${plan.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 hover:border-amber-400 hover:bg-slate-900 transition"
              >
                <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500/70 via-amber-600/60 to-slate-950 flex items-center justify-center text-center text-[10px] font-semibold text-slate-950">
                  {totalDays ? (
                    <span>
                      {totalDays} {totalDays === 1 ? "Dia" : "Dias"}
                    </span>
                  ) : (
                    <span>Plano</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-50 group-hover:text-amber-200">
                        {plan.title}
                      </p>

                      {activeRun && (
                        <p className="text-[11px] text-slate-400">
                          Execução #{activeRun.iteration} · Dia{" "}
                          {activeRun.currentDay}
                          {activeRun.totalDays
                            ? ` de ${activeRun.totalDays}`
                            : ""}
                        </p>
                      )}

                      {!activeRun && completedRuns > 0 && (
                        <p className="text-[11px] text-emerald-300">
                          {completedRuns}{" "}
                          {completedRuns === 1 ? "conclusão" : "conclusões"}{" "}
                          deste plano
                        </p>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500">
                      {totalRuns > 0 && <>Execuções: {totalRuns}</>}
                    </span>
                  </div>

                  {totalDays > 0 && activeRun && (
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
