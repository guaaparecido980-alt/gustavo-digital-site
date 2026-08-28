/**
 * A marca: os colchetes com a barra dentro, e o nome ao lado.
 *
 * Desenhada em SVG, nao trazida do PNG. O arquivo original tem fundo preto
 * solido — sobre o filme ele apareceria como um retangulo — e tentar recortar
 * o fundo come o antialiasing das letras. Em vetor ela fica nitida em
 * qualquer tela, herda as cores do tema e nao pesa nada.
 */
export default function Marca({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 34 40"
        aria-hidden
        className="h-[26px] w-auto shrink-0"
        focusable="false"
      >
        <g fill="none" stroke="currentColor" strokeWidth="2.6">
          {/* colchete esquerdo */}
          <path d="M11 2H3v36h8" className="text-acento" stroke="#f2a33c" />
          {/* colchete direito */}
          <path d="M23 2h8v36h-8" className="text-acento" stroke="#f2a33c" />
        </g>
        {/* a barra inclinada no meio */}
        <path
          d="M20.6 4.5 12.4 35.5l-2.6-1.1L18 3.4z"
          fill="currentColor"
          className="text-texto"
        />
      </svg>

      <span className="font-display text-[0.86rem] font-bold uppercase leading-none tracking-[0.14em]">
        Gustavo <span className="text-acento">Digital</span>
      </span>
    </span>
  )
}
