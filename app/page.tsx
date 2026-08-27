import Cabecalho from '@/components/Cabecalho'
import BotaoZap from '@/components/BotaoZap'
import Faq from '@/components/Faq'
import LinkProjeto from '@/components/LinkProjeto'
import { pilares, projetos } from '@/lib/projetos'

const kicker = 'kicker mb-5 block'
const sec = 'relative py-[var(--sp)]'

export default function Home() {
  return (
    <>
      <Cabecalho />

      <main>
        {/* ============== HERO ============== */}
        <section id="topo" className="relative flex min-h-svh items-center pt-[68px]">
          {/* Placeholder da escultura. No Bloco C isso vira a cena WebGL,
              e esta imagem passa a ser o fallback. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[58%]"
          >
            <img
              src="/assets/anel-fallback.webp"
              alt=""
              width={1600}
              height={1600}
              className="h-full w-full object-contain opacity-70"
            />
          </div>

          <div className="wrap relative">
            <p className={kicker}>Gustavo Digital</p>

            <h1 className="max-w-[16ch] text-[clamp(2.6rem,7.5vw,6.4rem)] font-semibold">
              Seu negócio.
              <br />
              Mais <span className="text-acento">presente</span>.
            </h1>

            <p className="mt-7 max-w-[38ch] text-mudo">
              Sites profissionais que colocam sua empresa no lugar certo: no
              Google e ao alcance do cliente.
            </p>

            <div className="mt-10">
              <a
                href="#trabalhos"
                className="group inline-flex items-center gap-3 border-b border-fio-2 pb-2 text-[0.72rem] font-bold uppercase tracking-[0.2em]"
              >
                Conhecer o trabalho
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ============== PROBLEMA ============== */}
        <section id="problema" className={sec}>
          <div className="wrap grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className={kicker}>O problema</p>
              <h2 className="max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.4rem)]">
                Antes de ser escolhido, seu negócio precisa ser{' '}
                <span className="text-acento">encontrado</span>.
              </h2>
              <p className="mt-7 max-w-[40ch] text-mudo">
                A maior parte das buscas por serviço começa no Google. Quem não
                aparece ali não entra na comparação — e nem chega a ser
                comparado.
              </p>
              <div className="mt-10">
                <BotaoZap origem="problema" variante="discreto">
                  É hora de mudar isso
                </BotaoZap>
              </div>
            </div>

            {/* No Bloco E este espaco recebe o sistema orbital de esferas. */}
            <div
              aria-hidden
              className="hidden min-h-[26rem] lg:block"
              data-slot="orbital"
            />
          </div>
        </section>

        {/* ============== SOLUÇÃO ============== */}
        <section id="solucao" className={sec}>
          <div className="wrap">
            <p className={kicker}>A solução</p>
            <h2 className="max-w-[24ch] text-[clamp(1.9rem,4.4vw,3.4rem)]">
              Uma estrutura completa para gerar{' '}
              <span className="text-acento">resultados reais</span>.
            </h2>

            <ol className="mt-16 border-t border-fio">
              {pilares.map((p, i) => (
                <li
                  key={p.titulo}
                  className="grid gap-3 border-b border-fio py-9 sm:grid-cols-[4rem_1fr_minmax(0,44ch)] sm:items-baseline sm:gap-x-10"
                >
                  <span className="text-[0.7rem] font-bold tracking-[0.2em] text-fraco">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-semibold uppercase">
                    {p.titulo}
                  </h3>
                  <p className="text-mudo">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============== TRABALHOS ============== */}
        <section id="trabalhos" className={sec}>
          <div className="wrap">
            <p className={kicker}>Trabalhos</p>
            <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.4rem)]">
              Projetos que falam por <span className="text-acento">nós</span>.
            </h2>
          </div>

          <div className="mt-16 flex flex-col gap-[var(--sp)]">
            {projetos.map((p, i) => (
              <article key={p.id} className="wrap grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-end">
                <img
                  src={p.imagem}
                  alt={`Site da ${p.nome}`}
                  width={1600}
                  height={1000}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full"
                />

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-fraco">
                    No ar · {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold">
                    {p.nome}
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-fraco">
                    {p.segmento}
                  </p>
                  <p className="mt-5 max-w-[34ch] text-mudo">{p.linha}</p>

                  {p.url ? (
                    <div className="mt-8">
                      <LinkProjeto id={p.id} url={p.url} nome={p.nome} />
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============== PROVA ============== */}
        <section id="prova" className={sec}>
          {/* Depoimento fica de fora até existir um real e autorizado.
              O site atual não tem nenhum, e inventar aqui seria fraude. */}
          <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className={kicker}>Prova</p>
              <h2 className="max-w-[18ch] text-[clamp(1.7rem,3.4vw,2.6rem)]">
                Negócios reais, já no ar e sendo{' '}
                <span className="text-acento">encontrados</span>.
              </h2>
              <p className="mt-7 max-w-[38ch] text-mudo">
                Cada site abaixo pertence a um cliente que atende de verdade.
                Você pode abrir e conferir.
              </p>
            </div>

            <p className="font-display text-[clamp(4rem,11vw,9rem)] font-bold leading-[0.8] text-acento">
              14<span className="align-super text-[0.4em]">+</span>
              <span className="mt-4 block font-corpo text-[0.13em] font-normal uppercase tracking-[0.24em] text-mudo">
                Sites no ar
              </span>
            </p>
          </div>
        </section>

        {/* ============== INVESTIMENTO ============== */}
        <section id="investimento" className={sec}>
          <div className="wrap grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className={kicker}>Investimento</p>
              <h2 className="max-w-[18ch] text-[clamp(1.9rem,4.4vw,3.2rem)]">
                Site profissional com <span className="text-acento">tudo</span>{' '}
                que sua empresa precisa.
              </h2>
            </div>

            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-fraco">
                Plano mensal
              </p>

              <p className="mt-4 flex items-baseline gap-2 font-display font-bold">
                <span className="text-[clamp(1.6rem,3vw,2.4rem)]">R$</span>
                <span className="text-[clamp(4.5rem,13vw,10rem)] leading-[0.8]">
                  200
                </span>
                <span className="font-corpo text-sm font-normal text-mudo">
                  /mês
                </span>
              </p>

              <ul className="mt-10 grid gap-3 border-t border-fio pt-8 text-sm text-mudo sm:grid-cols-2">
                <li>Domínio incluso</li>
                <li>Hospedagem premium</li>
                <li>Manutenção e suporte</li>
                <li>Site rápido no celular</li>
                <li>Certificado de segurança</li>
                <li>Estrutura para o Google</li>
              </ul>

              <p className="mt-8 text-sm text-fraco">
                Sem taxa de criação. Sem fidelidade — cancele quando quiser.
              </p>

              <div className="mt-10">
                <BotaoZap origem="preco">Começar agora</BotaoZap>
              </div>
            </div>
          </div>
        </section>

        {/* ============== FAQ ============== */}
        <section id="faq" className={sec}>
          <div className="wrap grid gap-14 lg:grid-cols-[24rem_1fr] lg:gap-24">
            <div>
              <p className={kicker}>Dúvidas frequentes</p>
              <h2 className="text-[clamp(1.9rem,4.4vw,3rem)]">
                Perguntas <span className="text-acento">frequentes</span>.
              </h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* ============== CTA FINAL ============== */}
        <section id="final" className={`${sec} text-center`}>
          <div className="wrap">
            <p className={kicker}>Pronto para começar?</p>
            <h2 className="mx-auto max-w-[26ch] text-[clamp(1.8rem,4vw,3rem)]">
              Seu negócio já existe. Agora faça ele ser{' '}
              <span className="text-acento">visto</span>.
            </h2>
            <div className="mt-12 flex justify-center">
              <BotaoZap origem="final">Falar com especialista</BotaoZap>
            </div>
          </div>
        </section>
      </main>

      {/* ============== RODAPÉ ============== */}
      <footer className="border-t border-fio py-14">
        <div className="wrap flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.12em]">
              Gustavo <span className="text-acento">Digital</span>
            </p>
            <p className="mt-3 max-w-[30ch] text-sm text-mudo">
              Sites profissionais para negócios reais. Curitiba e região.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="grid gap-2 text-sm text-mudo">
              <li>
                <a href="#solucao" className="hover:text-texto">
                  O que inclui
                </a>
              </li>
              <li>
                <a href="#trabalhos" className="hover:text-texto">
                  Trabalhos
                </a>
              </li>
              <li>
                <a href="#investimento" className="hover:text-texto">
                  Preço
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-texto">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacidade.html" className="hover:text-texto">
                  Privacidade
                </a>
              </li>
            </ul>
          </nav>

          <div className="text-sm">
            <BotaoZap origem="rodape" variante="discreto">
              WhatsApp (41) 98709-5245
            </BotaoZap>
            <p className="mt-6 text-fraco">
              © {new Date().getFullYear()} Gustavo Digital
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
