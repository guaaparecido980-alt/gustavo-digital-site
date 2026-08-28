/**
 * Ponte para o motor de rolagem.
 *
 * O Lenis nasce dentro do <Suave/>, mas os capitulos precisam mandar nele
 * para saltar de um ato para o outro. Em vez de espalhar o objeto pelo
 * React, ele fica registrado aqui — mesma ideia do `rolagem` em scroll.ts.
 */

export type Motor = {
  scrollTo: (
    alvo: number,
    opcoes?: {
      duration?: number
      easing?: (t: number) => number
      lock?: boolean
      onComplete?: () => void
    }
  ) => void
  scroll: number
  /** Suspende o Lenis para outra pessoa mandar no scroll por um instante. */
  stop: () => void
  /** Devolve o comando. */
  start: () => void
}

let motor: Motor | null = null

export function registrarMotor(m: Motor | null): void {
  motor = m
}

export function pegarMotor(): Motor | null {
  return motor
}
