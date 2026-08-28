'use client'

import { useEffect } from 'react'
import { iniciarConsentimentoEGtm } from '@/lib/tracking'

function colocarLd(id: string, json: string) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.type = 'application/ld+json'
  s.text = json
  document.head.appendChild(s)
}

/** Tracking e JSON-LD fora da arvore React — <script> no layout trava o Next 16. */
export default function Rastreio({
  ldServico,
  ldFaq,
}: {
  ldServico: string
  ldFaq: string
}) {
  useEffect(() => {
    colocarLd('ld-servico', ldServico)
    colocarLd('ld-faq', ldFaq)
    iniciarConsentimentoEGtm()
  }, [ldServico, ldFaq])
  return null
}
