'use client'

import { useEffect, useRef } from 'react'
import BotaoZap from '@/components/BotaoZap'
import { pilares } from '@/lib/projetos'
import { CAPITULOS, cena, heroVisivel, pilarAceso } from '@/lib/cena'
import { rolagem } from '@/lib/scroll'
import { aCadaQuadro, ORDEM } from '@/lib/relogio'

/**
 * As cenas da trilha pinada.
 *
 * A travessia salta direto ate o fim do filme: a rede explodindo e o planeta
 * acendendo acontecem inteiros dentro de um movimento so.
 *
 * Regras que valem para todas:
 *
 * - Uma cena por vez. Nunca dois textos dividindo a tela.
 * - O filme termina, depois o texto entra — a entrada espera a camera pousar.
 * - Na saida o texto acompanha o movimento: sobe junto com a camera. Sem
 *   desfoque, que atrapalhava a leitura bem na hora errada.
 *
 * Um passo por quadro no relogio central, escrevendo direto no style: a 24
 * quadros por segundo, um setState por quadro derruba o site. E o passo entra
 * depois do filme, na ordem declarada em lib/relogio.ts, para o texto reagir
 * ao quadro que esta na tela agora e nao ao anterior.
 */

function aplicar(el: HTMLElement | null, t: number, saindo: boolean) {
  if (!el) return
  const resto = 1 - t
  // Pixel inteiro: em fracao de pixel o navegador rasteriza a tipografia
  // entre pontos da tela e o texto sai borrado o tempo todo do movimento.
  //
  // A viagem de saida e curta de proposito. Subindo sessenta pixels, o texto
  // continuava se mexendo depois de ja estar quase invisivel, e essa cauda se
  // lia como atraso — a pessoa rolava e ainda via o texto anterior andando.
  const desloca = Math.round(saindo ? resto * -22 : resto * 16)
  el.style.opacity = t.toFixed(2)
  el.style.transform = desloca === 0 ? 'none' : `translate3d(0, ${desloca}px, 0)`
  el.style.pointerEvents = t > 0.4 ? 'auto' : 'none'
  const ativo = t > 0.5 ? '1' : '0'
  if (el.dataset.ativo !== ativo) el.dataset.ativo = ativo
}

const palco =
  'cena absolute inset-0 flex items-center pt-[88px] pb-[92px] sm:pb-[76px]'

/**
 * O quadro que representa cada parada, para a versao sem movimento.
 *
 * Ali nao existe filme correndo: cada cena mostra, parada ao fundo, a imagem
 * exata em que a camera pousaria se houvesse animacao.
 */
const QUADRO_DA_CENA = [1, 17, 34, 50, 75, 99, 165]

function FundoDaCena({ i }: { i: number }) {
  const n = String(QUADRO_DA_CENA[i] ?? 1).padStart(3, '0')
  return (
    <img
      src={`/filme/q${n}.webp`}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className="cena-fundo"
    />
  )
}
const bloco = 'painel revela tipo-3d max-w-[44rem]'
const titulo =
  'text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-texto'
const corpo =
  'mt-7 max-w-[34ch] text-[clamp(1.02rem,1.4vw,1.18rem)] leading-[1.5] text-texto'

export default function Trilha() {
  const cenas = useRef<(HTMLDivElement | null)[]>([])
  const dica = useRef<HTMLDivElement>(null)
  const itens = useRef<HTMLLIElement[]>([])

  useEffect(() => {
    let visto = -1

    return aCadaQuadro(ORDEM.CENA, () => {
      // Relogio do filme, nao do scroll: ver lib/cena.ts
      const p = Math.round((rolagem.filme || rolagem.pin) * 2000) / 2000
      if (p !== visto) {
        visto = p

        aplicar(cenas.current[0], heroVisivel(), true)
        for (let i = 1; i <= 6; i++) {
          aplicar(cenas.current[i], cena(i, p), p > CAPITULOS[i])
        }

        if (dica.current) dica.current.style.opacity = heroVisivel().toFixed(3)

        itens.current.forEach((li, i) => {
          if (!li) return
          const t = pilarAceso(i, p)
          // Comeca em 0,55 e nao em 0,34.
          //
          // Os quatro entram escalonados, um depois do outro; a 34% os que
          // ainda nao chegaram a vez pareciam apagados, como se a tela
          // tivesse escurecido. Mais alto eles leem como "esperando", que e o
          // que sao — e o escalonamento continua visivel.
          li.style.opacity = (0.55 + t * 0.45).toFixed(3)
          li.style.transform = `translate3d(0, ${((1 - t) * 12).toFixed(1)}px, 0)`

          // Histerese: acende em 0.6 e so apaga abaixo de 0.3.
          //
          // Com um limiar unico, qualquer tremida do progresso em torno dele
          // fazia o card piscar entre aceso e apagado — e o progresso treme
          // justamente quando a rolagem para, que e quando a pessoa esta
          // olhando. Com duas linhas separadas, ele precisa recuar de verdade
          // para desligar.
          const estava = li.dataset.aceso === '1'
          const aceso = estava ? t > 0.3 : t > 0.6
          const marca = aceso ? '1' : '0'
          // So a marca. A cor do numero e do CSS, ver .pilar[data-aceso].
          if (li.dataset.aceso !== marca) li.dataset.aceso = marca
        })
      }
    })
  }, [])

  const guardar = (i: number) => (n: HTMLDivElement | null) => {
    cenas.current[i] = n
  }

  return (
    <div className="relative h-svh">
      {/* ── 0 · HERO ─────────────────────────────────────────── */}
      <div
        ref={guardar(0)}
        className="cena absolute inset-0 flex flex-col pt-[88px]"
        style={{ willChange: 'opacity, transform' }}
      >
        <div className="wrap flex flex-1 items-center">
          <div className="painel hero-intro tipo-3d">
            <p className="kicker mb-6 block">Criação de sites · Curitiba</p>
            <h1
              className="max-w-[11ch] text-[clamp(3rem,7.4vw,6rem)] font-medium leading-[0.96] tracking-[-0.035em] text-texto"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Seu negócio.
              <br />
              Mais <span className="text-acento">presente.</span>
            </h1>
            <p className={`${corpo} mt-9`}>
              Site profissional para pequenos negócios, com domínio, hospedagem
              e manutenção inclusos. R$200 por mês, sem taxa de criação.
            </p>
            <div className="mt-12">
              <BotaoZap origem="hero">Quero meu site</BotaoZap>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="ml-[var(--pad)] h-px bg-gradient-to-r from-acento/85 via-acento/35 to-transparent"
        />
        <div
          ref={dica}
          className="mb-16 flex flex-col items-center gap-3 py-7 sm:mb-8"
        >
          <span
            aria-hidden
            className="flex h-9 w-5 justify-center rounded-full border border-acento/45 pt-1.5"
          >
            <span className="h-1.5 w-1 rounded-full bg-acento animate-bounce" />
          </span>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-acento">
            Role para explorar
          </p>
        </div>
      </div>

      {/* ── 1 · O PROBLEMA ───────────────────────────────────── */}
      <div ref={guardar(1)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={1} />
        <div className="wrap">
          <div className={bloco}>
            <p className="kicker mb-5 block">O problema</p>
            <h2 className={`max-w-[15ch] ${titulo}`}>
              Antes de chamar, o cliente{' '}
              <span className="text-acento">procura</span>.
            </h2>
            <p className={corpo}>
              Mesmo quando chega por indicação, ele pesquisa o nome do seu
              negócio antes de mandar a primeira mensagem.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2 · O CUSTO ──────────────────────────────────────── */}
      <div ref={guardar(2)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={2} />
        <div className="wrap">
          <div className={bloco}>
            <p className="kicker mb-5 block">O que está em jogo</p>
            <h2 className={`max-w-[15ch] ${titulo}`}>
              O que ele encontra responde{' '}
              <span className="text-acento">antes de você</span>.
            </h2>
            <p className={corpo}>
              Um perfil parado, um endereço errado, nada no Google. A conversa
              começa com essa impressão — ou não começa.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3 · A VIRADA ─────────────────────────────────────── */}
      <div ref={guardar(3)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={3} />
        <div className="wrap">
          <div className={bloco}>
            <p className="kicker mb-5 block">A virada</p>
            <h2 className={`max-w-[15ch] ${titulo}`}>
              Um site é onde a busca{' '}
              <span className="text-acento">termina</span>.
            </h2>
            <p className={corpo}>
              Endereço no seu nome, com seus serviços, suas fotos e seu horário.
              O que ele precisava saber para chamar você.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 · OS QUATRO PILARES ────────────────────────────── */}
      <div ref={guardar(4)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={4} />
        <div className="wrap">
          <div className="revela tipo-3d w-full max-w-[40rem]">
            <p className="kicker mb-5 block">O que está incluso</p>
            <ol className="grid gap-2.5 sm:grid-cols-2">
              {pilares.map((pilar, i) => (
                <li
                  key={pilar.titulo}
                  ref={(n) => {
                    if (n) itens.current[i] = n
                  }}
                  className="pilar"
                  data-aceso="0"
                  style={{ opacity: 0.55 }}
                >
                  <span
                    data-num
                    className="text-[0.66rem] font-bold tracking-[0.2em] text-fraco"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-0.5 font-display text-[clamp(0.92rem,1.6vw,1.15rem)] font-semibold uppercase tracking-[-0.01em]">
                    {pilar.titulo}
                  </h3>
                  <p className="mt-1 text-[0.8rem] leading-[1.4] text-texto/90">
                    {pilar.texto}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ── 5 · A TRAVESSIA ──────────────────────────────────── */}
      <div
        ref={guardar(5)}
        className="cena absolute inset-0 z-[12] grid place-items-center px-[var(--pad)]"
        style={{ opacity: 0 }}
      >
        <FundoDaCena i={5} />
        <h2 className="painel painel-centro revela tipo-3d max-w-[13ch] text-center text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-texto">
          O site que gera{' '}
          <span
            className="text-acento"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
          >
            cliente.
          </span>
        </h2>
      </div>

      {/* ── 6 · A CHEGADA ────────────────────────────────────── */}
      <div ref={guardar(6)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={6} />
        <div className="wrap">
          <div className={bloco}>
            <p className="kicker mb-5 block">O resultado</p>
            <h2 className={`max-w-[15ch] ${titulo}`}>
              A indicação chega. O site{' '}
              <span className="text-acento">confirma</span>.
            </h2>
            <p className={corpo}>
              Domingo à noite, feriado, três da manhã: quem procurar encontra o
              seu negócio inteiro e o botão para falar com você.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
