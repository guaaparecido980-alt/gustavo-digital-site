/**
 * O que o aparelho e a conexao aguentam.
 *
 * Sobrou do tempo do WebGL, mas agora responde outra pergunta: quantos
 * quadros do filme faz sentido baixar. Celular nao e desktop menor, e quem
 * pediu menos movimento recebe um quadro parado em vez de 358.
 */

export function querMenosMovimento(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

type Conexao = {
  saveData?: boolean
  effectiveType?: string
}

/**
 * Conexao ruim ou modo de economia: o filme sai de cena e sobra o poster
 * com as secoes em HTML. O conteudo continua inteiro; so o espetaculo sai.
 */
export function conexaoFraca(): boolean {
  try {
    const c = (navigator as { connection?: Conexao }).connection
    if (!c) return false
    if (c.saveData) return true
    const t = c.effectiveType ?? ''
    return t === 'slow-2g' || t === '2g' || t === '3g'
  } catch {
    return false
  }
}
