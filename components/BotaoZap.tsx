'use client'

import { cliqueCta, linkZap, MSG_PADRAO } from '@/lib/tracking'

type Props = {
  /** Vira o cta_origem nos relatorios. Era o antigo data-cta. */
  origem: string
  children: React.ReactNode
  /** Mensagem que ja vai escrita na conversa. */
  mensagem?: string
  variante?: 'primario' | 'discreto'
  className?: string
}

/**
 * Todo CTA que leva pro WhatsApp passa por aqui. Concentrar num componente
 * garante que nenhum botao vá pro ar sem disparar click_cta e generate_lead.
 */
export default function BotaoZap({
  origem,
  children,
  mensagem = MSG_PADRAO,
  variante = 'primario',
  className = '',
}: Props) {
  const base =
    'group inline-flex items-center gap-3 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.18em] transition-colors duration-500'

  const cor =
    variante === 'primario'
      ? 'bg-acento text-[#150E03] hover:bg-acento-2'
      : 'border border-fio text-texto hover:border-fio-2'

  return (
    <a
      href={linkZap(mensagem)}
      target="_blank"
      rel="noopener"
      className={`${base} ${cor} ${className}`}
      onClick={(e) => cliqueCta(origem, e.currentTarget.textContent ?? '', true)}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1.5"
      >
        →
      </span>
    </a>
  )
}
