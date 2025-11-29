// app/biblia/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BibleReader } from "./BibleReader";
import { BrandBadge } from "@/app/components/BrandBadge";

export const metadata: Metadata = {
  title: "Leitura bíblica – IFAD Connect",
  description:
    "Leia a Bíblia por versão, livro, capítulo e versículo na plataforma IFAD Connect.",
};

export default function BibliaPage() {
  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* topo */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
            <BrandBadge />

            <p className="text-sm text-gray-200 mt-2 max-w-xl">
            Leia a Bíblia sem necessidade de login. Em breve, quem estiver
            logado poderá acompanhar o progresso de leitura dentro da
            plataforma.
            </p>
        </div>

        <nav className="text-xs flex flex-row md:flex-col items-end gap-3 md:gap-1">
            <Link
            href="/"
            className="text-gray-300 hover:text-amber-300 transition"
            >
            Voltar para o início
            </Link>
            <Link
            href="/login"
            className="text-gray-400 hover:text-amber-300 transition"
            >
            Entrar para salvar progresso
            </Link>
        </nav>
        </header>

        <BibleReader />

        <footer className="mt-8 text-[11px] text-gray-500">
          Texto bíblico fornecido por ABíbliaDigital (abibliadigital.com.br).
        </footer>
      </div>
    </main>
  );
}
