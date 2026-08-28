/**
 * Os seis simbolos do que o site entrega.
 *
 * Desenhados aqui em SVG, nao gerados no filme: icone feito por IA derrete
 * entre um quadro e outro quando o video e cortado em imagens. Em HTML eles
 * ficam nitidos em qualquer tela e entram na hora certa da rolagem.
 */

export type Simbolo = {
  id: string
  titulo: string
  linha: string
  caminho: React.ReactNode
}

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const simbolos: Simbolo[] = [
  {
    id: 'busca',
    titulo: 'Achado no Google',
    linha: 'Estrutura para a sua região te encontrar.',
    caminho: (
      <g {...traco}>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="M15 15l4.5 4.5" />
      </g>
    ),
  },
  {
    id: 'local',
    titulo: 'Curitiba e região',
    linha: 'Presença onde o cliente procura.',
    caminho: (
      <g {...traco}>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </g>
    ),
  },
  {
    id: 'zap',
    titulo: 'Conversa começada',
    linha: 'Botão que leva direto pro WhatsApp.',
    caminho: (
      <g {...traco}>
        <path d="M4 19l1.3-3.6A7.6 7.6 0 1 1 8.6 18.7L4 19z" />
      </g>
    ),
  },
  {
    id: 'rapido',
    titulo: 'Abre rápido',
    linha: 'Leve no celular, mesmo com sinal ruim.',
    caminho: (
      <g {...traco}>
        <path d="M13 3L5.5 13.5H11l-1 7.5L18.5 10H13l0-7z" />
      </g>
    ),
  },
  {
    id: 'seguro',
    titulo: 'Certificado de segurança',
    linha: 'Cadeado no navegador, domínio no seu nome.',
    caminho: (
      <g {...traco}>
        <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z" />
        <path d="M9.5 12l1.8 1.8 3.4-3.6" />
      </g>
    ),
  },
  {
    id: 'manutencao',
    titulo: 'Alteração quando precisar',
    linha: 'Mudou preço ou horário? Você chama.',
    caminho: (
      <g {...traco}>
        <path d="M4 20l4.5-4.5" />
        <path d="M14.8 3.6a4.6 4.6 0 0 0-5.4 6.1l-1.6 1.6 2.9 2.9 1.6-1.6a4.6 4.6 0 0 0 6.1-5.4l-2.6 2.6-2.4-.5-.5-2.4 2.6-2.6z" />
      </g>
    ),
  },
]

export function Icone({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-6 w-6 text-acento"
      focusable="false"
    >
      {children}
    </svg>
  )
}
