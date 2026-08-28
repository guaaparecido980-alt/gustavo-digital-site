'use client'

import { useEffect } from 'react'
import { atualizar, medir } from '@/lib/scroll'
import { querMenosMovimento } from '@/lib/qualidade'
import { cliqueCta } from '@/lib/tracking'
import { registrarMotor } from '@/lib/suave'
import { aCadaQuadro, ORDEM } from '@/lib/relogio'

/**
 * O relogio da rolagem.
 *
 * No desktop entra o Lenis, que suaviza a roda do mouse e permite o salto
 * entre capitulos. No celular ele fica de fora de proposito: com o dedo o
 * scroll e nativo, e o valor interno do Lenis nao acompanha — era isso que
 * prendia o filme no primeiro quadro no celular, dando a impressao de que o
 * fundo nao existia.
 *
 * Nos dois casos quem manda no filme e `rolagem.pin`, atualizado a cada
 * quadro de animacao.
 */
export default function Suave() {
  useEffect(() => {
    let vivo = true
    let limpar = () => {}

    async function ligar() {
      // Quem pediu menos movimento recebe o site em pagina normal, nao a
      // trilha pinada sem filme: com a trilha de pe e o filme parado, a pessoa
      // rolava quase seis telas olhando o mesmo quadro. O CSS reage a este
      // atributo desmontando o pin e empilhando as cenas.
      if (querMenosMovimento()) {
        document.documentElement.dataset.reduzido = '1'
      }
      medir()
      requestAnimationFrame(() => medir())

      const aoRedimensionar = () => medir()
      window.addEventListener('resize', aoRedimensionar)
      window.addEventListener('orientationchange', aoRedimensionar)

      const toque = window.matchMedia(
        '(hover: none) and (pointer: coarse)'
      ).matches
      const semMovimento = querMenosMovimento()

      // ---- Celular e quem pediu menos movimento: rolagem nativa. ----
      if (toque || semMovimento) {
        const aoRolar = () => atualizar(window.scrollY)
        window.addEventListener('scroll', aoRolar, { passive: true })

        // No celular o evento de scroll chega em rajadas e com atraso; ler a
        // posicao a cada quadro mantem o filme colado no dedo.
        let pararRelogio = () => {}
        if (!semMovimento) {
          pararRelogio = aCadaQuadro(ORDEM.ROLAGEM, () => {
            atualizar(window.scrollY)
          })
        }

        limpar = () => {
          pararRelogio()
          window.removeEventListener('scroll', aoRolar)
          window.removeEventListener('resize', aoRedimensionar)
          window.removeEventListener('orientationchange', aoRedimensionar)
        }
        return
      }

      // ---- Desktop: Lenis. ----
      const { default: Lenis } = await import('lenis')
      if (!vivo) return

      const lenis = new Lenis({
        duration: 0.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.9,
        autoRaf: false,
        respectReducedMotion: false,
      })

      registrarMotor(lenis)

      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        atualizar(scroll)
      })

      // Primeiro passo do quadro: o Lenis avanca e a posicao e publicada
      // antes de qualquer coisa ler `rolagem`. Ver lib/relogio.ts.
      const pararRelogio = aCadaQuadro(ORDEM.ROLAGEM, () => {
        lenis.raf(performance.now())
        // Enquanto o Lenis esta suspenso (durante um salto de capitulo), quem
        // manda na posicao e o animador dos capitulos, via scroll nativo.
        atualizar(lenis.isStopped ? window.scrollY : lenis.scroll)
      })

      const aoClicar = (e: MouseEvent) => {
        const alvo = (e.target as HTMLElement)?.closest?.(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null
        if (!alvo) return
        const id = alvo.getAttribute('href')
        if (!id || id === '#') return
        const destino = document.querySelector(id)
        if (!destino) return
        e.preventDefault()
        cliqueCta(
          alvo.dataset.cta || 'link',
          (alvo.textContent || '').trim(),
          false
        )
        lenis.scrollTo(destino as HTMLElement, { offset: -68 })
      }
      document.addEventListener('click', aoClicar)

      limpar = () => {
        registrarMotor(null)
        pararRelogio()
        document.removeEventListener('click', aoClicar)
        window.removeEventListener('resize', aoRedimensionar)
        window.removeEventListener('orientationchange', aoRedimensionar)
        lenis.destroy()
      }
    }

    ligar()

    return () => {
      vivo = false
      limpar()
    }
  }, [])

  return null
}
