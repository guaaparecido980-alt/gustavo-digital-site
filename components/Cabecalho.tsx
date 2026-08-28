'use client'

import { useEffect, useRef, useState } from 'react'
import BotaoZap from './BotaoZap'
import Marca from './Marca'
import { rolagem } from '@/lib/scroll'

const links = [
  { href: '#problema', texto: 'Por quê' },
  { href: '#solucao', texto: 'O que inclui' },
  { href: '#trabalhos', texto: 'Trabalhos' },
  { href: '#investimento', texto: 'Preço' },
  { href: '#faq', texto: 'FAQ' },
]

export default function Cabecalho() {
  const [aberto, setAberto] = useState(false)
  const barra = useRef<HTMLElement>(null)

  // Fora da trilha o conteudo rola por tras do cabecalho e passava por cima
  // do logotipo. A faixa escura entra junto com o CTA fixo, no mesmo ponto.
  useEffect(() => {
    const el = barra.current
    if (!el) return
    let id = 0
    let visto = ''
    const passo = () => {
      const solto = rolagem.saida > 0.02 || rolagem.pin > 0.98 ? '1' : '0'
      if (solto !== visto) {
        visto = solto
        el.dataset.solto = solto
      }
      id = requestAnimationFrame(passo)
    }
    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
  }, [])

  function ir() {
    setAberto(false)
  }

  return (
    <header ref={barra} data-solto="0" className="cabecalho fixed inset-x-0 top-0 z-50">
      <div className="wrap flex h-[76px] items-center justify-between gap-6">
        <a
          href="#topo"
          className="flex items-center gap-3"
          data-cta="logo"
        >
          <Marca />
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cta={`nav-${l.texto}`}
                  className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-paper/80 transition-colors duration-300 hover:text-texto"
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <BotaoZap
            origem="nav"
            variante="moldura"
            className="!hidden !text-[0.62rem] !tracking-[0.18em] sm:!inline-flex"
          >
            Falar com especialista
          </BotaoZap>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-texto transition-transform duration-500 ease-[var(--ease-premium)] ${
                  aberto ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-5 bg-texto transition-opacity duration-300 ${
                  aberto ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-texto transition-transform duration-500 ease-[var(--ease-premium)] ${
                  aberto ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {aberto ? (
        <nav
          id="menu-mobile"
          aria-label="Menu"
          className="border-t border-fio bg-ink px-[var(--pad)] py-8 lg:hidden"
        >
          <ul className="grid gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cta={`menu-${l.texto}`}
                  onClick={ir}
                  className="font-display text-2xl font-semibold tracking-[-0.03em]"
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <BotaoZap origem="menu-mobile" className="w-full justify-center">
              Falar com especialista
            </BotaoZap>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
