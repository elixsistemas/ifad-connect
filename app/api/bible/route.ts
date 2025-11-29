// app/api/bible/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getChapter } from "@/app/services/bible";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const version = searchParams.get("version") || "acf";
  const book = searchParams.get("book");
  const chapterParam = searchParams.get("chapter");
  const verseParam = searchParams.get("verse");

  if (!book || !chapterParam) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: book e chapter." },
      { status: 400 }
    );
  }

  const chapter = Number(chapterParam);
  const verse = verseParam ? Number(verseParam) : undefined;

  if (!Number.isFinite(chapter) || chapter < 1) {
    return NextResponse.json(
      { error: "Chapter inválido." },
      { status: 400 }
    );
  }

  try {
    const data = await getChapter(version, book, chapter);

    // se tiver verso, filtramos aqui
    const verses = verse
      ? data.verses.filter((v) => v.number === verse)
      : data.verses;

    return NextResponse.json({
      book: data.book,
      chapter: data.chapter,
      verses,
    });
  } catch (error) {
    console.error("Erro em /api/bible:", error);
    return NextResponse.json(
      { error: "Erro ao buscar texto bíblico." },
      { status: 500 }
    );
  }
}
