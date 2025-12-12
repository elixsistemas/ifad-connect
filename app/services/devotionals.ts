// app/services/devotionals.ts

export type DevotionalSummary = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO
  readingRef: string;
  highlight?: string;
  excerpt: string;
  coverImage: string; // URL absoluta da capa
};

export type Devotional = DevotionalSummary & {
  content: string[]; // parágrafos simples
};

// ===== Fallback local (caso Strapi caia) =========================

const DEVOS_FALLBACK: Devotional[] = [
  {
    slug: "quando-deus-parece-em-silencio",
    title: "Quando Deus parece em silêncio",
    subtitle: "Confiar no que Ele já falou",
    date: "2025-01-02",
    readingRef: "Salmo 13",
    highlight:
      "A fé madura não ignora o silêncio de Deus, mas continua falando com Ele enquanto espera.",
    excerpt:
      'Davi ora como alguém que não tem medo de expor sua dor diante de Deus. Ele pergunta "até quando?", mas termina cantando sobre a fidelidade do Senhor. O caminho entre uma coisa e outra é a confiança.',
    coverImage: "/devocionais/quando-deus-parece-em-silencio.jpg",
    content: [
      'O salmo 13 começa com uma sequência de "até quando?". Davi não disfarça sua angústia. Ele fala com Deus a partir da dor que sente.',
      "No meio do salmo, ele faz um pedido específico: luz para os olhos, força para não ser vencido pelos inimigos. A oração sai da generalidade e entra na realidade concreta.",
      "O final é surpreendente: o salmista escolhe confiar na misericórdia de Deus e cantar a respeito da salvação que ainda não viu, mas crê que virá.",
      "Quando Deus parece em silêncio, podemos seguir o mesmo caminho: derramar o coração, apresentar pedidos concretos e terminar lembrando quem Ele é. O silêncio não significa abandono.",
    ],
  },
  {
    slug: "quando-o-dia-comeca-pesado",
    title: "Quando o dia começa pesado",
    subtitle: "Levar tudo em oração",
    date: "2025-01-01",
    readingRef: "Filipenses 4.4–7",
    highlight:
      "A paz de Deus não depende da ausência de problemas, mas da presença dEle no meio deles.",
    excerpt:
      "Nem todo dia começa leve. Existem notícias, contas, preocupações. Paulo escreve sobre alegria e paz não de um lugar confortável, mas da prisão. O segredo não é negar a realidade, e sim levar tudo diante de Deus.",
    coverImage: "/devocionais/quando-o-dia-comeca-pesado.jpg",
    content: [
      "Paulo chama a igreja a se alegrar no Senhor, não nas circunstâncias. Alegrar-se no Senhor é lembrar quem Deus é, mesmo quando tudo ao redor parece instável.",
      "Ele nos convida a trocar preocupação por oração. Não é fingir que está tudo bem, é apresentar a Deus cada detalhe: pedidos, mas também ações de graças.",
      "A promessa é que a paz de Deus guardará nossos corações e mentes. Não é uma paz lógica, mas real: ela protege nossos pensamentos para que não sejamos dominados pela ansiedade.",
      "Antes de tentar controlar tudo hoje, experimente começar o dia abrindo o coração diante de Deus. Liste suas preocupações e entregue uma a uma. Ele continua no controle.",
    ],
  },
  {
    slug: "nascer-de-novo",
    title: "Nascer de novo",
    subtitle: "Quando religião não é suficiente",
    date: "2024-12-31",
    readingRef: "João 3.1–8",
    highlight:
      "É possível estar perto das coisas de Deus e ainda assim não ter sido transformado por Ele.",
    excerpt:
      "Nicodemos conhecia as Escrituras, participava da religião, mas ainda assim sentia um vazio. O encontro com Jesus revela que o novo nascimento não é uma melhoria de comportamento, mas uma obra do Espírito.",
    coverImage: "/devocionais/nascer-de-novo.jpg",
    content: [
      "Nicodemos procurou Jesus à noite. Ele tinha conhecimento, posição e reputação. Ainda assim, algo o inquietava. Talvez você se identifique: conhece a Bíblia, participa de cultos, mas sente que falta algo.",
      'Jesus não responde com elogios ao currículo religioso de Nicodemos. Ele vai direto ao ponto: "É necessário nascer de novo". Não se trata de tentar mais forte, mas de receber uma nova vida que vem do alto.',
      "O novo nascimento é uma obra do Espírito Santo. Nós não controlamos o vento, mas percebemos seus efeitos. Da mesma forma, não controlamos o agir de Deus, mas vemos o fruto quando Ele transforma o coração.",
      "Hoje, em vez de apenas \"melhorar\" em algumas áreas, peça ao Senhor para renovar seu coração. Onde você tem tentado resolver na força do hábito? Entregue a Ele e permita que o Espírito sopre novidade de vida.",
    ],
  },
];

// ===== Helper para falar com o Strapi via GraphQL =================

const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

type StrapiGraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function strapiQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!STRAPI_GRAPHQL_URL || !STRAPI_API_TOKEN) {
    console.warn(
      "[strapiQuery] STRAPI_GRAPHQL_URL ou STRAPI_API_TOKEN não configurados. Usando fallback local."
    );
    throw new Error("STRAPI_NOT_CONFIGURED");
  }

  const res = await fetch(STRAPI_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    // cache básico para SSG/ISR
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[strapiQuery] HTTP error", res.status, text);
    throw new Error(`STRAPI_HTTP_${res.status}`);
  }

  const json = (await res.json()) as StrapiGraphQLResponse<T>;

  if (json.errors?.length) {
    console.error(
      "[strapiQuery] GraphQL errors",
      JSON.stringify(json.errors, null, 2)
    );
    throw new Error("STRAPI_GRAPHQL_ERROR");
  }

  if (!json.data) {
    throw new Error("STRAPI_NO_DATA");
  }

  return json.data;
}

// helper tosco pra transformar Rich text (Blocks) em parágrafos simples
function blocksToParagraphs(blocks: any): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b.type === "paragraph" && Array.isArray(b.children))
    .map((b) =>
      b.children
        .map((child: any) =>
          typeof child?.text === "string" ? child.text : ""
        )
        .join("")
        .trim()
    )
    .filter((p) => p.length > 0);
}

// ===== Funções públicas ==========================================

export async function listDevotionals(): Promise<DevotionalSummary[]> {
  try {
    const query = /* GraphQL */ `
      query ListDevotionals {
        devotionals(sort: "date:desc") {
          documentId
          title
          slug
          date
          readingRef
          subtitle
          highlight
          excerpt
          coverImage {
            url
          }
        }
      }
    `;

    type GqlDevotional = {
      devotionals: Array<{
        documentId: string;
        title: string | null;
        slug: string | null;
        date: string | null;
        readingRef: string | null;
        subtitle: string | null;
        highlight: string | null;
        excerpt: string | null;
        coverImage: { url: string | null } | null;
      }>;
    };

    const data = await strapiQuery<GqlDevotional>(query);

    return data.devotionals.map((d) => ({
      slug: d.slug ?? "",
      title: d.title ?? "Devocional",
      subtitle: d.subtitle ?? undefined,
      date: d.date ?? new Date().toISOString().slice(0, 10),
      readingRef: d.readingRef ?? "",
      highlight: d.highlight ?? undefined,
      excerpt: d.excerpt ?? "",
      coverImage: d.coverImage?.url
        ? `${STRAPI_BASE_URL}${d.coverImage.url}`
        : "/devocionais/placeholder.jpg",
    }));
  } catch (err) {
    console.error("[listDevotionals] Erro ao buscar devocionais no Strapi", err);
    // fallback local
    return DEVOS_FALLBACK.map(({ content, ...rest }) => rest);
  }
}

export async function getDevotionalBySlug(
  slug: string
): Promise<Devotional | null> {
  try {
    const query = /* GraphQL */ `
      query DevotionalBySlug($slug: String!) {
        devotionals(filters: { slug: { eq: $slug } }) {
          documentId
          title
          slug
          date
          readingRef
          subtitle
          highlight
          excerpt
          content
          coverImage {
            url
          }
        }
      }
    `;

    type GqlDevotionalBySlug = {
      devotionals: Array<{
        documentId: string;
        title: string | null;
        slug: string | null;
        date: string | null;
        readingRef: string | null;
        subtitle: string | null;
        highlight: string | null;
        excerpt: string | null;
        content: any; // JSON (Rich text Blocks)
        coverImage: { url: string | null } | null;
      }>;
    };

    const data = await strapiQuery<GqlDevotionalBySlug>(query, { slug });

    const devo = data.devotionals[0];
    if (!devo) return null;

    const paragraphs = blocksToParagraphs(devo.content);

    return {
      slug: devo.slug ?? slug,
      title: devo.title ?? "Devocional",
      subtitle: devo.subtitle ?? undefined,
      date: devo.date ?? new Date().toISOString().slice(0, 10),
      readingRef: devo.readingRef ?? "",
      highlight: devo.highlight ?? undefined,
      excerpt: devo.excerpt ?? "",
      coverImage: devo.coverImage?.url
        ? `${STRAPI_BASE_URL}${devo.coverImage.url}`
        : "/devocionais/placeholder.jpg",
      content: paragraphs.length > 0 ? paragraphs : [devo.excerpt ?? ""],
    };
  } catch (err) {
    console.error(
      "[getDevotionalBySlug] Erro ao buscar devocional no Strapi",
      err
    );

    // fallback local
    const devo = DEVOS_FALLBACK.find((d) => d.slug === slug);
    return devo ?? null;
  }
}

// ===== Devocional do dia ==========================================

export async function getDevotionalOfTheDay(): Promise<DevotionalSummary | null> {
  const devos = await listDevotionals();

  if (!devos.length) return null;

  // date está num formato ISO "YYYY-MM-DD"
  const today = new Date().toISOString().slice(0, 10);

  // filtra apenas devos com date definida
  const withDate = devos.filter((d) => !!d.date);

  if (!withDate.length) {
    // se ninguém tiver date, devolve o primeiro da lista como fallback
    return devos[0];
  }

  // pega devos com data <= hoje
  const olderOrToday = withDate.filter((d) => d.date <= today);

  // se não tiver nenhum <= hoje (caso todas as datas sejam futuras),
  // usa a lista completa com date
  const pool = olderOrToday.length ? olderOrToday : withDate;

  // ordena por data desc (mais recente primeiro)
  pool.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });

  return pool[0] ?? null;
}
