import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { GTM_ID, PIXEL_ID } from '@/lib/tracking'
import { perguntas } from '@/lib/projetos'
import Consentimento from '@/components/Consentimento'
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

/* Consent Mode v2 (LGPD). Precisa rodar ANTES do GTM, senao o GTM
   assume consentimento e a conformidade cai. */
const consentDefault = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent','default',{
  ad_storage:'denied', analytics_storage:'denied',
  ad_user_data:'denied', ad_personalization:'denied',
  functionality_storage:'granted', security_storage:'granted', wait_for_update:500
});
try{ if(document.cookie.indexOf('gd_consent=1')>-1){
  gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
}}catch(e){}
`

/* Stub do Meta Pixel. Enfileira chamadas; o fbevents.js so baixa apos o aceite. */
const pixelStub = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!1;n.version='2.0';n.queue=[]}(window,document,'script');
`

const gtmLoader = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />

        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentDefault }}
        />
        <Script
          id="pixel-stub"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: pixelStub }}
        />
        <Script
          id="gtm"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: gtmLoader }}
        />
      </head>
      <body>
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldServico) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }}
        />
      </body>
    </html>
  )
}
