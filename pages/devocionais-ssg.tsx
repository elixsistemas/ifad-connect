// pages/devocionais-ssg.tsx
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  listDevotionals,
  type DevotionalSummary,
} from "@/app/services/devotionals";

type DevosPageProps = {
  devos: DevotionalSummary[];
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<DevosPageProps> = async () => {
  const devos = await listDevotionals();

  return {
    props: {
      devos,
      generatedAt: new Date().toISOString(),
    },
    // só pra demonstrar ISR
    revalidate: 60,
  };
};

export default function DevocionaisSSGPage({
  devos,
  generatedAt,
}: DevosPageProps) {
  return (
    <>
      <Head>
        <title>Devocionais (SSG) – IFAD Connect</title>
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <header className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400">
              Demonstração SSG
            </p>
            <h1 className="text-2xl font-semibold">
              Devocionais (página em Pages com getStaticProps)
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Página criada apenas para a disciplina, usando{" "}
              <code>getStaticProps</code> na pasta <code>/pages</code>. Os dados
              vêm do mesmo serviço de devocionais usado no App Router.
            </p>
            <p className="text-[11px] text-slate-500">
              Última geração estática:{" "}
              <span className="font-mono">{generatedAt}</span>
            </p>
            <Link
              href="/devocionais"
              className="inline-flex text-xs text-amber-300 hover:text-amber-200"
            >
              ← Voltar para a versão principal em App Router
            </Link>
          </header>

          <section className="space-y-3">
            {devos.map((devo) => (
              <article
                key={devo.slug}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1"
              >
                <p className="text-[11px] text-slate-400">
                  {new Date(devo.date).toLocaleDateString("pt-BR")}
                </p>
                <h2 className="text-sm font-semibold text-slate-50">
                  {devo.title}
                </h2>
                {devo.subtitle && (
                  <p className="text-xs text-slate-300">{devo.subtitle}</p>
                )}
                <p className="text-xs text-slate-400 line-clamp-2">
                  {devo.excerpt}
                </p>
              </article>
            ))}

            {devos.length === 0 && (
              <p className="text-sm text-slate-300">
                Nenhum devocional encontrado.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
