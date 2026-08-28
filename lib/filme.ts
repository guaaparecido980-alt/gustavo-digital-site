/**
 * O filme em quadros.
 *
 * Tres clipes Higgsfield encadeados, cortados a 24fps e numerados em
 * sequencia continua: C1 q001-q120, C2 q121-q239, C3 q240-q358.
 * Os mp4 originais ficam em filme-fonte/. O roteiro completo esta em
 * .claude/skills/cinematic-scroll-frames/roteiro.md.
 */

export type Faixa = {
  pasta: string
  total: number
}

export const FILME = {
  prefixo: 'q',
  ext: 'webp',
  pad: 3,
  poster: '/filme/poster.jpg',
  /** 1600px, 12 quadros por segundo, sem os quadros de recuo. */
  cheia: { pasta: '/filme', total: 165 } as Faixa,
  /** 1100px, mesma cadencia, para celular. */
  movel: { pasta: '/filme/m', total: 165 } as Faixa,
} as const

/**
 * Celular nao e desktop menor: recebe metade dos quadros na metade da
 * largura. A escolha e feita uma vez, na montagem, e nao muda no resize —
 * trocar de faixa no meio da rolagem zeraria o cache de imagens.
 */
export function faixaDoAparelho(): Faixa {
  if (typeof window === 'undefined') return FILME.cheia
  return window.innerWidth < 900 ? FILME.movel : FILME.cheia
}

export function quadroUrl(n: number, faixa: Faixa = FILME.cheia): string {
  const i = Math.min(faixa.total, Math.max(1, n))
  return `${faixa.pasta}/${FILME.prefixo}${String(i).padStart(FILME.pad, '0')}.${FILME.ext}`
}

export function quadroDoPin(pin: number, faixa: Faixa = FILME.cheia): number {
  const t = pin < 0 ? 0 : pin > 1 ? 1 : pin
  return 1 + Math.round(t * (faixa.total - 1))
}

/**
 * Posicao exata no filme, com casas decimais.
 *
 * `quadroDoPin` arredonda para o quadro mais proximo — e por isso o filme
 * andava aos saltos, em 24 posicoes por segundo, mesmo num monitor de 144Hz.
 * Com a posicao fracionaria da para misturar os dois quadros vizinhos e ter
 * movimento continuo.
 */
export function posicaoDoPin(pin: number, faixa: Faixa = FILME.cheia): number {
  const t = pin < 0 ? 0 : pin > 1 ? 1 : pin
  return 1 + t * (faixa.total - 1)
}
