// app/admin/devotionals/page.tsx
import { AppLayout } from "@/app/components/AppLayout";
import { requireAdmin } from "@/app/lib/auth-guards";
import { listDevotionals } from "@/app/services/devotionals";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export default async function AdminDevotionalsPage() {
  // garante que só ADMIN entra
  await requireAdmin("/admin/devotionals");

  const devos = await listDevotionals();

  return (
    <AppLayout
      title="Devocionais"
      subtitle="Conteúdo devocional oficial IFAD, gerenciado pelo Strapi."
    >
      <div className="space-y-6">
        {/* Faixa explicativa */}
        <section className="rounded-2xl border border-amber-500/30 bg-amber-900/10 p-4 text-xs text-amber-50">
          <p className="font-semibold text-amber-200">
            Gestão via painel de conteúdo (Strapi)
          </p>
          <p className="mt-1 text-amber-100/90">
            Criação e edição dos devocionais é feita no painel Strapi.{" "}
            Esta tela mostra um resumo do que está publicado e links
            rápidos para edição e visualização no site.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`${STRAPI_URL}/admin`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-500/20"
            >
              Abrir painel Strapi
            </a>
            <a
              href="/devocionais"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-100 hover:bg-white/10"
            >
              Ver página pública de devocionais
            </a>
          </div>
        </section>

        {/* Lista de devocionais */}
        <section>
          <h2 className="text-sm font-semibold text-amber-300 mb-2">
            Devocionais publicados
          </h2>

          {devos.length === 0 ? (
            <p className="text-xs text-gray-400">
              Ainda não há devocionais publicados. Cadastre o primeiro no
              painel do Strapi.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-black/40 text-[11px] uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Título</th>
                    <th className="px-4 py-2 hidden md:table-cell">
                      Leitura
                    </th>
                    <th className="px-4 py-2 hidden lg:table-cell">
                      Destaque
                    </th>
                    <th className="px-4 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                {devos.map((devo) => {
                    const dateLabel = new Date(devo.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    });

                    return (
                    <tr
                        key={devo.slug}
                        className="border-t border-white/5 hover:bg-black/40"
                    >
                        <td className="px-4 py-2 text-gray-300">{dateLabel}</td>

                        <td className="px-4 py-2 text-gray-50">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold">{devo.title}</span>
                            {devo.subtitle && (
                            <span className="text-[11px] text-gray-400 line-clamp-1">
                                {devo.subtitle}
                            </span>
                            )}
                        </div>
                        </td>

                        <td className="px-4 py-2 text-gray-300 hidden md:table-cell">
                        {devo.readingRef}
                        </td>

                        <td className="px-4 py-2 text-gray-300 hidden lg:table-cell">
                        <span className="line-clamp-2">
                            {devo.highlight || devo.excerpt}
                        </span>
                        </td>

                        {/* AÇÕES */}
                        <td className="px-4 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                            <a
                            href={`/devocionais/${devo.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-100 hover:border-amber-300 hover:text-amber-200 whitespace-nowrap transition-colors"
                            >
                            Ver no site
                            </a>

                            <a
                            href={`${STRAPI_URL}/admin/content-manager/collection-types/api::devotional.devotional`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/20 hover:border-amber-300 whitespace-nowrap transition-colors"
                            >
                            Abrir no Strapi
                            </a>
                        </div>
                        </td>
                    </tr>
                    );
                })}
                </tbody>

              </table>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
