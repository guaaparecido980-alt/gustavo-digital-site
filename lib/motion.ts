/**
 * Motion system global. Toda animacao do site puxa daqui.
 * Nao inventar easing por secao: se precisar de um terceiro, o problema
 * e a animacao, nao o token.
 */

export const ease = {
  premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
  suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const

export const dur = {
  rapido: 0.35,
  padrao: 0.7,
  lento: 1.15,
} as const

/**
 * Delay de stagger. `i` e o indice do elemento.
 * Usar para hierarquia, nao para fazer tudo "entrar bonitinho".
 */
export function stagger(i: number, each = 0.08, from = 0): number {
  return from + i * each
}
