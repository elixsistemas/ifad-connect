import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { getRandomVerse } from "@/app/services/bible";

type BibliaSSRProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const getServerSideProps: GetServerSideProps = async () => {
  // Busca versículo aleatório SEM cache (SSR puro)
  let verse = null;
  let error: string | null = null;

  try {
    verse = await getRandomVerse("nvi");
  } catch (err) {
    console.error("Erro ao buscar versículo aleatório (SSR):", err);
    error = "Não foi possível carregar o versículo agora.";
  }

  return {
    props: {
      verse,
      error,
      generatedAt: new Date().toISOString(),
    },
  };
};

export default function BibliaSSRPage({
  verse,
  error,
  generatedAt,
}: BibliaSSRProps) {
  return (
    <>
      <Head>
        <title>Leitura bíblica (SSR) – IFAD Connect</title>
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <header className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400">
              Demonstração SSR
            </p>
            <h1 className="text-2xl font-semibold">
              Leitura bíblica (página em Pages com getServerSideProps)
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Esta página demonstra o uso de{" "}
              <code>getServerSideProps</code> na pasta <code>/pages</code>,
              consumindo a API da ABíbliaDigital em cada requisição.
            </p>
            <p className="text-[11px] text-slate-500">
              Renderizada em: <span className="font-mono">{generatedAt}</span>
            </p>

            <div className="flex flex-wrap gap-3 text-xs">
              <Link
                href="/biblia"
                className="text-amber-300 hover:text-amber-200"
              >
                ← Ir para a leitura bíblica principal (App Router)
              </Link>
              <Link
                href="/devocionais-ssg"
                className="text-slate-300 hover:text-amber-200"
              >
                Ver exemplo de SSG (devocionais)
              </Link>
            </div>
          </header>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {verse && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 text-sm">
              <p className="text-xs text-slate-400">
                Versão: <span className="font-mono uppercase">nvi</span>
              </p>
              <p className="text-base leading-relaxed text-slate-50">
                <span className="text-amber-300 mr-2">
                  {verse.book.name} {verse.chapter}:{verse.number}
                </span>
                {verse.text}
              </p>
              <p className="text-[11px] text-slate-500">
                Este versículo é carregado em cada requisição via{" "}
                <code>getServerSideProps</code>, sem cache.
              </p>
            </section>
          )}

          {!error && !verse && (
            <p className="text-sm text-slate-300">
              Nenhum texto carregado no momento.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
