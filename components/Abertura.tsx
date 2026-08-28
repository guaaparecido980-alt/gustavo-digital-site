'use client'

import { useEffect, useRef } from 'react'
import { estadoDoFilme } from '@/lib/filme'
import { aCadaQuadro, ORDEM } from '@/lib/relogio'

/**
 * A porta de entrada.
 *
 * Regra numero um: **a abertura nunca prende ninguem**. Ela sai sozinha por
 * animacao de CSS, sem depender de JavaScript nenhum — se um script quebrar,
 * se o efeito nao rodar, se a rede morrer no meio, a animacao termina do mesmo
 * jeito e o site aparece. Ja prendeu um celular inteiro quando a saida
 * dependia do `onload` das imagens.
 *
 * O JavaScript so antecipa: quando o filme avisa que esta pronto, a tela sai
 * antes do tempo. Antes ela esperava dezoito quadros WebP carregarem — e
 * depois da troca para video esses arquivos nem sao mais usados, entao ela
 * segurava a pagina esperando a coisa errada.
 */
export default function Abertura() {
  const caixa = useRef<HTMLDivElement>(null)
  const barra = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = caixa.current
    if (!el) return

    let saiu = false
    let sair2 = () => {}

    const sair = () => {
      if (saiu) return
      saiu = true
      el.dataset.pronto = '1'
    }

    const parar = aCadaQuadro(ORDEM.BORDA, () => {
      if (barra.current && estadoDoFilme.progresso > 0) {
        barra.current.style.transform = `scaleX(${Math.min(
          1,
          estadoDoFilme.progresso
        )})`
      }
      if (estadoDoFilme.pronto) {
        sair()
        sair2()
      }
    })
    sair2 = parar
    return parar
  }, [])

  return (
    <div ref={caixa} className="abertura">
      <p className="font-display text-sm font-bold uppercase tracking-[0.32em]">
        Gustavo <span className="text-acento">Digital</span>
      </p>
      <span
        aria-hidden
        className="block h-px w-40 overflow-hidden bg-fio sm:w-56"
      >
        <span ref={barra} className="abertura-barra" />
      </span>
      <p className="sr-only">Carregando</p>
    </div>
  )
}
