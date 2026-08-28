'use client'

import { useEffect, useRef } from 'react'
import { projetos } from '@/lib/projetos'
import { cliqueProjeto } from '@/lib/tracking'
import { querMenosMovimento } from '@/lib/qualidade'

/** Pixels por quadro de animacao. Devagar: e ambiente, nao apresentacao. */
const VELOCIDADE = 0.42
/** Silencio depois de a pessoa mexer, antes de voltar a andar sozinho. */
const RETOMA = 2200

/**
 * Os sites que ja estao no ar.
 *
 * Uma esteira que anda sozinha para a direita e aceita arrasto lateral. A
 * lista aparece duas vezes de proposito: quando a primeira copia termina de
 * passar, a rolagem volta ao inicio no ponto exato em que a segunda comeca —
 * o corte cai onde as duas sao identicas, entao o movimento parece nao ter
 * fim. Quem toca assume o controle, e a esteira so retoma depois de um tempo
 * parada.
 */
export default function Trabalhos() {
  const pista = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = pista.current
    if (!el) return
    if (querMenosMovimento()) return

    let raf = 0
    let paradoAte = 0

    const passo = () => {
      const metade = el.scrollWidth / 2
      if (performance.now() > paradoAte && metade > 0) {
        el.scrollLeft += VELOCIDADE
        // Volta ao comeco no ponto em que as duas copias coincidem.
        if (el.scrollLeft >= metade) el.scrollLeft -= metade
      }
      raf = requestAnimationFrame(passo)
    }

    const segurar = () => {
      paradoAte = Number.MAX_SAFE_INTEGER
    }
    const soltar = () => {
      paradoAte = performance.now() + RETOMA
    }

    el.addEventListener('pointerdown', segurar)
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)
    el.addEventListener('mouseenter', segurar)
    el.addEventListener('mouseleave', soltar)
    el.addEventListener('touchstart', segurar, { passive: true })
    el.addEventListener('touchend', soltar, { passive: true })
    el.addEventListener('wheel', soltar, { passive: true })

    raf = requestAnimationFrame(passo)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', segurar)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
      el.removeEventListener('mouseenter', segurar)
      el.removeEventListener('mouseleave', soltar)
      el.removeEventListener('touchstart', segurar)
      el.removeEventListener('touchend', soltar)
      el.removeEventListener('wheel', soltar)
    }
  }, [])

  const fila = [...projetos, ...projetos]

  return (
    <div
      ref={pista}
      className="esteira mt-12 flex gap-4 overflow-x-auto pb-2"
      aria-label="Sites de clientes no ar"
    >
      {fila.map((projeto, i) => (
        <a
          key={`${projeto.id}-${i}`}
          href={projeto.url ?? undefined}
          target={projeto.url ? '_blank' : undefined}
          rel={projeto.url ? 'noreferrer' : undefined}
          aria-hidden={i >= projetos.length}
          tabIndex={i >= projetos.length ? -1 : undefined}
          onClick={() => projeto.url && cliqueProjeto(projeto.id, projeto.url)}
          className={`card-vidro w-[76vw] shrink-0 sm:w-[42vw] lg:w-[26rem] ${
            projeto.url ? '' : 'pointer-events-none'
          }`}
        >
          {/* Duas larguras: no celular a versao de 800px pesa 27KB contra
              71KB da cheia, e o card nunca passa de 76vw mesmo. */}
          <img
            src={projeto.imagem}
            srcSet={`${projeto.imagem.replace('.webp', '-800.webp')} 800w, ${projeto.imagem} 1600w`}
            sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 26rem"
            alt={`Site da ${projeto.nome}`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover object-top"
          />
          <div className="p-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.06em]">
              {projeto.nome}
            </h3>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-fraco">
              {projeto.segmento}
            </p>
            <p className="mt-3 text-[0.86rem] text-mudo">{projeto.linha}</p>
            {projeto.url && (
              <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-acento">
                Ver site ↗
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
