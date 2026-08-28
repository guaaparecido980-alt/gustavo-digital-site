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
  title: 'Gustavo Digital — Sites profissionais para negócios reais | Curitiba',
  description:
    'Seu negócio já é profissional. Sua presença na internet também deveria parecer. Site + domínio + hospedagem + manutenção por R$200/mês. Sem taxa de criação.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE,
    title: 'Gustavo Digital — presença profissional na internet',
    description:
      'Sites feitos para negócios reais. Domínio, hospedagem e manutenção inclusos. R$200/mês, sem taxa de criação.',
    images: [{ url: CAPA }],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gustavo Digital — presença profissional na internet',
    description:
      'Sites feitos para negócios reais. Domínio, hospedagem e manutenção inclusos.',
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
        {/* Os primeiros quadros comecam a baixar junto com o HTML, antes de
            qualquer JavaScript rodar: quando o script pede o quadro 1, ele ja
            esta no cache.

            O `media` nao e detalhe — sem ele o celular baixava os quadros da
            faixa desktop, oito arquivos de 80KB que nunca seriam usados,
            disputando banda com os quadros que ele realmente precisa. */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <link
            key={`d${n}`}
            rel="preload"
            as="image"
            type="image/webp"
            media="(min-width: 900px)"
            href={`/filme/q00${n}.webp`}
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <link
            key={`m${n}`}
            rel="preload"
            as="image"
            type="image/webp"
            media="(max-width: 899px)"
            href={`/filme/m/q00${n}.webp`}
          />
        ))}
      </head>
      <body suppressHydrationWarning>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&display=swap"
          rel="stylesheet"
        />

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
