'use client'

import { useEffect } from 'react'
import { CAPITULOS } from '@/lib/cena'
import { limitesDaTrilha, rolagem, yDoPin } from '@/lib/scroll'
import { pegarMotor } from '@/lib/suave'
import { querMenosMovimento } from '@/lib/qualidade'

/** Tempo minimo de um salto, para vaos curtos. */
const DURACAO_MIN = 1.15
/** Tempo maximo, para o salto longo da travessia ate o mundo aceso. */
const DURACAO_MAX = 3.9
/**
 * Trava depois de pousar.
 *
 * A rolagem fica presa na cena por esse tempo, de proposito: e o que impede
 * uma girada mais forte de atravessar dois textos seguidos sem ninguem ler
 * nenhum. O gesto nao se perde — fica guardado e dispara quando a trava sai.
 */
const DESCANSO = 340
/** Quanto a roda precisa girar para valer um capitulo. */
const LIMIAR = 26
/** Sem evento por esse tempo, o gesto da roda acabou. */
const FIM_DO_GESTO = 180

/**
 * Rolar por capitulos, nao por pixel.
 *
 * Dentro da trilha pinada cada gesto leva a camera ate a proxima parada e
 * fica la — no computador com a roda ou o teclado, no celular com o dedo.
 *
 * No celular isso exige segurar o scroll nativo enquanto o dedo esta na tela
 * e animar a posicao na mao; sem isso o polegar atravessava tres textos numa
 * arrastada so, e nao dava para ler nenhum.
 */
export default function Capitulos() {
  useEffect(() => {
    if (querMenosMovimento()) return

    const toque = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches

    let animando = false
    let liberaEm = 0
    let acumulado = 0
    let ultimoEvento = 0
    let naFila = 0
    let animacao = 0
    /** Quanto a roda girou enquanto a cena estava travada. */
    let insistencia = 0
    /** Uma girada so pode guardar UM salto, por mais forte que seja. */
    let jaGuardou = false

    const indiceAtual = (): number => {
      const p = rolagem.pin
      let melhor = 0
      let dist = Infinity
      CAPITULOS.forEach((c, i) => {
        const d = Math.abs(p - c)
        if (d < dist) {
          dist = d
          melhor = i
        }
      })
      return melhor
    }

    const naTrilha = (): boolean => {
      const { inicio, fim } = limitesDaTrilha()
      const y = window.scrollY
      return y >= inicio - 4 && y <= fim + 4
    }

    /**
     * Seno nas duas pontas: sai devagar, cruza o meio em velocidade constante
     * e pousa devagar. A cubica que estava aqui acelerava no miolo, e essa
     * aceleracao lia como arrancada no meio do salto.
     */
    const suavizar = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

    /** Animador proprio: no celular nao existe Lenis para pedir o salto. */
    const animarAte = (destino: number, ms: number, fim: () => void) => {
      const partida = window.scrollY
      const vao = destino - partida
      const t0 = performance.now()
      cancelAnimationFrame(animacao)
      const passo = () => {
        const t = Math.min(1, (performance.now() - t0) / ms)
        window.scrollTo(0, partida + vao * suavizar(t))
        if (t < 1) animacao = requestAnimationFrame(passo)
        else fim()
      }
      animacao = requestAnimationFrame(passo)
    }

    /**
     * Quanto tempo o salto leva, pela distancia percorrida no filme.
     *
     * O termo quadratico e para o salto do mapa: uma escala linear tratava os
     * 66 quadros da chegada como quatro vezes um salto de 16, e a rede acendia
     * rapido demais para o tamanho do momento.
     */
    const duracaoDoSalto = (vao: number) =>
      Math.min(
        DURACAO_MAX,
        Math.max(DURACAO_MIN, DURACAO_MIN + vao * 3.6 + vao * vao * 6)
      )

    const irPara = (i: number) => {
      const motor = pegarMotor()
      const alvo = yDoPin(CAPITULOS[i])
      const vao = Math.abs(CAPITULOS[i] - rolagem.pin)
      const duracao = duracaoDoSalto(vao)
      animando = true
      acumulado = 0

      const terminou = () => {
        animando = false
        liberaEm = performance.now() + DESCANSO
        acumulado = 0
        if (naFila !== 0) {
          const guardado = naFila
          naFila = 0
          liberaEm = 0
          navegar(guardado)
        }
      }

      // O salto e animado aqui, na mao, com o Lenis suspenso.
      //
      // Pedir o salto ao proprio Lenis parecia mais simples, mas ele carrega a
      // inercia da girada que disparou o gesto: a animacao terminava no ponto
      // certo e a inercia residual empurrava alem, trazendo de volta depois.
      // E o "passa um pouco e volta". Com ele suspenso, a parada e exata.
      motor?.stop()
      animarAte(alvo, duracao * 1000, () => {
        motor?.start()
        terminou()
      })
    }

    const navegar = (direcao: number): boolean => {
      const alvo = indiceAtual() + direcao
      if (alvo < 0 || alvo >= CAPITULOS.length) return false
      irPara(alvo)
      return true
    }

    // ---------- roda do mouse ----------
    const aoGirar = (e: WheelEvent) => {
      if (!naTrilha()) return
      const agora = performance.now()
      const gestoNovo = agora - ultimoEvento > FIM_DO_GESTO
      if (gestoNovo) acumulado = 0
      ultimoEvento = agora

      if (animando || agora < liberaEm) {
        e.preventDefault()
        e.stopPropagation()
        // Duas coisas chegam aqui: a inercia da girada que acabou de disparar
        // o salto, e a pessoa girando DE NOVO porque ja quer a proxima cena.
        // Distinguir uma da outra e o que separa "avanca sozinho" de "nao vai
        // de primeira". A inercia decai; a insistencia soma.
        if (gestoNovo) {
          insistencia = 0
          jaGuardou = false
        }
        insistencia += e.deltaY
        // Teto de um salto por girada: sem isso, uma rolada forte acumulava
        // insistencia sem parar e engatava uma cena atras da outra ate o fim
        // do site. Para avancar mais de uma, tem que girar de novo.
        if (!jaGuardou && (gestoNovo || Math.abs(insistencia) > LIMIAR * 3)) {
          naFila = (gestoNovo ? e.deltaY : insistencia) > 0 ? 1 : -1
          jaGuardou = true
        }
        return
      }

      acumulado += e.deltaY
      if (Math.abs(acumulado) < LIMIAR) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      insistencia = 0
      jaGuardou = false
      if (navegar(acumulado > 0 ? 1 : -1)) {
        e.preventDefault()
        e.stopPropagation()
      } else {
        acumulado = 0
      }
    }

    // ---------- dedo ----------
    //
    // No celular a rolagem continua livre: prender o dedo deixava a pagina
    // travada quando o arrasto nao chegava no limiar, sem jeito de sair. Aqui
    // o dedo anda a vontade e, quando solta, a cena mais proxima puxa a
    // camera para o lugar — encaixa em cada texto sem nunca prender ninguem.
    let dentro = false
    let repouso = 0
    let dedoY = 0
    let indicePartida = 0

    /** Quanto o dedo precisa andar para valer como intencao de avancar. */
    const FLICK = 22

    const irAte = (i: number, ms: number) => {
      const alvo = yDoPin(CAPITULOS[i])
      if (Math.abs(window.scrollY - alvo) < 4) return
      animando = true
      animarAte(alvo, ms, () => {
        animando = false
        liberaEm = performance.now() + 200
      })
    }

    /**
     * Onde a rolagem pousa quando o dedo sai.
     *
     * Nao e a parada mais proxima: e a que a pessoa quis. Num toque leve o
     * deslocamento e pequeno e a parada mais proxima continua sendo a de
     * origem — o site avancava um pouco e voltava, ignorando o gesto. Aqui,
     * qualquer arrasto que passe de vinte e poucos pixels conta como intencao
     * e leva para a cena seguinte.
     */
    const encaixar = (arrasto: number) => {
      if (!naTrilha() || animando) return
      if (Math.abs(arrasto) > FLICK) {
        const destino = indicePartida + (arrasto > 0 ? 1 : -1)
        if (destino >= 0 && destino < CAPITULOS.length) {
          // Mesma escala do desktop. Com 700ms fixos, o salto da chegada ao
          // mundo — 66 quadros — passava cinco vezes mais rapido no celular
          // que no computador, e a rede acendia antes de dar para ver.
          const vao = Math.abs(CAPITULOS[destino] - rolagem.pin)
          irAte(destino, duracaoDoSalto(vao) * 1000)
          return
        }
      }
      // Voltar ao lugar depois de um toque curto e sempre rapido: nao e uma
      // cena, e uma correcao.
      irAte(indiceAtual(), 520)
    }

    const aoTocar = (e: TouchEvent) => {
      dentro = naTrilha()
      if (!dentro) return
      dedoY = e.touches[0].clientY
      indicePartida = indiceAtual()
      window.clearTimeout(repouso)
      cancelAnimationFrame(animacao)
      animando = false
    }

    const aoSoltar = (e: TouchEvent) => {
      if (!dentro) return
      dentro = false
      const arrasto = dedoY - (e.changedTouches[0]?.clientY ?? dedoY)
      // Espera a inercia do proprio celular parar antes de encaixar.
      window.clearTimeout(repouso)
      repouso = window.setTimeout(() => encaixar(arrasto), 220)
    }

    // ---------- teclado ----------
    const teclas: Record<string, number> = {
      PageDown: 1,
      PageUp: -1,
      ArrowDown: 1,
      ArrowUp: -1,
      ' ': 1,
    }

    const aoTeclar = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null
      if (alvo && /input|textarea|select/i.test(alvo.tagName)) return
      const dir = teclas[e.key]
      if (!dir || !naTrilha()) return
      if (animando || performance.now() < liberaEm) {
        e.preventDefault()
        naFila = dir
        return
      }
      if (navegar(dir)) e.preventDefault()
    }

    if (toque) {
      window.addEventListener('touchstart', aoTocar, { passive: true })
      window.addEventListener('touchend', aoSoltar, { passive: true })
      window.addEventListener('touchcancel', aoSoltar, { passive: true })
    } else {
      window.addEventListener('wheel', aoGirar, {
        passive: false,
        capture: true,
      })
    }
    window.addEventListener('keydown', aoTeclar)

    return () => {
      cancelAnimationFrame(animacao)
      window.clearTimeout(repouso)
      window.removeEventListener('touchstart', aoTocar)
      window.removeEventListener('touchend', aoSoltar)
      window.removeEventListener('touchcancel', aoSoltar)
      window.removeEventListener('wheel', aoGirar, { capture: true })
      window.removeEventListener('keydown', aoTeclar)
    }
  }, [])

  return null
}
