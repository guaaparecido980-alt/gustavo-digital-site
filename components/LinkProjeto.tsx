'use client'

import { cliqueProjeto } from '@/lib/tracking'

/** Abre o site do cliente e registra o evento de portfolio. */
export default function LinkProjeto({
  id,
  url,
  nome,
}: {
  id: string
  url: string
  nome: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      onClick={() => cliqueProjeto(id, url)}
      aria-label={`Abrir o site da ${nome}`}
      className="group inline-flex items-center gap-3 border border-fio px-5 py-3 text-[0.7rem] font-bold uppercase tracking-[0.18em] transition-colors duration-500 hover:border-fio-2"
    >
      Ver projeto
      <span
        aria-hidden
        className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1.5"
      >
        →
      </span>
    </a>
  )
}
