/**
 * Tracking do Gustavo Digital.
 *
 * Este arquivo e uma traducao fiel do que ja rodava no index.html: mesmos ids,
 * mesmos nomes de evento, mesma ordem e mesmo respeito ao consentimento.
 * Mudar nome de evento aqui quebra relatorio no GA e otimizacao no Meta.
 */

export const PIXEL_ID = '1663375918339077'
export const GTM_ID = 'GTM-WCPZTHHB'

export const WHATS = '5541987095245'
export const MSG_PADRAO =
  'Olá! Vi o site do Gustavo Digital e quero ver como ficaria o site do meu negócio.'

const COOKIE = 'gd_consent'
const SEIS_MESES = 60 * 60 * 24 * 180

type Params = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: unknown[]
    fbq?: {
      (...args: unknown[]): void
      loaded?: boolean
      callMethod?: (...args: unknown[]) => void
      queue?: unknown[]
    }
    gtag?: (...args: unknown[]) => void
  }
}

/** Monta o link do WhatsApp. Sem mensagem, usa a padrao. */
export function linkZap(mensagem: string = MSG_PADRAO): string {
  return `https://wa.me/${WHATS}?text=${encodeURIComponent(mensagem)}`
}

/** Empurra um evento pro dataLayer do GTM. */
export function track(nome: string, params?: Params): void {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: nome, ...(params ?? {}) })
  } catch {
    /* nunca deixa o tracking derrubar a pagina */
  }
}

export function temConsentimento(): boolean {
  try {
    return document.cookie.includes(`${COOKIE}=1`)
  } catch {
    return false
  }
}

export function jaRespondeuConsentimento(): boolean {
  try {
    return document.cookie.includes(`${COOKIE}=`)
  } catch {
    return false
  }
}

let pixelLigado = false

/** Sobe o Meta Pixel. So e chamado depois do aceite. */
export function ligarPixel(): void {
  if (pixelLigado || typeof window === 'undefined' || !window.fbq) return
  pixelLigado = true

  if (!window.fbq.loaded) {
    window.fbq.loaded = true
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(s)
  }

  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

/** Dispara evento no Meta. Silencioso se o pixel nao estiver autorizado. */
export function meta(evento: string, dados?: Params): void {
  try {
    if (pixelLigado && window.fbq) window.fbq('track', evento, dados ?? {})
  } catch {
    /* idem */
  }
}

/** Reabilita o pixel numa nova visita de quem ja tinha aceitado. */
export function retomarConsentimento(): void {
  if (temConsentimento()) ligarPixel()
}

export function gravarConsentimento(aceitou: boolean): void {
  const v = aceitou ? '1' : '0'
  document.cookie = `${COOKIE}=${v};path=/;max-age=${SEIS_MESES};SameSite=Lax`

  if (!aceitou) {
    track('cookie_consent', { consent: 'denied' })
    return
  }

  window.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
  track('cookie_consent', { consent: 'granted' })
  ligarPixel()
}

/**
 * Clique num CTA. `origem` e o antigo data-cta, que alimenta os relatorios.
 * Quando o CTA leva pro WhatsApp, dispara tambem o Lead nos dois lados.
 */
export function cliqueCta(origem: string, texto: string, ehZap: boolean): void {
  track('click_cta', {
    cta_origem: origem,
    cta_texto: texto.trim().replace(/\s+/g, ' ').slice(0, 60),
  })

  if (!ehZap) return

  track('click_whatsapp', { cta_origem: origem })
  track('generate_lead', { valor_oferta: 200, moeda: 'BRL' })
  meta('Lead', {
    content_name: 'Site R$200/mes',
    value: 200,
    currency: 'BRL',
  })
}

export function cliqueProjeto(projeto: string, url: string): void {
  track('click_portfolio', { projeto })
  track('portfolio_project_open', { projeto, url })
}
