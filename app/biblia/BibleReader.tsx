"use client";

import { FormEvent, useState } from "react";
import type { Verse } from "@/app/services/bible";

const VERSIONS = [
  { value: "acf", label: "Almeida Corrigida Fiel (ACF)" },
  { value: "nvi", label: "Nova Versão Internacional (NVI)" },
  { value: "ntlh", label: "Nova Tradução na Linguagem de Hoje (NTLH)" },
];

const RAW_BOOKS: [string, string, number][] = [
  ["gn","Gênesis",50],["ex","Êxodo",40],["lv","Levítico",27],["nm","Números",36],["dt","Deuteronômio",34],
  ["js","Josué",24],["jz","Juízes",21],["rt","Rute",4],["1sm","1 Samuel",31],["2sm","2 Samuel",24],
  ["1rs","1 Reis",22],["2rs","2 Reis",25],["1cr","1 Crônicas",29],["2cr","2 Crônicas",36],["ed","Esdras",10],
  ["ne","Neemias",13],["et","Ester",10],["jó","Jó",42],["sl","Salmos",150],["pv","Provérbios",31],
  ["ec","Eclesiastes",12],["ct","Cantares",8],["is","Isaías",66],["jr","Jeremias",52],["lm","Lamentações",5],
  ["ez","Ezequiel",48],["dn","Daniel",12],["os","Oseias",14],["jl","Joel",3],["am","Amós",9],["ob","Obadias",1],
  ["jn","Jonas",4],["mq","Miqueias",7],["na","Naum",3],["hc","Habacuque",3],["sf","Sofonias",3],["ag","Ageu",2],
  ["zc","Zacarias",14],["ml","Malaquias",4],["mt","Mateus",28],["mc","Marcos",16],["lc","Lucas",24],["jo","João",21],
  ["at","Atos",28],["rm","Romanos",16],["1co","1 Coríntios",16],["2co","2 Coríntios",13],["gl","Gálatas",6],
  ["ef","Efésios",6],["fp","Filipenses",4],["cl","Colossenses",4],["1ts","1 Tessalonicenses",5],["2ts","2 Tessalonicenses",3],
  ["1tm","1 Timóteo",6],["2tm","2 Timóteo",4],["tt","Tito",3],["fm","Filemom",1],["hb","Hebreus",13],["tg","Tiago",5],
  ["1pe","1 Pedro",5],["2pe","2 Pedro",3],["1jo","1 João",5],["2jo","2 João",1],["3jo","3 João",1],["jd","Judas",1],["ap","Apocalipse",22],
];

const BOOKS = RAW_BOOKS.map(([abbrev, name, chapters]) => ({
  abbrev,
  name,
  chapters,
}));

type ReadResult = {
  book: {
    name: string;
  };
  chapter: {
    number: number;
    verses: number;
  };
  verses: Verse[];
};

export function BibleReader() {
  const [version, setVersion] = useState("acf");
  const [book, setBook] = useState("jo");
  const [chapter, setChapter] = useState(3);
  const [verse, setVerse] = useState<string>(""); // verso opcional

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReadResult | null>(null);

  // 👉 controle de tamanho de fonte (px)
  const [fontSize, setFontSize] = useState<number>(15);

  const selectedBook = BOOKS.find((b) => b.abbrev === book);
  const chapterCount = selectedBook?.chapters ?? 1;
  const chapterOptions = Array.from({ length: chapterCount }, (_, i) => i + 1);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        version,
        book,
        chapter: String(chapter),
      });

      const parsedVerse = verse.trim() ? Number(verse.trim()) : undefined;
      if (parsedVerse && parsedVerse > 0) {
        params.set("verse", String(parsedVerse));
      }

      const res = await fetch(`/api/bible?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar texto bíblico.");
        return;
      }

      setResult(data as ReadResult);
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao consultar o texto bíblico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      {/* Formulário de seleção */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-semibold mb-1">Leitura</h2>

        <div className="grid gap-4 md:grid-cols-4 text-sm">
          {/* Versão */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Versão</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="rounded-md border border-white/10 bg-[#020617] px-3 py-2 text-sm text-white outline-none"
            >
              {VERSIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Livro */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Livro</label>
            <select
              value={book}
              onChange={(e) => {
                const nextBook = e.target.value;
                setBook(nextBook);
                // reset capítulo ao trocar de livro
                setChapter(1);
              }}
              className="rounded-md border border-white/10 bg-[#020617] px-3 py-2 text-sm text-white outline-none"
            >
              {BOOKS.map((b) => (
                <option key={b.abbrev} value={b.abbrev}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Capítulo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Capítulo</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              className="rounded-md border border-white/10 bg-[#020617] px-3 py-2 text-sm text-white outline-none"
            >
              {chapterOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Verso opcional */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">
              Verso (opcional)
            </label>
            <input
              type="number"
              min={1}
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Capítulo inteiro"
              className="rounded-md border border-white/10 bg-[#020617] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
            />
            <span className="text-[10px] text-gray-500">
              Deixe em branco para ler o capítulo inteiro.
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? "Carregando..." : "Ler"}
        </button>
      </form>

      {/* Resultado da leitura */}
      {result && (
        <>
          {/* Controles de tamanho da fonte */}
          <div className="flex items-center justify-end gap-2 text-[11px] text-gray-400">
            <span>Tamanho da fonte:</span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(12, s - 2))}
              className="rounded-full border border-white/15 px-2 py-1 hover:border-amber-400 hover:text-amber-200 transition"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize(15)}
              className="rounded-full border border-white/15 px-2 py-1 hover:border-amber-400 hover:text-amber-200 transition"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className="rounded-full border border-white/15 px-2 py-1 hover:border-amber-400 hover:text-amber-200 transition"
            >
              A+
            </button>
          </div>

          <section className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl text-sm leading-relaxed mt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-2">
              {result.book.name} {result.chapter.number}
              {verse.trim() ? `:${verse.trim()}` : " · capítulo"}
            </p>

            <div
              className="space-y-2"
              style={{ fontSize: fontSize, lineHeight: 1.7 }}
            >
              {result.verses.map((v) => (
                <p key={v.number}>
                  <span className="text-amber-300 mr-2">{v.number}</span>
                  {v.text}
                </p>
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
