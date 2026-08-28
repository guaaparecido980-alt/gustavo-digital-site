'use client'

import { useEffect, useRef } from 'react'
import BotaoZap from '@/components/BotaoZap'
import { pilares } from '@/lib/projetos'
import { CAPITULOS, cena, heroVisivel, pilarAceso } from '@/lib/cena'
import { rolagem } from '@/lib/scroll'

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
 * Um requestAnimationFrame so, escrevendo direto no style: a 24 quadros por
 * segundo, um setState por quadro derruba o site.
 */

function aplicar(el: HTMLElement | null, t: number, saindo: boolean) {
  if (!el) return
  const resto = 1 - t
  const desloca = saindo ? resto * -60 : resto * 20
  el.style.opacity = t.toFixed(3)
  el.style.transform = `translate3d(0, ${desloca.toFixed(1)}px, 0)`
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
    let id = 0
    let visto = -1

    const passo = () => {
      // Relogio do filme, nao do scroll: ver lib/cena.ts
      const p = Math.round((rolagem.filme || rolagem.pin) * 2000) / 2000
      if (p !== visto) {
        visto = p

        aplicar(cenas.current[0], heroVisivel(p), true)
        for (let i = 1; i <= 6; i++) {
          aplicar(cenas.current[i], cena(i, p), p > CAPITULOS[i])
        }

        if (dica.current) dica.current.style.opacity = heroVisivel(p).toFixed(3)

        itens.current.forEach((li, i) => {
          if (!li) return
          const t = pilarAceso(i, p)
          li.style.opacity = (0.34 + t * 0.66).toFixed(3)
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
          if (li.dataset.aceso !== marca) {
            li.dataset.aceso = marca
            const num = li.querySelector('[data-num]') as HTMLElement | null
            if (num) num.style.color = aceso ? '#f2a33c' : ''
          }
        })
      }
      id = requestAnimationFrame(passo)
    }

    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
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
            <p className="kicker mb-6 block">Curitiba e região</p>
            <h1
              className="max-w-[11ch] text-[clamp(3rem,7.4vw,6rem)] font-medium leading-[0.96] tracking-[-0.035em] text-texto"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Seu negócio.
              <br />
              Mais <span className="text-acento">presente.</span>
            </h1>
            <p className={`${corpo} mt-9`}>
              Sites profissionais para quem atende de verdade — no ar, no Google
              e no bolso do cliente.
            </p>
            <div className="mt-12">
              <BotaoZap origem="hero">Falar no WhatsApp</BotaoZap>
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
              Antes de escolher, o cliente{' '}
              <span className="text-acento">procura</span>.
            </h2>
            <p className={corpo}>
              No celular, no Google, na hora exata em que decidiu resolver o
              problema dele.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2 · O CUSTO ──────────────────────────────────────── */}
      <div ref={guardar(2)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={2} />
        <div className="wrap">
          <div className={bloco}>
            <p className="kicker mb-5 block">O custo</p>
            <h2 className={`max-w-[14ch] ${titulo}`}>
              Quem não aparece não é{' '}
              <span className="text-acento">comparado</span>.
            </h2>
            <p className={corpo}>
              Não é que você perde para o concorrente. É que você não chega a
              entrar na disputa.
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
              Endereço no seu nome, sua marca, seus serviços. Não um perfil
              emprestado de rede social.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4 · OS QUATRO PILARES ────────────────────────────── */}
      <div ref={guardar(4)} className={palco} style={{ opacity: 0 }}>
        <FundoDaCena i={4} />
        <div className="wrap">
          <div className="revela tipo-3d w-full max-w-[46rem]">
            <p className="kicker mb-5 block">O que sustenta</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {pilares.map((pilar, i) => (
                <li
                  key={pilar.titulo}
                  ref={(n) => {
                    if (n) itens.current[i] = n
                  }}
                  className="pilar"
                  data-aceso="0"
                  style={{ opacity: 0.34 }}
                >
                  <span
                    data-num
                    className="text-[0.66rem] font-bold tracking-[0.2em] text-fraco"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 font-display text-[clamp(1.05rem,1.9vw,1.35rem)] font-semibold uppercase tracking-[-0.01em]">
                    {pilar.titulo}
                  </h3>
                  <p className="mt-1.5 text-[0.9rem] leading-[1.45] text-texto/95">
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
            <p className="kicker mb-5 block">Presença</p>
            <h2 className={`max-w-[15ch] ${titulo}`}>
              Seu negócio para de depender de{' '}
              <span className="text-acento">indicação</span>.
            </h2>
            <p className={corpo}>
              O site trabalha de madrugada, no domingo e no feriado — sempre que
              alguém procura o que você faz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
