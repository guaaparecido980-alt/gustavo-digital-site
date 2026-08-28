'use client'

import { useEffect, useRef } from 'react'
import { faixaDoAparelho, quadroUrl } from '@/lib/filme'

/** Quantos quadros precisam estar prontos antes de liberar o hero. */
const PRIMEIROS = 10

/**
 * A porta de entrada.
 *
 * Regra numero um: **a abertura nunca prende ninguem**. Ela sai sozinha por
 * animacao de CSS, sem depender de JavaScript nenhum — se um script quebrar,
 * se o efeito nao rodar, se a rede morrer no meio, a animacao termina do
 * mesmo jeito e o site aparece. Foi exatamente isso que prendeu o celular na
 * versao anterior: a saida dependia do onload das imagens.
 *
 * O JavaScript aqui so faz uma coisa: quando os primeiros quadros chegam
 * antes do tempo, ele antecipa a saida em vez de esperar a animacao acabar.
 */
export default function Abertura() {
  const caixa = useRef<HTMLDivElement>(null)
  const barra = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = caixa.current
    if (!el) return

    const faixa = faixaDoAparelho()
    const alvo = Math.min(PRIMEIROS, faixa.total)
    let prontos = 0
    let saiu = false

    const sair = () => {
      if (saiu) return
      saiu = true
      el.dataset.pronto = '1'
    }

    const contar = () => {
      prontos++
      if (barra.current) {
        barra.current.style.transform = `scaleX(${Math.min(1, prontos / alvo)})`
      }
      if (prontos >= alvo) sair()
    }

    for (let n = 1; n <= alvo; n++) {
      const img = new Image()
      img.onload = contar
      img.onerror = contar
      img.src = quadroUrl(n, faixa)
    }

    return () => {
      saiu = true
    }
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
