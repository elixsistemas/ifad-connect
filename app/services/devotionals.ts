// app/services/devotionals.ts

export type DevotionalSummary = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO
  readingRef: string;
  highlight?: string;
  excerpt: string;
  coverImage: string; // imagem de capa
};

export type Devotional = DevotionalSummary & {
  content: string[]; // por enquanto, parágrafos simples
};

const DEVOS: Devotional[] = [
  {
    slug: "quando-deus-parece-em-silencio",
    title: "Quando Deus parece em silêncio",
    subtitle: "Confiar no que Ele já falou",
    date: "2025-01-02",
    readingRef: "Salmo 13",
    highlight:
      "A fé madura não ignora o silêncio de Deus, mas continua falando com Ele enquanto espera.",
    excerpt:
      "Davi ora como alguém que não tem medo de expor sua dor diante de Deus. Ele pergunta \"até quando?\", mas termina cantando sobre a fidelidade do Senhor. O caminho entre uma coisa e outra é a confiança.",
    coverImage: "/devocionais/quando-deus-parece-em-silencio.jpg",
    content: [
      "O salmo 13 começa com uma sequência de \"até quando?\". Davi não disfarça sua angústia. Ele fala com Deus a partir da dor que sente.",
      "No meio do salmo, ele faz um pedido específico: luz para os olhos, força para não ser vencido pelos inimigos. A oração sai da generalidade e entra na realidade concreta.",
      "O final é surpreendente: o salmista escolhe confiar na misericórdia de Deus e cantar a respeito da salvação que ainda não viu, mas crê que virá.",
      "Quando Deus parece em silêncio, podemos seguir o mesmo caminho: derramar o coração, apresentar pedidos concretos e terminar lembrando quem Ele é. O silêncio não significa abandono."
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
      "Antes de tentar controlar tudo hoje, experimente começar o dia abrindo o coração diante de Deus. Liste suas preocupações e entregue uma a uma. Ele continua no controle."
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
      "Jesus não responde com elogios ao currículo religioso de Nicodemos. Ele vai direto ao ponto: \"É necessário nascer de novo\". Não se trata de tentar mais forte, mas de receber uma nova vida que vem do alto.",
      "O novo nascimento é uma obra do Espírito Santo. Nós não controlamos o vento, mas percebemos seus efeitos. Da mesma forma, não controlamos o agir de Deus, mas vemos o fruto quando Ele transforma o coração.",
      "Hoje, em vez de apenas \"melhorar\" em algumas áreas, peça ao Senhor para renovar seu coração. Onde você tem tentado resolver na força do hábito? Entregue a Ele e permita que o Espírito sopre novidade de vida."
    ],
  },
];

export async function listDevotionals(): Promise<DevotionalSummary[]> {
  return DEVOS
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...rest }) => rest);
}

export async function getDevotionalBySlug(
  slug: string
): Promise<Devotional | null> {
  const devo = DEVOS.find((d) => d.slug === slug);
  return devo ?? null;
}
