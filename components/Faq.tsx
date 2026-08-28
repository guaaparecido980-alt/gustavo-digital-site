'use client'

import { useState } from 'react'
import { perguntas } from '@/lib/projetos'
import { track } from '@/lib/tracking'

/** Accordion minimalista: uma pergunta aberta por vez (brief secao 19). */
export default function Faq() {
  const [aberta, setAberta] = useState<number | null>(null)

  function alternar(i: number) {
    const vai = aberta === i ? null : i
    setAberta(vai)
    if (vai !== null) track('faq_open', { pergunta: perguntas[i].p })
  }

  return (
    <ul className="border-t border-fio">
      {perguntas.map((q, i) => {
        const ativa = aberta === i
        return (
          <li key={q.p} className="border-b border-fio">
            <h3>
              <button
                onClick={() => alternar(i)}
                aria-expanded={ativa}
                aria-controls={`faq-r-${i}`}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-lg font-medium tracking-[-0.02em] sm:text-xl">
                  {q.p}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl font-light text-acento transition-transform duration-500 ease-[var(--ease-premium)] ${
                    ativa ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </h3>

            <div
              id={`faq-r-${i}`}
              hidden={!ativa}
              className="max-w-[62ch] pb-7 text-mudo"
            >
              {q.r}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
