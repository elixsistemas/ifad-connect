// app/page.tsx
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { BrandBadge } from "@/app/components/BrandBadge";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "IFAD Connect – Jornada de leitura e devoção",
  description:
    "Acompanhe planos de leitura bíblica, devocionais e pedidos de oração em uma jornada conectada à IFAD.",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isLogged = !!session;

  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* NAVBAR */}
        <header className="flex items-center justify-between gap-4 mb-10">
          {/* selo IFAD Connect com logo */}
          <BrandBadge />

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/biblia" className="text-gray-300 hover:text-amber-300">
              Leitura bíblica
            </Link>
            <Link
              href="/devocionais"
              className="text-gray-300 hover:text-amber-300"
            >
              Devocionais
            </Link>
            <Link href="/sobre" className="text-gray-300 hover:text-amber-300">
              Sobre a IFAD
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!isLogged && (
              <Link
                href="/register"
                className="hidden md:inline text-xs text-gray-300 hover:text-amber-300"
              >
                Criar conta
              </Link>
            )}

            <Link
              href={isLogged ? "/dashboard" : "/login"}
              className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition"
            >
              {isLogged ? "Ir para o painel" : "Entrar"}
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="grid gap-8 md:grid-cols-[3fr,2fr] items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-3">
              Uma jornada bíblica{" "}
              <span className="text-amber-300">conectada à IFAD</span>.
            </h1>
            <p className="text-sm md:text-base text-gray-200 max-w-xl mb-6">
              Planeje sua leitura da Bíblia, acompanhe devocionais e compartilhe
              pedidos de oração em comunidade. Tudo em um só lugar, integrado à{" "}
              <span className="font-semibold">
                Família Aliança de Um Novo Tempo (IFAD)
              </span>
              .
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/biblia"
                className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition"
              >
                Começar leitura agora
              </Link>
              <Link
                href={isLogged ? "/dashboard" : "/register"}
                className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium text-gray-100 hover:border-amber-400 hover:text-amber-200 transition"
              >
                {isLogged ? "Ver minha jornada" : "Criar minha conta gratuita"}
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-400 max-w-sm">
              Leitura da Bíblia e devocionais podem ser feitas como convidado.
              Com uma conta, você acompanha o progresso, participa de grupos e
              registra pedidos de oração.
            </p>
          </div>

          {/* CARD RESUMO / “painel” */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-xl space-y-4 text-sm">
            <h2 className="text-base font-semibold">
              Como o IFAD Connect pode te ajudar
            </h2>
            <div className="space-y-3 text-gray-200">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
                  1 · Leitura bíblica
                </p>
                <p>
                  Acompanhe planos de leitura e acesse capítulos da Bíblia
                  diretamente pela plataforma.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
                  2 · Devocionais
                </p>
                <p>
                  Leia reflexões preparadas pela liderança IFAD, conectadas à
                  leitura do dia.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-1">
                  3 · Comunidade e oração
                </p>
                <p>
                  Compartilhe pedidos de oração e caminhe junto com seu grupo,
                  célula ou ministério.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE BLOQUINHOS */}
        <section className="grid gap-4 md:grid-cols-3 mb-10 text-sm">
          <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm font-semibold mb-1">Acesso como convidado</h3>
            <p className="text-gray-200 text-xs">
              Leia trechos da Bíblia e devocionais mesmo sem cadastro. A ideia
              é que qualquer pessoa possa dar o primeiro passo.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm font-semibold mb-1">
              Jornada personalizada
            </h3>
            <p className="text-gray-200 text-xs">
              Ao criar uma conta, você acompanha seu progresso, recebe atalhos
              para a leitura do dia e se conecta aos grupos IFAD.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm font-semibold mb-1">
              Integrado à IFAD local
            </h3>
            <p className="text-gray-200 text-xs">
              A plataforma é mantida pela IFAD Família Aliança de Um Novo Tempo,
              em Guarulhos/SP, para servir membros e convidados.
            </p>
          </article>
        </section>

        <footer className="py-4 text-center text-xs text-gray-500">
          IFAD — Inspiração, Palavra e Caminho.
        </footer>
      </div>
    </main>
  );
}
