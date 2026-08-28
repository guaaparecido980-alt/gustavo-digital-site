'use client'

import { useEffect, useRef } from 'react'
import BotaoZap from './BotaoZap'
import { rolagem } from '@/lib/scroll'

/**
 * A barra so existe depois que o filme acaba.
 *
 * Durante a trilha ela competia com o proprio espetaculo: um botao laranja
 * fixo no rodape enquanto a camera atravessa o portal divide a atencao com a
 * cena. Ela entra quando a rede termina de acender e o site vira pagina
 * normal — que e quando o WhatsApp passa a fazer falta.
 */
const APARECE = 0.995

/** CTA permanente no celular, sem o preco — ele so entra na secao de valor. */
export default function CtaFixo() {
  const caixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    let id = 0
    let visivel = false

    const passo = () => {
      const mostrar = rolagem.pin > APARECE || rolagem.saida > 0.01
      if (mostrar !== visivel) {
        visivel = mostrar
        el.dataset.dentro = mostrar ? '1' : '0'
      }
      id = requestAnimationFrame(passo)
    }

    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      ref={caixa}
      data-dentro="0"
      className="cta-fixo fixed inset-x-0 bottom-0 z-40 border-t border-fio bg-ink/95 p-3 lg:hidden"
    >
      <BotaoZap origem="fixo-mobile" className="w-full justify-center !py-3">
        Quero ver como ficaria
      </BotaoZap>
    </div>
  )
}
