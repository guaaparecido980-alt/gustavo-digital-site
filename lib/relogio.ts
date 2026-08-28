/**
 * Um relogio so para a pagina inteira.
 *
 * Antes cada componente abria o proprio `requestAnimationFrame`: a rolagem, o
 * video, as cenas, a atmosfera, o cabecalho e o CTA — seis lacos independentes
 * disputando o mesmo quadro. Dois problemas nasciam dai.
 *
 * O primeiro e desperdicio: seis chamadas de JavaScript por quadro onde uma
 * resolve, num celular que ao mesmo tempo decodifica video.
 *
 * O segundo e pior, e e de sincronia. A ordem em que esses lacos rodavam era a
 * ordem em que os componentes montaram — ninguem escolheu. Se o laco das cenas
 * corria antes do laco do video, o texto daquele quadro reagia ao filme do
 * quadro anterior. Um quadro de atraso e pouco no papel; na tela e o texto
 * chegando depois da imagem, que foi a queixa que atravessou o projeto
 * inteiro.
 *
 * Aqui a ordem e declarada, nao sorteada: le a rolagem, adianta o filme,
 * desenha o que depende dele, e so entao mexe no resto.
 */

export const ORDEM = {
  /** Le a posicao da pagina e atualiza `rolagem`. */
  ROLAGEM: 0,
  /** Move o video e publica em `rolagem.filme` o quadro realmente na tela. */
  FILME: 10,
  /** Textos e camadas que leem `rolagem.filme` — depois dele, no mesmo quadro. */
  CENA: 20,
  /** Cabecalho, CTA, abertura: reagem a limiares, nao a continuidade. */
  BORDA: 30,
} as const

type Inscrito = { ordem: number; passo: () => void }

const inscritos: Inscrito[] = []
let id = 0

function quadro() {
  // Copia nao e necessaria: ninguem se inscreve nem sai de dentro do passo.
  for (let i = 0; i < inscritos.length; i++) inscritos[i].passo()
  id = requestAnimationFrame(quadro)
}

/**
 * Inscreve um passo por quadro. Devolve a funcao que o remove.
 *
 * O laco so existe enquanto houver alguem inscrito: com a lista vazia ele
 * para, e nao fica um `requestAnimationFrame` girando a toa numa aba aberta e
 * esquecida.
 */
export function aCadaQuadro(ordem: number, passo: () => void): () => void {
  const inscrito = { ordem, passo }
  inscritos.push(inscrito)
  inscritos.sort((a, b) => a.ordem - b.ordem)
  if (!id) id = requestAnimationFrame(quadro)

  return () => {
    const i = inscritos.indexOf(inscrito)
    if (i >= 0) inscritos.splice(i, 1)
    if (!inscritos.length && id) {
      cancelAnimationFrame(id)
      id = 0
    }
  }
}
