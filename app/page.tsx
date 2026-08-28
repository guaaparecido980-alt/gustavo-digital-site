import Cabecalho from '@/components/Cabecalho'
import BotaoZap from '@/components/BotaoZap'
import CtaFixo from '@/components/CtaFixo'
import Faq from '@/components/Faq'
import FilmeVideo from '@/components/FilmeVideo'
import Atmosfera from '@/components/Atmosfera'
import Trilha from '@/components/Trilha'
import Suave from '@/components/Suave'
import Abertura from '@/components/Abertura'
import Trabalhos from '@/components/Trabalhos'
import Inclusos from '@/components/Inclusos'
import Marca from '@/components/Marca'
import { projetos } from '@/lib/projetos'
import Capitulos from '@/components/Capitulos'

const kicker = 'kicker mb-5 block'
// z-10 mantem todo o conteudo acima do canvas, que vive em z-0.
const sec = 'relative z-10 py-[var(--sp)]'

export default function Home() {
  return (
    <>
      <Suave />
      <Capitulos />
      <Abertura />
      <FilmeVideo />
      <Atmosfera />
      <Cabecalho />
      <CtaFixo />

      <main className="relative z-10">
        {/* Trilho virtual: o filme fica pinado; o scroll so avanca os quadros. */}
        <section
          id="trilha"
          data-cena="trilha"
          className="relative h-[560svh] md:h-[640svh]"
        >
          <div id="topo" className="absolute top-0 h-px w-px" />
          <div id="problema" className="absolute top-[10%] h-px w-px" />
          <div className="sticky top-0 h-svh">
            <Trilha />
          </div>
        </section>

        {/* ============== TUDO INCLUSO ============== */}
        {/* pt menor: a trilha ja termina com uma tela inteira de respiro */}
        <section
          id="solucao"
          data-cena="incluso"
          className="relative z-10 pb-[var(--sp)] pt-[clamp(24px,4vh,56px)]"
        >
          <div className="wrap">
            <p className={kicker}>No mesmo valor</p>
            <h2 className="max-w-[18ch] text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
              Tudo o que o site precisa para{' '}
              <span className="text-acento">funcionar</span>.
            </h2>
            <Inclusos />
          </div>
        </section>

        {/* ============== TRABALHOS ============== */}
        <section id="trabalhos" data-cena="trabalhos" className={sec}>
          <div className="wrap">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className={kicker}>Projetos</p>
                <h2 className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)]">
                  Negócios reais, no ar{' '}
                  <span className="text-acento">agora</span>.
                </h2>
                <p className="mt-7 max-w-[38ch] text-mudo">
                  Barbearia, academia, engenharia, advocacia, oficina. Cada
                  endereço abaixo é de um cliente que atende todo dia — pode
                  abrir e conferir.
                </p>
              </div>

              <p className="font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.8] text-acento">
                {/* Vem da lista: o numero nunca fica velho quando entra ou
                    sai um trabalho da vitrine. */}
                {projetos.length}
                <span className="align-super text-[0.4em]">+</span>
                <span className="mt-3 block font-corpo text-[0.16em] font-normal uppercase tracking-[0.24em] text-mudo">
                  Negócios no ar
                </span>
              </p>
            </div>

            <Trabalhos />
          </div>
        </section>

        {/* ============== INVESTIMENTO ============== */}
        <section id="investimento" data-cena="preco" className={sec}>
          <div className="wrap grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className={kicker}>Investimento</p>
              <h2 className="max-w-[19ch] text-[clamp(1.9rem,4.4vw,3.2rem)]">
                Um site de agência sem a{' '}
                <span className="text-acento">conta</span> de agência.
              </h2>
              <p className="mt-7 max-w-[36ch] text-mudo">
                Você não compra um arquivo e fica sozinho com ele. Contrata o
                site funcionando: no ar, atualizado e com quem cuidar dele.
              </p>
            </div>

            <div>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-fraco">
                Mensalidade única
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
                <li>Criação do site</li>
                <li>Domínio no seu nome</li>
                <li>Hospedagem e site no ar</li>
                <li>Certificado de segurança</li>
                <li>Estrutura preparada para o Google</li>
                <li>Alterações sempre que precisar</li>
              </ul>

              <p className="mt-8 text-sm text-fraco">
                Sem taxa de criação e sem fidelidade: você não fica preso a
                contrato longo para ter um site profissional.
              </p>

              <div className="mt-10">
                <BotaoZap origem="preco">Quero meu site</BotaoZap>
              </div>
            </div>
          </div>
        </section>

        {/* ============== FAQ ============== */}
        <section id="faq" data-cena="faq" className={sec}>
          <div className="wrap grid gap-14 lg:grid-cols-[24rem_1fr] lg:gap-24">
            <div>
              <p className={kicker}>Antes de chamar</p>
              <h2 className="text-[clamp(1.9rem,4.4vw,3rem)]">
                O que costumam{' '}
                <span className="text-acento">perguntar</span>.
              </h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* ============== CTA FINAL ============== */}
        {/* A chamada final ocupa uma tela: com 362px ela encostava no
            cabecalho quando a rolagem terminava, e o botao ficava espremido
            embaixo do logotipo em vez de fechar a pagina. */}
        <section
          id="final"
          data-cena="final"
          className="relative z-10 flex min-h-[76svh] items-center py-[var(--sp)] text-center"
        >
          <div className="wrap">
            <h2 className="mx-auto max-w-[24ch] text-[clamp(1.8rem,4vw,3rem)]">
              Seu negócio já existe. Falta o{' '}
              <span className="text-acento">endereço</span> dele.
            </h2>
            <p className="mx-auto mt-7 max-w-[30ch] text-mudo">
              R$200 por mês, com tudo incluso. Sem taxa para começar.
            </p>
            <div className="mt-11 flex justify-center">
              <BotaoZap origem="final">Quero meu site</BotaoZap>
            </div>
          </div>
        </section>
      </main>

      {/* ============== RODAPÉ ============== */}
      {/* relative z-10 e obrigatorio: o canvas do filme e `fixed`, e elemento
          posicionado pinta por cima de elemento estatico mesmo com z-index
          menor. Sem isso o rodape ficava escondido atras do filme apagado —
          uma faixa preta no fim da pagina. */}
      <footer className="relative z-10 border-t border-fio pb-[104px] pt-9 lg:pb-14 lg:pt-14">
        <div className="wrap flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div>
            <Marca />
            <p className="mt-2.5 max-w-[30ch] text-sm text-mudo">
              Sites profissionais para negócios reais. Curitiba e região.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-mudo sm:grid-cols-1">
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
            <p className="mt-4 text-fraco">
              © 2026 Gustavo Digital · CNPJ 65.788.189/0001-74
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
