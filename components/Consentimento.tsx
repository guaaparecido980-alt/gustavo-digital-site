'use client'

import { useEffect, useState } from 'react'
import {
  gravarConsentimento,
  jaRespondeuConsentimento,
  retomarConsentimento,
} from '@/lib/tracking'

/**
 * Barra de cookies da LGPD. Mesmo comportamento do site atual: o Pixel e as
 * tags de anuncio so sobem depois do aceite, e a escolha vale por 180 dias.
 */
export default function Consentimento() {
  const [aberta, setAberta] = useState(false)

  useEffect(() => {
    if (jaRespondeuConsentimento()) {
      retomarConsentimento()
      return
    }
    setAberta(true)
  }, [])

  if (!aberta) return null

  function decidir(aceitou: boolean) {
    gravarConsentimento(aceitou)
    setAberta(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[90] flex flex-col gap-4 border-t border-fio bg-ink-2 px-[var(--pad)] py-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="max-w-[62ch] text-sm text-mudo">
        Uso cookies para entender como o site é usado e melhorar a experiência.
        Você escolhe.{' '}
        <a href="/privacidade.html" className="text-acento underline">
          Política de privacidade
        </a>
        .
      </p>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={() => decidir(false)}
          className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-mudo transition-colors hover:text-texto"
        >
          Recusar
        </button>
        <button
          onClick={() => decidir(true)}
          className="bg-acento px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#150E03] transition-colors hover:bg-acento-2"
        >
          Aceitar
        </button>
      </div>
    </div>
  )
}
