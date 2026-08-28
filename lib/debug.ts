/**
 * Diagnostico da cena, ligado por ?debug=true.
 *
 * Mesmo padrao do store de rolagem: objeto mutavel, sem estado de React.
 * O painel le por requestAnimationFrame, entao medir nao custa render.
 */

export type Diagnostico = {
  fps: number
  dpr: number
  nivel: string
  glbCarregado: boolean
  triangulos: number
  chamadas: number
  escultura: { x: number; y: number; z: number; escala: number; giro: number }
}

export const diag: Diagnostico = {
  fps: 0,
  dpr: 0,
  nivel: '—',
  glbCarregado: false,
  triangulos: 0,
  chamadas: 0,
  escultura: { x: 0, y: 0, z: 0, escala: 0, giro: 0 },
}

export function modoDebug(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug') === 'true'
}
