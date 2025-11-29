// app/devocionais/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listDevotionals } from "@/app/services/devotionals";
import { BrandBadge } from "@/app/components/BrandBadge";

export const metadata: Metadata = {
  title: "Devocionais – IFAD Connect",
  description:
    "Leia devocionais diários conectados à leitura bíblica na plataforma IFAD Connect.",
};

export default async function DevocionaisPage() {
  const devos = await listDevotionals();

  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* topo */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
            {/* selo IFAD CONNECT reutilizável */}
            <BrandBadge />

            <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
                Devocionais
            </h1>
            <p className="text-sm text-gray-200 mt-2 max-w-xl">
                Mensagens curtas para acompanhar sua leitura bíblica, ajudar na
                reflexão diária e fortalecer sua fé em Cristo.
            </p>
            </div>
        </div>

        <nav className="text-xs flex flex-row md:flex-col items-end gap-3 md:gap-1">
            <Link
            href="/"
            className="text-gray-300 hover:text-amber-300 transition"
            >
            Voltar para o início
            </Link>
            <Link
            href="/biblia"
            className="text-gray-400 hover:text-amber-300 transition"
            >
            Ir para leitura bíblica
            </Link>
        </nav>
        </header>


        {/* grade de cards */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
          {devos.map((devo) => {
            const dateLabel = new Date(devo.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <Link
                key={devo.slug}
                href={`/devocionais/${devo.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-black/50 overflow-hidden shadow-lg hover:border-amber-400 hover:bg-black/70 transition"
              >

                {/* imagem */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                    src={devo.coverImage}
                    alt={devo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute left-4 bottom-3 text-[11px] uppercase tracking-[0.18em] text-amber-200">
                    {dateLabel} · {devo.readingRef}
                </p>
                </div>


                {/* texto */}
                <div className="flex-1 px-4 py-3 flex flex-col">
                  <h2 className="text-sm md:text-base font-semibold mb-0.5 group-hover:text-amber-200 transition">
                    {devo.title}
                  </h2>
                  {devo.subtitle && (
                    <p className="text-xs text-gray-300 mb-1">
                      {devo.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 line-clamp-3">
                    {devo.excerpt}
                  </p>
                  <span className="mt-3 text-[11px] text-amber-300 group-hover:text-amber-200 transition self-end">
                    Ler devocional →
                  </span>
                </div>
              </Link>
            );
          })}

          {devos.length === 0 && (
            <p className="text-sm text-gray-300">
              Em breve você encontrará devocionais publicados aqui.
            </p>
          )}
        </section>

        <footer className="mt-8 text-[11px] text-gray-500">
          Conteúdo devocional preparado pela liderança IFAD. Leia sempre com a
          Bíblia aberta e em espírito de oração.
        </footer>
      </div>
    </main>
  );
}
