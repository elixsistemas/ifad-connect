// app/devocionais/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDevotionalBySlug } from "@/app/services/devotionals";

// Next 16 + React 19: params é Promise
type DevocionalPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DevocionalPage({ params }: DevocionalPageProps) {
  const { slug } = await params;

  const devo = await getDevotionalBySlug(slug);
  if (!devo) {
    return notFound();
  }

  const dateLabel = new Date(devo.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* capa */}
        {devo.coverImage && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            <div className="relative w-full aspect-[21/9]">
            <Image
                src={devo.coverImage}
                alt={devo.title}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.18em] text-amber-200">
                {dateLabel} · {devo.readingRef}
            </div>
            </div>
        </div>
        )}

        {/* cabeçalho */}
        <header className="mb-4 space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {devo.title}
          </h1>
          {devo.subtitle && (
            <p className="text-sm text-gray-300">{devo.subtitle}</p>
          )}
          {devo.highlight && (
            <p className="text-sm text-amber-200 mt-1">{devo.highlight}</p>
          )}
        </header>

        {/* conteúdo */}
        <article className="text-sm leading-relaxed text-gray-100 space-y-3">
          {devo.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>

        {/* navegação */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-400">
          <Link
            href="/devocionais"
            className="hover:text-amber-300 transition"
          >
            ← Voltar para a lista de devocionais
          </Link>
          <Link
            href="/biblia"
            className="hover:text-amber-300 transition"
          >
            Ir para a leitura bíblica
          </Link>
        </div>
      </div>
    </main>
  );
}
