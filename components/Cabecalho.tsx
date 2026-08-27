import BotaoZap from './BotaoZap'

const links = [
  { href: '#problema', texto: 'Por quê' },
  { href: '#solucao', texto: 'O que inclui' },
  { href: '#trabalhos', texto: 'Trabalhos' },
  { href: '#investimento', texto: 'Preço' },
  { href: '#faq', texto: 'FAQ' },
]

export default function Cabecalho() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-fio bg-ink/92">
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <a
          href="#topo"
          className="font-display text-[0.95rem] font-bold uppercase tracking-[0.12em]"
        >
          Gustavo <span className="text-acento">Digital</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-mudo transition-colors duration-300 hover:text-texto"
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BotaoZap origem="nav" variante="discreto" className="!py-2.5 !text-[0.66rem]">
          Falar com especialista
        </BotaoZap>
      </div>
    </header>
  )
}
