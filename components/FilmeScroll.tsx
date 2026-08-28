'use client'

import { useEffect, useRef } from 'react'
import {
  FILME,
  faixaDoAparelho,
  posicaoDoPin,
  quadroUrl,
  type Faixa,
} from '@/lib/filme'
import { CAPITULOS, COSTURAS } from '@/lib/cena'
import { querMenosMovimento } from '@/lib/qualidade'
import { rolagem } from '@/lib/scroll'

/** Margem minima de quadros a frente quando nao ha capitulo por perto. */
const ADIANTE = 30
/** Downloads simultaneos. */
const CANAIS = 6
/** Decodificacoes simultaneas. */
const FORNOS = 6
/**
 * Acima desta velocidade de rolagem o filme anda de dois em dois quadros.
 *
 * Medindo: decodificar um quadro custa entre 75 e 83ms, e esse numero quase
 * nao muda com resolucao ou qualidade — e o piso do formato para esse tipo de
 * imagem. Se nao da para decodificar mais rapido, resta decodificar menos: em
 * qualquer salto o filme anda de dois em dois quadros, metade do trabalho. O
 * olho nao distingue 24 de 12 quadros por segundo em movimento, e ao parar ele
 * volta a mostrar o quadro exato.
 */
const VELOZ = 9
/**
 * Teto de quadros que o filme pode andar num unico frame de animacao.
 *
 * Quando varios quadros chegam juntos depois de um atraso, o filme tentava
 * alcancar o scroll de uma vez — e isso aparecia como uma arrancada no fim
 * do salto, bem na hora em que o texto entra. Com teto, ele alcanca em alguns
 * frames, sem pulo visivel.
 */
const PASSO_MAX = 2.2
/**
 * Quantos quadros ficam decodificados ao mesmo tempo.
 *
 * Esse numero e o que separa um site fluido de um site que trava. Um bitmap
 * de 1600x900 ocupa 5.8MB de memoria viva — cem deles sao 580MB, o navegador
 * entra em coleta de lixo agressiva e a pagina engasga. Os arquivos ficam
 * guardados comprimidos (uns 100KB cada) e sao decodificados de novo quando
 * precisam: rapido, e sem tocar na rede.
 */
const VIVOS = 36
/** Teto de quadros vivos enquanto a camera esta parada. */
const VIVOS_PARADO = 62
/** No celular o quadro e menor: cabe mais decodificado na mesma memoria. */
const VIVOS_PARADO_MOVEL = 96
/** Teto de resolucao do canvas. */
const DPR_MAX = 1.5

/**
 * O filme, desenhado em canvas.
 *
 * Tres decisoes sustentam a fluidez aqui:
 *
 * 1. Decodificar fora da thread principal (`createImageBitmap`), para o
 *    scroll nao disputar CPU com o filme.
 * 2. Decodificar no tamanho da tela, nao no tamanho do arquivo — o mesmo
 *    quadro serve um notebook e um monitor grande sem desperdicio de memoria.
 * 3. Misturar os dois quadros vizinhos conforme a posicao fracionaria do
 *    scroll, para o movimento ser continuo mesmo com 24 quadros por segundo.
 */
export default function FilmeScroll() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const faixa: Faixa = faixaDoAparelho()
    const reduzido = querMenosMovimento()

    let vivo = true
    let desenhado = -1
    let ultimaMistura = -1
    let raf = 0

    /** Arquivo comprimido, leve. Fica muito tempo. */
    const arquivos = new Map<number, Blob>()
    /** Quadro decodificado, pesado. Fica pouco. */
    const prontos = new Map<number, ImageBitmap>()
    const baixando = new Set<number>()
    const decodificando = new Set<number>()

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX)
      const l = canvas.clientWidth || window.innerWidth
      const a = canvas.clientHeight || window.innerHeight
      const w = Math.round(l * dpr)
      const h = Math.round(a * dpr)
      if (canvas.width === w && canvas.height === h) return
      canvas.width = w
      canvas.height = h
      desenhado = -1
    }

    const pintar = (bmp: ImageBitmap) => {
      const cw = canvas.width
      const ch = canvas.height
      const escala = Math.max(cw / bmp.width, ch / bmp.height)
      const w = bmp.width * escala
      const h = bmp.height * escala
      ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const baixar = async (n: number) => {
      if (n < 1 || n > faixa.total) return
      if (arquivos.has(n) || baixando.has(n)) return
      if (baixando.size >= CANAIS) return
      baixando.add(n)
      try {
        const r = await fetch(quadroUrl(n, faixa))
        const blob = await r.blob()
        if (vivo) arquivos.set(n, blob)
      } catch {
        // tenta de novo na proxima passada
      } finally {
        baixando.delete(n)
      }
    }

    /**
     * Decodifica no tamanho do arquivo mesmo.
     *
     * Ja tentei pedir o redimensionamento aqui para economizar memoria, mas
     * medindo deu 254ms por quadro contra 83ms sem redimensionar — tres vezes
     * mais caro, e decodificacao lenta e exatamente o que trava o filme. O
     * ajuste de tamanho sai de graca no `drawImage`, que roda na GPU.
     */
    const decodificar = async (n: number, urgente = false) => {
      if (prontos.has(n) || decodificando.has(n)) return
      const blob = arquivos.get(n)
      if (!blob) return
      // O quadro que a tela precisa agora fura a fila. Sem isso ele esperava
      // atras de cinco vizinhos que ninguem ia ver ainda.
      if (!urgente && decodificando.size >= FORNOS) return
      decodificando.add(n)
      try {
        const bmp = await createImageBitmap(blob)
        if (!vivo) {
          bmp.close()
          return
        }
        prontos.set(n, bmp)
      } catch {
        // quadro corrompido: segue sem ele
      } finally {
        decodificando.delete(n)
      }
    }

    const quadroDe = (p: number) =>
      1 + Math.round(Math.min(1, Math.max(0, p)) * (faixa.total - 1))

    /**
     * Enquanto a pessoa le o texto de uma parada, o capitulo seguinte inteiro
     * desce em silencio — e o salto seguinte nao toca na rede.
     */
    const alcance = (centro: number): number => {
      const p = (centro - 1) / (faixa.total - 1)
      const proximo = CAPITULOS.find((c) => c > p + 0.005)
      const ate =
        proximo === undefined ? centro + ADIANTE : quadroDe(proximo) + 8
      return Math.min(faixa.total, Math.max(centro + ADIANTE, ate))
    }

    /**
     * O mesmo, para tras.
     *
     * Subir e tao comum quanto descer, e a janela so olhava para frente — por
     * isso a volta engasgava justamente onde a ida ja estava lisa.
     */
    const alcanceAtras = (centro: number): number => {
      const p = (centro - 1) / (faixa.total - 1)
      const anterior = [...CAPITULOS].reverse().find((c) => c < p - 0.005)
      const ate =
        anterior === undefined ? centro - ADIANTE : quadroDe(anterior) - 8
      return Math.max(1, Math.min(centro - ADIANTE, ate))
    }

    const cuidarDaJanela = (centro: number) => {
      const ate = alcance(centro)
      // Parado numa cena, a pessoa esta lendo — e o navegador esta ocioso.
      // E a hora de decodificar o capitulo inteiro que vem a seguir, para o
      // proximo salto atravessar dezenas de quadros sem esperar nada. Em
      // movimento a janela encolhe: ali o custo tem que ir para o desenho.
      const atras = alcanceAtras(centro)
      const parado = Math.abs(rolagem.velocidade) < 0.6
      const subindo = rolagem.velocidade < -0.6
      const passo2 = Math.abs(rolagem.velocidade) > VELOZ ? 2 : 1

      // O quadro que precisa estar na tela agora tem prioridade sobre tudo.
      baixar(centro)
      decodificar(centro, true)

      // As duas paradas vizinhas ficam garantidas — a de cima e a de baixo,
      // porque o proximo gesto pode ir para qualquer uma. Antes eu garantia as
      // oito de uma vez, e essas tarefas urgentes roubavam a fila do quadro que
      // estava na tela: a volta, que ja e mais apertada, travava.
      let antesQ = 1
      let depoisQ = faixa.total
      for (const c of CAPITULOS) {
        const q = quadroDe(c)
        if (q <= centro && q > antesQ) antesQ = q
        if (q >= centro && q < depoisQ) depoisQ = q
      }
      for (const q of [antesQ, depoisQ]) {
        baixar(q)
        decodificar(q, true)
      }

      // Parado, os dois lados descem: o proximo salto pode ser para qualquer
      // direcao e a pessoa esta lendo, entao ha tempo de sobra.
      if (parado || !subindo) for (let n = centro; n <= ate; n++) baixar(n)
      if (parado || subindo) for (let n = centro; n >= atras; n--) baixar(n)

      const tetoParado =
        faixa === FILME.movel ? VIVOS_PARADO_MOVEL : VIVOS_PARADO
      const teto = parado ? tetoParado : VIVOS
      if (parado) {
        // Parado, garante os dois trajetos vizinhos inteiros: a pessoa esta
        // lendo, a maquina esta ociosa, e o proximo gesto pode ir para
        // qualquer lado.
        for (let n = centro; n <= ate; n++) decodificar(n)
        for (let n = centro; n >= atras; n--) decodificar(n)
      } else if (subindo) {
        // Trajeto inteiro, quadro a quadro. O passo de dois em dois deixava
        // metade do caminho de fora, e o filme pulava um quadro sim outro nao
        // — o resto de travamento que sobrava. Com 33ms por quadro e seis
        // decodificacoes ao mesmo tempo, cabe: um salto de 66 quadros precisa
        // de 33 por segundo e a maquina entrega bem mais.
        for (let n = centro; n >= atras; n--) decodificar(n)
      } else {
        for (let n = centro; n <= ate; n++) decodificar(n)
      }

      // Descarta pelo trajeto, nao por uma margem fixa ao redor do quadro
      // atual: o salto que vem pode precisar de cinquenta quadros a frente, e
      // uma margem simetrica jogava fora justamente o meio do caminho — que
      // aparecia como uma pausa no meio da transicao.
      if (prontos.size > teto) {
        // Guarda o caminho da direcao em que a pessoa esta indo, e so uma
        // margem curta do outro lado. Guardar os dois por inteiro estourava o
        // teto e acabava descartando justamente o que vinha pela frente.
        const de = subindo ? Math.min(atras, centro - 12) : centro - 14
        const ateGuardar = subindo ? centro + 14 : Math.max(ate, centro + 12) + 4
        for (const [n, bmp] of prontos) {
          if (n < de || n > ateGuardar) {
            bmp.close()
            prontos.delete(n)
          }
        }
      }
      // O cache comprimido e barato, mas nao infinito.
      if (arquivos.size > 240) {
        for (const n of arquivos.keys()) {
          if (n < centro - 60 || n > ate + 60) arquivos.delete(n)
        }
      }
    }

    /** Quadros de cada lado das emendas, em indice absoluto. */
    const emendas = COSTURAS.map((c) => Math.round(c * (faixa.total - 1)) + 1)
    /**
     * Meia-largura do dissolve, em quadros.
     *
     * Curto de proposito. Com sete quadros o lado antigo ficava congelado
     * tempo demais enquanto o novo entrava — parava e parecia voltar. E na
     * emenda do portal, onde os dois lados sao o mesmo tunel de filamentos em
     * posicoes diferentes, misturar dois padroes caoticos so cria fantasma.
     */
    const MEIA = 3

    /**
     * Dissolve na emenda.
     *
     * Os tres clipes vieram do mesmo prompt, mas o modelo redesenhou o anel
     * entre um e outro: no primeiro ele tem linhas grossas e densas, no
     * segundo linhas finas e vazadas. Nao e diferenca de cor — e outro objeto,
     * e nenhuma correcao de brilho ou saturacao ia resolver.
     *
     * A saida e a mesma de qualquer sala de montagem: em vez de cortar, os
     * dois lados se cruzam por meio segundo. Aqui isso vira o quadro final de
     * um lado sobreposto ao inicial do outro, com peso deslizando de 0 a 1.
     */
    const dissolveDaEmenda = (
      pos: number
    ): { a: number; b: number; peso: number } | null => {
      for (const e of emendas) {
        const d = pos - e
        if (d > -MEIA && d < MEIA) {
          const t = (d + MEIA) / (MEIA * 2) // 0 → 1 atravessando a emenda
          // Lado A anda ate o ultimo quadro dele e para; lado B comeca no
          // primeiro e anda a partir dali.
          const a = Math.min(e, Math.floor(pos))
          const b = Math.max(e + 1, Math.ceil(pos))
          return { a, b, peso: t }
        }
      }
      return null
    }

    /**
     * O quadro exato, ou o vizinho pronto mais proximo — sempre atras do
     * alvo, nunca a frente.
     *
     * A versao anterior aceitava o vizinho de qualquer lado. Quando o quadro
     * certo ainda nao tinha chegado, ela desenhava um mais adiantado; assim
     * que o certo chegava, o filme voltava para ele. Era essa a recuada
     * depois de cada rolada. Com mao unica o movimento so anda para frente,
     * no maximo com menos quadros do que o ideal.
     */
    const melhorQuadro = (alvo: number, subindo: boolean): number | null => {
      if (prontos.has(alvo)) return alvo
      // Alcance longo de proposito: com dez quadros, um buraco um pouco maior
      // deixava a funcao sem resposta e o filme parava de desenhar no meio da
      // transicao, esperando. Melhor um quadro atrasado do que a imagem presa.
      for (let d = 1; d <= 40; d++) {
        const n = subindo ? alvo + d : alvo - d
        if (n >= 1 && n <= faixa.total && prontos.has(n)) return n
      }
      for (let d = 1; d <= 40; d++) {
        const n = subindo ? alvo - d : alvo + d
        if (n >= 1 && n <= faixa.total && prontos.has(n)) return n
      }
      return null
    }

    let ultimoCentro = -1
    let pulso = 0
    let pinAnterior = 0
    let posAtual = -1

    const passo = () => {
      if (!vivo) return
      dimensionar()

      const desejada = reduzido ? 1 : posicaoDoPin(rolagem.pin, faixa)
      // Persegue a posicao do scroll com velocidade limitada.
      if (posAtual < 0) posAtual = desejada
      const diferenca = desejada - posAtual
      posAtual +=
        Math.abs(diferenca) <= PASSO_MAX
          ? diferenca
          : Math.sign(diferenca) * PASSO_MAX
      const pos = posAtual
      // Parado, a imagem tem que ser UM quadro, nao a media de dois: a
      // sobreposicao vira contorno duplo e a cena parece borrada. A mistura
      // serve para o movimento ficar continuo, e so.
      const quieto = Math.abs(rolagem.velocidade) < 0.4
      const base = quieto ? Math.round(pos) : Math.floor(pos)
      const mistura = quieto ? 0 : pos - base

      // A janela e revista quando o quadro muda E de tempos em tempos.
      //
      // Sem a segunda condicao, um quadro que termina de baixar enquanto a
      // pessoa esta parada nunca era mandado para decodificacao — e a tela
      // ficava preta depois do F5 ate alguem rolar.
      //
      // A frequencia muda com o estado: parado, a cada tres quadros de
      // animacao. Cada passada manda no maximo seis quadros para a fila, e a
      // cada quinze isso levava quase tres segundos para preparar os 66 quadros
      // do salto ate o mundo — se a pessoa rolasse antes, o filme partia com a
      // fila pela metade. Em movimento a revisao volta a ser rara: ali o custo
      // precisa ir todo para o desenho.
      pulso++
      const emRepouso = Math.abs(rolagem.velocidade) < 0.6
      const cadencia = emRepouso ? 3 : 15
      if (base !== ultimoCentro || pulso % cadencia === 0 || desenhado === -1) {
        ultimoCentro = base
        cuidarDaJanela(base)
      }

      const mudou =
        base !== desenhado || Math.abs(mistura - ultimaMistura) > 0.02

      if (mudou) {
        const emenda = dissolveDaEmenda(pos)

        if (emenda) {
          // Plano B obrigatorio: se um dos lados da emenda ainda nao chegou, o
          // dissolve some e entra o quadro pronto mais proximo. Sem isso a tela
          // simplesmente parava de ser desenhada bem no meio do portal — que e
          // onde os dois clipes se encontram e ha mais o que carregar.
          const bmpA =
            prontos.get(emenda.a) ??
            (() => {
              const alt = melhorQuadro(emenda.a, false)
              return alt === null ? undefined : prontos.get(alt)
            })()
          const bmpB = prontos.get(emenda.b)
          if (bmpA) {
            pintar(bmpA)
            if (bmpB && emenda.peso > 0.01) {
              ctx.globalAlpha = emenda.peso
              pintar(bmpB)
              ctx.globalAlpha = 1
            }
            desenhado = base
            ultimaMistura = mistura
          }
        } else {
          // A direcao vem da diferenca entre onde o filme esta e onde deveria
          // estar — nao de `velocidade`, que e um valor suavizado e oscila em
          // torno de zero no fim de cada salto. Era essa oscilacao que fazia o
          // filme aceitar um quadro adiantado por um instante e depois voltar.
          const escolhido = melhorQuadro(base, base < desenhado)
          if (escolhido !== null) {
            const bmpA = prontos.get(escolhido)
            if (bmpA) {
              pintar(bmpA)
              // O vizinho da frente entra por cima com o peso da fracao: e o
              // que da posicao continua num filme de 24 quadros por segundo.
              if (escolhido === base && mistura > 0.02) {
                const bmpB = prontos.get(base + 1)
                if (bmpB) {
                  ctx.globalAlpha = mistura
                  pintar(bmpB)
                  ctx.globalAlpha = 1
                }
              }
              desenhado = escolhido
              ultimaMistura = mistura
            }
          }
        }
      }
      raf = requestAnimationFrame(passo)
    }

    dimensionar()
    cuidarDaJanela(1)
    raf = requestAnimationFrame(passo)

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      for (const bmp of prontos.values()) bmp.close()
      prontos.clear()
      arquivos.clear()
      baixando.clear()
      decodificando.clear()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-ink"
    />
  )
}
