'use client'

import { useEffect, useRef } from 'react'
import {
  brilhoCena,
  filmeApaga,
  fundoDoTexto,
  veuPortal,
} from '@/lib/cena'
import { rolagem } from '@/lib/scroll'
import { aCadaQuadro, ORDEM } from '@/lib/relogio'

/**
 * As camadas entre o filme e o texto.
 *
 * Halo quente para o texto ler sobre o ouro, veu que fecha na travessia e o
 * grao que costura o CGI com o HTML. Tudo em z-1: acima dos quadros, abaixo da tipografia.
 */
export default function Atmosfera() {
  const halo = useRef<HTMLDivElement>(null)
  const veu = useRef<HTMLDivElement>(null)
  const corte = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elHalo = halo.current
    const elVeu = veu.current
    const elCorte = corte.current
    if (!elHalo || !elVeu || !elCorte) return

    let vistoHalo = -1
    let vistoVeu = -1
    let vistoCorte = -1

    return aCadaQuadro(ORDEM.CENA, () => {
      const p = rolagem.filme || rolagem.pin

      const b = Math.round(brilhoCena(p) * 40) / 40
      if (b !== vistoHalo) {
        vistoHalo = b
        elHalo.style.opacity = String(b)
      }

      const v = Math.round(veuPortal(p) * 40) / 40
      if (v !== vistoVeu) {
        vistoVeu = v
        elVeu.style.opacity = String(v)
      }

      // O apagar definitivo do filme quando os trabalhos entram (la o fundo
      // vira ink puro) e a escurecida sob o texto. A piscada das emendas
      // saiu: nao havia emenda para esconder, ver lib/cena.ts.
      const c = Math.round(Math.max(filmeApaga(), fundoDoTexto(p)) * 50) / 50
      if (c !== vistoCorte) {
        vistoCorte = c
        elCorte.style.opacity = String(c)
      }
    })
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      <div
        ref={halo}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background:
            'radial-gradient(34% 42% at 78% 48%, rgba(242,163,60,.14) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 50% at 50% 115%, rgba(8,8,10,.72) 0%, transparent 55%)',
        }}
      />
      {/* Veu da travessia: escurece o quadro no portal e volta na vitrine. */}
      <div
        ref={veu}
        className="absolute inset-0 bg-ink"
        style={{ opacity: 0, willChange: 'opacity' }}
      />
      {/* Corte de montagem nas duas emendas entre clipes. */}
      <div
        ref={corte}
        className="absolute inset-0 bg-ink"
        style={{ opacity: 0, willChange: 'opacity' }}
      />
      <div className="grao absolute inset-0" />
    </div>
  )
}
