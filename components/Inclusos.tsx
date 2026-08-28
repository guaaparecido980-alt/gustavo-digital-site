'use client'

import { useEffect, useRef } from 'react'
import { Icone, simbolos } from '@/components/Icones'

/**
 * O que vem junto com o site.
 *
 * Saiu de dentro da trilha: la os seis itens tinham que aparecer e sumir
 * dentro de uma rolada, e nao dava tempo de ler nenhum. Aqui embaixo a pessoa
 * fica o tempo que quiser, e eles entram em cascata quando a secao chega.
 */
export default function Inclusos() {
  const lista = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = lista.current
    if (!el) return
    const itens = Array.from(el.children) as HTMLElement[]

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            const alvo = e.target as HTMLElement
            alvo.dataset.dentro = '1'
            observador.unobserve(alvo)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    )

    itens.forEach((li, i) => {
      li.style.transitionDelay = `${i * 70}ms`
      observador.observe(li)
    })

    return () => observador.disconnect()
  }, [])

  return (
    <ul
      ref={lista}
      className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {simbolos.map((s) => (
        <li key={s.id} className="card-entra flex items-start gap-4">
          <span className="card-vidro flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Icone>{s.caminho}</Icone>
          </span>
          <div>
            <h3 className="text-[1.02rem] font-semibold tracking-[-0.01em] text-texto">
              {s.titulo}
            </h3>
            <p className="mt-1.5 max-w-[28ch] text-[0.92rem] leading-[1.45] text-mudo">
              {s.linha}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
