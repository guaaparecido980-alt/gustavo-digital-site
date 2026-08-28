'use client'

import { useEffect, useRef, useState } from 'react'
import { estadoDoFilme } from '@/lib/filme'
import { rolagem } from '@/lib/scroll'
import { aCadaQuadro, ORDEM } from '@/lib/relogio'
import { querMenosMovimento } from '@/lib/qualidade'
import FilmeScroll from '@/components/FilmeScroll'

/** Quanto tempo esperar o video antes de desistir e usar os quadros. */
const PACIENCIA = 9000
/**
 * Quadros por segundo do filme: 165 quadros em 13,75 segundos.
 *
 * O alvo do seek e arredondado para essa grade. Sem isso o site pedia
 * posicoes no meio de um quadro — tempos diferentes que mostram exatamente a
 * mesma imagem. Cada um desses pedidos custa um seek inteiro ao decodificador
 * e nao muda um pixel na tela; numa rolagem rapida eram varios por quadro de
 * animacao, ocupando o decodificador com trabalho que ninguem ve enquanto o
 * proximo quadro de verdade esperava a vez.
 */
const QUADROS_POR_SEGUNDO = 12

/**
 * O filme como video, com o scroll no lugar do playhead.
 *
 * Por que video e nao a sequencia de quadros que existe em FilmeScroll:
 * desenhar quadro a quadro obriga o navegador a decodificar cada imagem por
 * software, na mesma thread que rola a pagina. Um video H.264 e decodificado
 * por hardware, num arquivo so — e foi por isso que a Apple migrou as paginas
 * de produto de sequencias de imagem para scrubbing de video.
 *
 * O arquivo e codificado com keyframe em TODO quadro (`-g 1` no ffmpeg). Sem
 * isso, pular para um ponto qualquer obriga o decodificador a reconstruir a
 * cadeia desde o keyframe anterior, e o seek fica lento — o defeito classico
 * de video controlado por scroll.
 *
 * Se o video nao puder tocar, o componente devolve o sistema de quadros. Os
 * dois casos reais: o modo de economia de bateria do iOS, que bloqueia video
 * sem interacao, e navegadores que recusem o arquivo.
 */
export default function FilmeVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [semVideo, setSemVideo] = useState(false)
  /**
   * Comeca falso de proposito, mesmo para quem pediu menos movimento.
   *
   * O HTML e gerado no build, onde nao existe preferencia de ninguem: se a
   * primeira renderizacao no navegador ja decidisse diferente, o React
   * encontraria uma arvore que nao bate com a que veio pronta e refazia a
   * pagina inteira — era o erro de hidratacao que aparecia no console de quem
   * usa movimento reduzido. Assim a primeira pintura e identica ao HTML e a
   * troca acontece logo depois, quando o navegador ja pode ser consultado.
   */
  const [reduzido, setReduzido] = useState(false)

  useEffect(() => {
    if (querMenosMovimento()) setReduzido(true)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video || semVideo) return

    const reduzido = querMenosMovimento()
    if (reduzido) return

    let vivo = true
    let ultimoTempo = -1
    let pronto = false
    /** Um seek de cada vez. Ver o comentario no laco. */
    let buscando = false
    /** Quando o seek atual comecou, para nao esperar por um que nao volta. */
    let buscaDesde = 0

    /**
     * O poster ja e imagem na tela — a cortina pode sair.
     *
     * `estadoDoFilme.pronto` e o que a abertura espera, e ela nao precisa do
     * video decodificado: precisa de alguma coisa desenhada atras dela. O
     * poster e o primeiro quadro do filme, tem 61KB, vem em `preload` de
     * prioridade alta e e exatamente o que o `<video>` mostra enquanto o
     * decodificador acorda. Esperando os metadados do mp4 em vez disso, num
     * 4G a cortina ficava quase cinco segundos na frente de uma pagina que ja
     * estava pronta.
     *
     * A trava interna `pronto`, que libera as buscas, continua presa ao
     * video de verdade — sao duas coisas diferentes.
     */
    const poster = new Image()
    poster.src = '/filme/poster.jpg'
    const posterPronto = () => {
      estadoDoFilme.pronto = true
    }
    if (poster.complete) posterPronto()
    else poster.addEventListener('load', posterPronto, { once: true })

    /** Sem quadro nenhum depois da paciencia: cai para a sequencia. */
    const desistir = window.setTimeout(() => {
      if (!pronto && vivo) setSemVideo(true)
    }, PACIENCIA)

    /**
     * `loadedmetadata`, nao `loadeddata`.
     *
     * O primeiro chega com poucos KB, assim que o navegador le o cabecalho do
     * arquivo — ja e prova de que o video existe e vai tocar. O segundo espera
     * o primeiro quadro inteiro, e num arquivo de 15MB em rede lenta isso
     * passava do limite de espera: o site desistia do video e ia baixar os 165
     * quadros por cima, o pior dos dois mundos. O resto do filme desce sob
     * demanda conforme o scroll pede, que e como scrubbing funciona.
     */
    /**
     * Acorda o decodificador com um play seguido de pause.
     *
     * O iOS nao pinta o primeiro quadro de um video que nunca tocou: o
     * elemento fica preto, mesmo carregado e com a busca funcionando. Um play
     * imediatamente pausado forca a primeira decodificacao e a imagem aparece.
     * `muted` e `playsInline` sao o que permitem esse play sem gesto do
     * usuario — sem eles o navegador recusa e a promessa rejeita.
     */
    const acordarDecodificador = () => {
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          video.pause()
          video.currentTime = Math.max(0.001, rolagem.pin * (video.duration || 1))
        }).catch(() => {
          // Recusado (economia de bateria, por exemplo): o quadro pode nao
          // aparecer, entao o sistema de imagens assume.
          if (vivo) setSemVideo(true)
        })
      } else {
        video.pause()
      }
    }

    const aoPoderTocar = () => {
      if (pronto) return
      pronto = true
      estadoDoFilme.pronto = true
      estadoDoFilme.progresso = 1
      window.clearTimeout(desistir)
      acordarDecodificador()
    }

    /** Progresso honesto: quanto do filme ja esta em buffer. */
    const aoBaixar = () => {
      const d = video.duration
      if (!d || !video.buffered.length) return
      estadoDoFilme.progresso = Math.min(1, video.buffered.end(0) / d)
    }

    const aoFalhar = () => {
      if (vivo) setSemVideo(true)
    }

    const aoIniciarBusca = () => {
      buscando = true
      buscaDesde = performance.now()
    }
    const aoTerminarBusca = () => {
      buscando = false
    }

    video.addEventListener('progress', aoBaixar)
    video.addEventListener('loadedmetadata', aoPoderTocar)
    video.addEventListener('error', aoFalhar)
    video.addEventListener('seeking', aoIniciarBusca)
    video.addEventListener('seeked', aoTerminarBusca)

    /**
     * O evento pode ja ter passado.
     *
     * Com o arquivo em cache, o video fica pronto antes deste efeito rodar e
     * `loadedmetadata` nunca dispara para nos. Sem esta checagem, o timeout
     * estourava e o site desistia de um video perfeito — funcionava na
     * primeira visita e sumia da segunda em diante, que e o pior tipo de bug:
     * o que so aparece para quem volta.
     */
    if (video.readyState >= 1) aoPoderTocar()
    else {
      // Tenta acordar ja, sem esperar o evento: no celular o decodificador
      // leva um tempo para o primeiro quadro, e se a pessoa rolar antes disso
      // o filme fica parado esperando — foi o 1,2s medido na primeira rolagem.
      acordarDecodificador()
    }

    const pararRelogio = aCadaQuadro(ORDEM.FILME, () => {
      if (!vivo) return
      const duracao = video.duration
      if (pronto && duracao > 0) {
        const bruto = Math.min(duracao - 0.001, rolagem.pin * duracao)
        // No centro do quadro, nao na borda: em cima da fronteira o
        // arredondamento do decodificador pode cair no quadro vizinho.
        const alvo = Math.min(
          duracao - 0.001,
          (Math.round(bruto * QUADROS_POR_SEGUNDO - 0.5) + 0.5) /
            QUADROS_POR_SEGUNDO
        )

        /**
         * Um seek de cada vez, e so depois que o anterior chegou.
         *
         * Este e o ponto que separa scrubbing fluido de imagem congelada.
         * Pedindo `currentTime` a cada quadro de animacao — sessenta vezes por
         * segundo — o navegador descarta os pedidos do meio e honra so o
         * ultimo: o filme fica parado o salto inteiro e pula direto para o
         * fim. Esperando o evento `seeked`, ele anda no ritmo que o
         * decodificador consegue, que e continuo.
         */
        /**
         * Solta a trava se o seek nao voltar.
         *
         * Esperar o `seeked` e o que faz o video andar continuo, mas se esse
         * evento nao chegar — o trecho ainda nao baixou, o iOS engoliu o
         * pedido — a trava fica presa e a imagem congela para sempre. Meio
         * Cento e oitenta milissegundos: acima disso ja e falha, nao espera.
         */
        if (buscando && performance.now() - buscaDesde > 180) buscando = false

        // Alvo igual ao anterior = mesmo quadro na tela. Nao ha o que pedir.
        if (!buscando && alvo !== ultimoTempo) {
          ultimoTempo = alvo
          buscando = true
          buscaDesde = performance.now()
          video.currentTime = alvo
        }
        // O filme e o video: quem le isso sao os textos, que assim nunca
        // aparecem antes da imagem que comentam.
        rolagem.filme = duracao > 0 ? video.currentTime / duracao : rolagem.pin
      }
    })

    return () => {
      vivo = false
      pararRelogio()
      window.clearTimeout(desistir)
      video.removeEventListener('progress', aoBaixar)
      video.removeEventListener('loadedmetadata', aoPoderTocar)
      video.removeEventListener('error', aoFalhar)
      video.removeEventListener('seeking', aoIniciarBusca)
      video.removeEventListener('seeked', aoTerminarBusca)
    }
  }, [semVideo])

  /**
   * Movimento reduzido nao recebe filme nenhum.
   *
   * Nem video nem sequencia de quadros: ali a trilha e desmontada e cada cena
   * mostra o proprio quadro parado ao fundo, pelo CSS. O componente de
   * quadros continuava sendo montado e comecava a baixar a sequencia inteira
   * para desenhar num canvas que a folha de estilo esconde — megabytes para
   * uma tela que ninguem ve, gastos justamente por quem pediu menos.
   */
  if (reduzido) return null
  if (semVideo) return <FilmeScroll />

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      playsInline
      preload="auto"
      /* O poster e o primeiro quadro do filme. Ele aparece instantaneamente,
         enquanto o decodificador ainda acorda — sem ele a primeira rolagem
         acontecia sobre uma tela preta. */
      poster="/filme/poster.jpg"
      disablePictureInPicture
      className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-ink object-cover"
    >
      {/* O celular recebe a versao menor: mesma duracao, metade do peso. */}
      <source src="/filme/filme-m.mp4" type="video/mp4" media="(max-width: 899px)" />
      <source src="/filme/filme.mp4" type="video/mp4" />
    </video>
  )
}
