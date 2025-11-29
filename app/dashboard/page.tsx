import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppLayout } from "../components/AppLayout";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any; // ajustar tipo se já tipou
  const role = user.role ?? "MEMBER";

  const isAdmin = role === "ADMIN" || role === "admin";

  return (
    <AppLayout
      title="Dashboard"
      subtitle={
        isAdmin
          ? "Visão geral como administrador."
          : "Seu painel de leitura e participação."
      }
    >
      <div className="space-y-4 text-sm">
        <p>
          Olá, <span className="font-semibold">{user.name}</span> (
          {user.email}) — role:{" "}
          <span className="font-mono uppercase">{role}</span>
        </p>

        {isAdmin ? (
          <p className="text-amber-300">
            Você é admin. Em breve aqui entram métricas de grupos, planos e uso.
          </p>
        ) : (
          <p className="text-gray-300">
            Em breve aqui entram: atalho para o plano de hoje, últimos devocionais, grupos que você participa etc.
          </p>
        )}

        {/* cards de futuro conteúdo */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Leitura de hoje</h2>
            <p className="text-xs text-gray-300">
              Aqui vai um card puxando do Strapi o texto do dia.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Devocional</h2>
            <p className="text-xs text-gray-300">
              Resumo do devocional atual e link para ler completo.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Grupos</h2>
            <p className="text-xs text-gray-300">
              Atalhos para seus grupos / célula / ministério.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
