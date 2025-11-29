// app/sobre/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BrandBadge } from "@/app/components/BrandBadge";

export const metadata: Metadata = {
  title: "Sobre a IFAD – IFAD Connect",
  description:
    "Conheça a história, missão e valores da Igreja Evangélica Pentecostal Família Aliança de Um Novo Tempo (IFAD), em Guarulhos/SP.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#020617] bg-gradient-to-br from-[#020617] via-[#02081a] to-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* HEADER COM BRAND BADGE + LINKS */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <BrandBadge />

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Igreja Evangélica Pentecostal
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Família Aliança de Um Novo Tempo{" "}
                <span className="text-amber-300">(IFAD)</span>
              </h1>
              <p className="text-sm text-gray-200 max-w-2xl">
                Uma comunidade cristã comprometida com o ensino bíblico, a
                adoração e o serviço ao próximo.
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

        {/* CONTEÚDO */}
        <section className="space-y-5">
          {/* Quem somos */}
          <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Quem somos</h2>
            <p className="text-sm text-gray-100 mb-2">
              A IFAD nasceu com o propósito de ser{" "}
              <strong>um ponto de encontro</strong> para famílias que desejam
              <strong> crescer espiritualmente</strong> e viver o evangelho de
              Jesus de forma prática. Reunimos pessoas de diferentes gerações e
              contextos, em um lugar seguro para compartilhar a fé e aprender a
              Bíblia.
            </p>
            <p className="text-sm text-gray-100">
              Somos uma igreja evangélica pentecostal e temos como base de fé as
              Escrituras Sagradas — crendo na salvação em Cristo, na atuação do
              Espírito Santo e na responsabilidade de anunciar o evangelho.
            </p>
          </article>

          {/* Missão / Visão / Valores */}
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-sm font-semibold mb-1">Missão</h3>
              <p className="text-sm text-gray-100">
                Proclamar o evangelho e fortalecer famílias na Palavra.
              </p>
            </article>

            <article className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-sm font-semibold mb-1">Visão</h3>
              <p className="text-sm text-gray-100">
                Ser uma comunidade de fé que transforma vidas com amor.
              </p>
            </article>

            <article className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-sm font-semibold mb-1">Valores</h3>
              <ul className="text-sm text-gray-100 space-y-1 list-disc list-inside">
                <li>Adoração centrada em Cristo</li>
                <li>Formação bíblica consistente</li>
                <li>Comunhão e cuidado mútuo</li>
                <li>Serviço e ação social</li>
              </ul>
            </article>
          </section>

          {/* Nossa história */}
          <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Nossa história</h2>
            <p className="text-sm text-gray-100 mb-2">
              A IFAD teve início em 30 de janeiro de 2022, na Rua Jefe, 460,
              Jardim Cristina, Guarulhos/SP. Ao longo do tempo, estruturamos uma
              liderança capacitada e um espaço acolhedor para receber a
              comunidade. Cada etapa foi marcada pela fidelidade de Deus e pela
              dedicação de homens e mulheres que abraçaram o chamado para fazer
              discípulos.
            </p>
            <p className="text-sm text-gray-100">
              Seguimos avançando com evangelismo, discipulado e cuidado
              pastoral, para que cada pessoa encontre propósito e desenvolva
              seus dons para a glória do Senhor.
            </p>
          </article>

          {/* Ministérios */}
          <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Ministérios em ação</h2>
            <p className="text-sm text-gray-100 mb-2">
              Atendemos diferentes faixas etárias com ministérios de crianças,
              adolescentes, jovens, homens, mulheres e casais, além de louvor,
              intercessão, ação social e missões. As equipes são compostas por
              voluntários treinados que servem em unidade com a liderança
              pastoral.
            </p>
            <p className="text-sm text-gray-100">
              Incentivamos pequenos grupos de estudo bíblico ao longo do mês,
              promovendo acompanhamento pessoal e crescimento contínuo na
              Palavra.
            </p>
          </article>

          {/* Horários e localização */}
          <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Horários e localização</h2>
            <p className="text-sm text-gray-100 mb-2">
              Celebração aos <strong>domingos, às 18h</strong> (com programação
              infantil). Culto de ensinamento às{" "}
              <strong>quartas, às 19h30</strong>.
            </p>
            <p className="text-sm text-gray-100">
              <strong>Endereço:</strong> Rua Jefe, 460 – Jardim Cristina,
              Guarulhos/SP (próximo ao terminal São João).
            </p>
          </article>

          {/* Como participar */}
          <article className="rounded-2xl bg-white/5 border border-white/10 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Como participar</h2>
            <p className="text-sm text-gray-100 mb-2">
              Quer visitar um culto, conhecer nossos cursos ou servir em algum
              ministério? Fale com nossa equipe pastoral — será um prazer
              caminhar com você e ajudar no desenvolvimento dos seus dons.
            </p>
            <p className="text-sm text-gray-100">
              Use a{" "}
              <a
                href="/contato"
                className="text-amber-300 hover:text-amber-200 underline-offset-2 hover:underline"
              >
                página de contato
              </a>{" "}
              para enviar uma mensagem ou procure-nos nas redes sociais. Estamos
              à disposição para orar, aconselhar e celebrar com você cada passo
              de fé.
            </p>
          </article>
        </section>

        <footer className="mt-8 text-[11px] text-gray-500">
          IFAD — Inspiração, Palavra e Caminho.
        </footer>
      </div>
    </main>
  );
}
