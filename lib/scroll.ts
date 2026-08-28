/**
 * Progresso central de rolagem.
 *
 * De proposito NAO e estado do React. E um objeto mutavel que o Lenis
 * atualiza e o loop do WebGL le direto.
 *
 * `#trilha` e o trilho virtual (altura estendida + sticky). `rolagem.pin`
 * e 0 no topo e 1 quando o pin solta — essa e a timeline mestre.
 */

export type Rolagem = {
  global: number
  cena: Record<string, number>
  /** 0 a 1 na trilha pinada (hero → problema → solucao). */
  pin: number
  /** 0 a 1 depois que a trilha acabou, para o filme sair de cena so ali. */
  saida: number
  /**
   * 0 a 1 do quadro que esta REALMENTE desenhado na tela.
   *
   * Normalmente acompanha o `pin` de perto, mas fica para tras quando a rede
   * atrasa. Os overlays leem daqui, nao do pin: assim o texto nunca entra
   * antes do filme chegar na imagem que ele comenta.
   */
  filme: number
  velocidade: number
  altura: number
}

export const rolagem: Rolagem = {
  global: 0,
  cena: {},
  pin: 0,
  saida: 0,
  filme: 0,
  velocidade: 0,
  altura: 0,
}

type Faixa = { id: string; inicio: number; fim: number }

let faixas: Faixa[] = []
let limite = 1
let ultimo = 0
let trilhaInicio = 0
let trilhaFim = 1

const trava = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function medir(): void {
  const alturaJanela = window.innerHeight
  rolagem.altura = alturaJanela
  limite = Math.max(1, document.documentElement.scrollHeight - alturaJanela)

  const topoAtual = window.scrollY

  faixas = Array.from(
    document.querySelectorAll<HTMLElement>('[data-cena]')
  ).map((el) => {
    const r = el.getBoundingClientRect()
    const topo = r.top + topoAtual
    return {
      id: el.dataset.cena as string,
      inicio: topo - alturaJanela,
      fim: topo + r.height,
    }
  })

  const trilha = document.getElementById('trilha')
  if (trilha) {
    const r = trilha.getBoundingClientRect()
    const topo = r.top + topoAtual
    const altura = Math.max(r.height, trilha.offsetHeight)
    trilhaInicio = topo
    trilhaFim = Math.max(topo + alturaJanela, topo + altura - alturaJanela)
  }

  atualizar(topoAtual)
}

export function atualizar(topo: number): void {
  const delta = topo - ultimo
  rolagem.velocidade = delta * 0.4 + rolagem.velocidade * 0.6
  ultimo = topo
  rolagem.global = trava(topo / limite)
  const vaoTrilha = trilhaFim - trilhaInicio
  // Trilha curta demais = medicao falhou. Usa 3 viewports, nunca um vao de 1px
  // que joga o pin em 0 ou 1 e congela o 3D.
  rolagem.pin =
    vaoTrilha < (rolagem.altura || 1) * 1.2
      ? trava(topo / Math.max(1, (rolagem.altura || 1) * 3))
      : trava((topo - trilhaInicio) / vaoTrilha)

  const alturaTela = rolagem.altura || 1
  rolagem.saida = trava((topo - trilhaFim) / (alturaTela * 0.5))

  for (const f of faixas) {
    const vao = f.fim - f.inicio
    rolagem.cena[f.id] = vao <= 0 ? 0 : trava((topo - f.inicio) / vao)
  }
}

/**
 * Nao reler window.scrollY aqui. Com Lenis o nativo atrasava (ou ficava 0)
 * e o loop do WebGL zerava o pin — o anel parecia pregado.
 */
export function sincronizar(): void {
  atualizar(ultimo)
}

export function progresso(id: string): number {
  return rolagem.cena[id] ?? 0
}

export function faixa(p: number, de: number, para: number): number {
  if (para === de) return p >= para ? 1 : 0
  return trava((p - de) / (para - de))
}

export function suave(t: number): number {
  return t * t * (3 - 2 * t)
}

/** Onde o scroll precisa estar para o pin valer `p`. Usado pelos capitulos. */
export function yDoPin(p: number): number {
  return trilhaInicio + (trilhaFim - trilhaInicio) * trava(p)
}

/** Inicio e fim da trilha pinada em pixels de scroll. */
export function limitesDaTrilha(): { inicio: number; fim: number } {
  return { inicio: trilhaInicio, fim: trilhaFim }
}
