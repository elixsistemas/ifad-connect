// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppLayout } from "../components/AppLayout";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;
  const role = user.role ?? "MEMBER";

  if (role !== "ADMIN" && role !== "admin") {
    redirect("/dashboard"); // trava admin
  }

  return (
    <AppLayout
      title="Área Administrativa"
      subtitle="Aqui vamos gerenciar planos, devocionais, grupos e relatórios."
    >
      <div className="space-y-4 text-sm">
        <p>
          Bem-vindo, <span className="font-semibold">{user.name}</span>. Seu
          papel é: <span className="font-mono uppercase">{role}</span>
        </p>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Planos de leitura</h2>
            <p className="text-xs text-gray-300">
              Lista / cadastro vindo do Strapi (GraphQL) ou Prisma.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Devocionais</h2>
            <p className="text-xs text-gray-300">
              Gestão dos devocionais do IFAD Estudo Bíblico.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-sm font-semibold mb-1">Grupos / Células</h2>
            <p className="text-xs text-gray-300">
              Controle de grupos, líderes e participantes.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
