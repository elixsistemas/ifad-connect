// app/admin/plans/page.tsx
import { AppLayout } from "@/app/components/AppLayout";
import { requireAdmin } from "@/app/lib/auth-guards";
import { strapiQuery } from "@/app/lib/strapiClient";

type ReadingPlansFromStrapi = {
  readingPlans: {
    data: {
      id: string;
      attributes: {
        name: string;
        slug: string;
        durationDays?: number | null;
        isActive?: boolean | null;
      };
    }[];
  };
};

const PLANS_QUERY = /* GraphQL */ `
  query AdminReadingPlans {
    readingPlans(sort: "name:asc") {
      data {
        id
        attributes {
          name
          slug
          durationDays
          isActive
        }
      }
    }
  }
`;

export default async function AdminPlansPage() {
  await requireAdmin("/admin/plans");

    let plans: any[] = [];

    try {
      const data = await strapiQuery<ReadingPlansFromStrapi>(PLANS_QUERY);
      plans = data?.readingPlans?.data ?? [];
    } catch (err) {
      console.error("[AdminPlansPage] Erro ao buscar planos de leitura", err);
      plans = [];
    }

  return (
    <AppLayout
      title="Planos de leitura"
      subtitle="Planos bíblicos mantidos no Strapi e consumidos pelo IFAD Connect."
    >
      <div className="space-y-6 text-xs">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-amber-300 mb-1">
            Fonte dos planos
          </h2>
          <p className="text-xs text-gray-300">
            Os planos são configurados no CMS{" "}
            <span className="font-semibold">Strapi</span> e lidos via{" "}
            <span className="font-semibold">GraphQL</span>. Assim a liderança
            pode ativar/desativar e ajustar cronogramas sem alterar o código.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-amber-300 mb-3">
            Lista de planos
          </h2>

          {plans.length === 0 ? (
            <p className="text-xs text-gray-500">
              Nenhum plano retornado pelo Strapi. Verifique se o Content Type
              &quot;ReadingPlan&quot; está criado, publicado e com permissão
              para o token de API.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-white/5">
                  <tr className="text-left text-[11px] text-gray-400">
                    <th className="px-4 py-2">Plano</th>
                    <th className="px-4 py-2">Slug</th>
                    <th className="px-4 py-2">Duração</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((p) => {
                    const attr = p.attributes;
                    const duration =
                      typeof attr.durationDays === "number"
                        ? `${attr.durationDays} dias`
                        : "-";
                    const active = !!attr.isActive;

                    return (
                      <tr key={p.id} className="border-t border-white/5">
                        <td className="px-4 py-2 text-gray-100">
                          {attr.name}
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {attr.slug}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {duration}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              active
                                ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40"
                                : "bg-gray-500/10 text-gray-200 border border-gray-500/40"
                            }`}
                          >
                            {active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-[11px] text-gray-400">
            Próximo passo natural: amarrar estes planos às páginas públicas de
            leitura (getStaticProps / getServerSideProps) e ao progresso dos
            membros.
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
