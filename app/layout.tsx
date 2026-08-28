import type { Metadata, Viewport } from 'next'
import { GTM_ID, PIXEL_ID } from '@/lib/tracking'
import { perguntas } from '@/lib/projetos'
import Consentimento from '@/components/Consentimento'
import Rastreio from '@/components/Rastreio'
import './globals.css'

const SITE = 'https://gustavodigital.online'
const CAPA = `${SITE}/assets/trabalhos/barbearia-clube-desk.webp`

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // A palavra-chave vem primeiro porque e o que a pessoa digita; a marca
  // fecha. A descricao responde preco e o que inclui antes do clique.
  title: 'Criação de Sites em Curitiba | Gustavo Digital',
  description:
    'Site profissional para pequenos negócios em Curitiba e região. Domínio, hospedagem, certificado e alterações inclusos por R$200 por mês, sem taxa de criação e sem fidelidade.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE,
    title: 'Criação de sites em Curitiba — Gustavo Digital',
    description:
      'Site profissional para pequenos negócios, com domínio, hospedagem e alterações inclusos. R$200 por mês, sem taxa de criação.',
    images: [{ url: CAPA }],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Criação de sites em Curitiba — Gustavo Digital',
    description:
      'Site profissional com domínio, hospedagem e alterações inclusos. R$200 por mês.',
    images: [CAPA],
  },
}

export const viewport: Viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
}

/* Dados estruturados: os mesmos dois blocos que ja estavam no index.html. */
const ldServico = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType:
    'Criação e manutenção de site profissional para pequenos negócios',
  provider: {
    '@type': 'ProfessionalService',
    name: 'Gustavo Digital',
    url: `${SITE}/`,
    areaServed: 'Curitiba e Região Metropolitana, PR',
    telephone: '+5541987095245',
  },
  areaServed: 'Brasil',
  offers: {
    '@type': 'Offer',
    name: 'Site profissional — mensalidade',
    price: '200',
    priceCurrency: 'BRL',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '200',
      priceCurrency: 'BRL',
      unitCode: 'MON',
      billingIncrement: 1,
    },
    availability: 'https://schema.org/InStock',
    url: `${SITE}/`,
  },
}

const ldFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: perguntas.map(({ p, r }) => ({
    '@type': 'Question',
    name: p,
    acceptedAnswer: { '@type': 'Answer', text: r },
  })),
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* O primeiro quadro do filme, em prioridade maxima.

            Aqui existiam dezoito `preload` de WebP — os primeiros quadros da
            sequencia, de quando o filme era desenhado imagem por imagem.
            Depois da troca para video eles viraram meio megabyte baixado em
            prioridade alta que ninguem usa, disputando banda justamente com o
            buffer do video de que a primeira rolagem depende. So o caminho de
            emergencia (FilmeScroll) ainda le esses arquivos, e ele busca os
            proprios quadros quando entra.

            O poster fica: e a imagem que a pessoa ve enquanto o decodificador
            acorda, e sao 61KB contra 531KB. */}
        <link rel="preload" as="image" href="/filme/poster.jpg" />
      </head>
      <body suppressHydrationWarning>
        {/* As fontes moram em /public/fontes e sao declaradas em globals.css.
            Aqui so as tres que a primeira tela usa — o titulo em Playfair, a
            marca em Clash e o texto corrido em Satoshi — para que cheguem
            junto com o CSS e a pagina ja pinte com a tipografia certa. Sem
            isso o navegador pintava com a fonte do sistema e trocava depois,
            e essa troca mexia a altura do bloco do hero: era 0,15 de CLS,
            acima do limite do Google, e a unica metrica do site no vermelho. */}
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fontes/playfair-var.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fontes/satoshi-400.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="/fontes/clash-700.woff2" />

        <Rastreio
          ldServico={JSON.stringify(ldServico)}
          ldFaq={JSON.stringify(ldFaq)}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {children}

        <Consentimento />
      </body>
    </html>
  )
}
