// app/services/bible.ts

const BASE_URL =
  process.env.ABIBLIA_BASE_URL || "https://www.abibliadigital.com.br/api";
const TOKEN = process.env.ABIBLIA_TOKEN;

type BibleBook = {
  name: string;
  abbrev: {
    pt: string;
    en: string;
  };
};

export type Verse = {
  number: number;
  text: string;
};

export type ChapterResponse = {
  book: BibleBook;
  chapter: {
    number: number;
    verses: number;
  };
  verses: Verse[];
};

export type RandomVerse = {
  book: BibleBook;
  chapter: number;
  number: number;
  text: string;
};

async function bibleFetch<T>(path: string): Promise<T> {
  if (!TOKEN) {
    console.error("⚠️ ABIBLIA_TOKEN não configurado nas variáveis de ambiente.");
    throw new Error("ABIBLIA_TOKEN não configurado.");
  }

  const url = `${BASE_URL}${path}`;
  // console.log("➡️ ABíbliaDigital:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("❌ Erro ABíbliaDigital:", res.status, res.statusText, body);
    throw new Error(`Erro na ABíbliaDigital: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getRandomVerse(
  version: string = "nvi"
): Promise<RandomVerse> {
  return bibleFetch<RandomVerse>(`/verses/${version}/random`);
}

// capítulo inteiro (vamos usar tanto para capítulo quanto para 1 verso)
export async function getChapter(
  version: string,
  bookAbbrev: string,
  chapter: number
): Promise<ChapterResponse> {
  return bibleFetch<ChapterResponse>(
    `/verses/${version}/${bookAbbrev}/${chapter}`
  );
}
