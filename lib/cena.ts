/**
 * A timeline da trilha, cena por cena.
 *
 * Duas regras mandam aqui:
 *
 * 1. **Uma cena por vez.** O texto de uma sai por completo antes do proximo
 *    entrar. No meio do caminho entre duas paradas so existe o filme.
 * 2. **O filme termina, depois o texto entra.** A saida acompanha o movimento
 *    da camera; a entrada espera a camera pousar.
 *
 * O filme tem 165 quadros, resultado de tres clipes emendados depois de
 * cortar os quadros em que a camera recuava. As emendas ficaram nos quadros
 * 60 e 109 — nenhuma parada pousa em cima delas: sao atravessadas em
 * movimento, no meio de um salto.
 */

import { rolagem, faixa, suave } from '@/lib/scroll'

/**
 * O relogio dos overlays.
 *
 * Nao e o scroll: e o quadro que esta na tela. Com o scroll, o texto entrava
 * enquanto o mapa ainda estava se abrindo, porque a barra chega ao destino
 * antes dos quadros. Seguindo o filme, o texto so aparece com a imagem pronta.
 */
function agora(): number {
  return rolagem.filme || rolagem.pin
}

/**
 * O relogio da SAIDA e outro: e o scroll.
 *
 * A entrada segue o filme, para o texto nunca comentar uma imagem que ainda
 * nao aconteceu. Mas prender a saida ao filme tambem foi erro: quando o video
 * atrasa um pouco, o texto atrasa junto e continua na tela depois do gesto —
 * a pessoa rola, ve o texto anterior parado sobre um fundo que ja esta
 * correndo, e le isso como travamento. Sair e resposta ao gesto, e gesto se
 * responde na hora.
 */
function agoraSaida(): number {
  return rolagem.pin
}

/** Onde cada rolada para. Indice = numero da cena. */
export const CAPITULOS = [
  0, //         0  hero               quadro 001
  16 / 164, //  1  o problema         quadro 017
  33 / 164, //  2  o custo            quadro 034
  49 / 164, //  3  a virada           quadro 050
  74 / 164, //  4  os quatro pilares  quadro 075
  98 / 164, //  5  a travessia        quadro 099
  1, //         6  a chegada          quadro 165 — rede completa
] as const

/**
 * A ultima parada sai de uma medicao, nao de um palpite.
 *
 * Medindo o brilho medio quadro a quadro: a Terra ainda esta escura no 130
 * (21,8), a explosao atinge o pico no 142 (44,8), a rede segue se espalhando
 * ate o 154 e so entao estabiliza (~37) ate o fim.
 *
 * Por isso a travessia salta direto para o quadro 165: sao 66 quadros numa
 * rolada so — atravessar o portal, ver a rede explodir e o planeta inteiro
 * acender, tudo dentro do mesmo movimento. Parar no meio disso significava
 * pousar com a animacao correndo, que era exatamente a queixa.
 */

/**
 * A parada 6 nao tem texto nenhum, e existe por dois motivos.
 *
 * O primeiro e de ritmo: e a hora em que a rede acende pelo planeta, a unica
 * cena do site que se sustenta sozinha — merece uma rolada so para ela.
 *
 * O segundo e tecnico. Sem essa parada, o salto da travessia ate a chegada
 * atravessava 92 quadros de uma vez, mais do que cabe decodificado na
 * memoria: o filme saia atrasado e depois corria para alcancar, o que aparece
 * como uma arrancada. Partido em dois, cada salto atravessa 46 quadros e
 * chega pronto.
 */

/**
 * Por que fracoes exatas e nao 0.1, 0.2, 0.45.
 *
 * Cada parada precisa cair em cima de um quadro inteiro. Parando numa posicao
 * quebrada — quadro 297,5 — o filme desenha os dois vizinhos sobrepostos, e a
 * imagem parada fica com contorno duplo, como se fosse falsa. Em movimento
 * essa mistura e o que da continuidade; parado, e defeito.
 */

/**
 * Do capitulo 6 para o 7 o salto e longo de proposito: 26% do filme numa
 * rolada so. E o trecho em que a camera atravessa o buraco e a rede explode
 * pelo planeta — medindo o brilho, isso acontece entre p 0.76 e 0.86. Colocar
 * texto no meio disso seria atrapalhar a unica cena que se sustenta sozinha.
 * O mundo termina de acender primeiro; so depois entra a tipografia.
 */

/** As duas emendas, em progresso: quadros 60 e 109 de 165. */
export const COSTURAS = [59 / 164, 108 / 164] as const

/** Os trabalhos sairam da trilha: viraram secao HTML logo depois do pin. */

/**
 * No celular a rolagem e livre, entao o texto passa muito mais rapido pela
 * tela. As janelas abrem mais para dar tempo de ler — sem isso, quem rola com
 * o polegar ve o texto piscar e sumir antes de conseguir focar nele.
 */
let toque: boolean | null = null
function noToque(): boolean {
  if (toque === null) {
    toque =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
  }
  return toque
}

/** Visibilidade da cena `i`. */
/**
 * Piso absoluto de cada cena: antes disso ela nao existe, ponto.
 *
 * As janelas de entrada sao relativas ao salto, e no celular a rolagem e
 * livre — o filme pode ficar para tras e o texto entrar comentando uma imagem
 * que ainda nao aconteceu. O piso e a garantia dura: a cena da chegada so
 * pode aparecer com a explosao da rede terminada, no quadro 146 de 165.
 */
const PISO: Record<number, number> = {
  // A rede so esta completa a partir do quadro 155.
  6: 154 / 164,
}

/** Quadro 217 de 330: a emenda dentro do portal, em progresso. */
const EMENDA_PORTAL = 108 / 164

export function cena(i: number, p: number = agora()): number {
  const aqui = CAPITULOS[i]
  const antes = i > 0 ? CAPITULOS[i - 1] : aqui - 0.1
  const depois = i < CAPITULOS.length - 1 ? CAPITULOS[i + 1] : aqui + 0.1

  const vaoAntes = aqui - antes
  const vaoDepois = depois - aqui

  // A entrada tem teto absoluto, nao proporcional ao salto.
  //
  // Isso importa nos saltos longos: da travessia ate a chegada sao 28% do
  // filme, e uma fracao desse vao colocaria o texto na tela no meio da
  // explosao da rede. Com teto fixo, o texto entra sempre nos ultimos
  // instantes do movimento, com a imagem ja formada.
  // A cena 7 e a unica que espera mais: a explosao da rede termina em
  // p 0.86 e o texto nao pode encostar nela.
  const janela = i === 7 ? 0.018 : noToque() ? 0.05 : 0.03
  const entradaDe = Math.max(aqui - vaoAntes * 0.5, aqui - janela)
  // A saida e curta e imediata.
  //
  // Ela era generosa, cobrindo mais de meio caminho ate a proxima parada — e
  // isso se lia como atraso: a pessoa rolava, via o texto subir devagar e so
  // depois o filme andar. Saindo nos primeiros instantes do movimento, o
  // gesto e a resposta acontecem juntos e o filme fica sozinho em cena, que e
  // o que ele merece durante a passagem.
  const saidaAte = Math.min(
    aqui + vaoDepois * (noToque() ? 0.3 : 0.22),
    aqui + 0.05
  )

  const piso = PISO[i]
  if (piso !== undefined && p < piso) return 0

  const entra = suave(faixa(p, entradaDe, aqui - vaoAntes * 0.01))
  const sai = 1 - suave(faixa(p, aqui + vaoDepois * 0.05, saidaAte))

  return entra * sai
}

/** O hero ja nasce na tela; some no primeiro gesto. */
export function heroVisivel(): number {
  // Pelo scroll, nao pelo filme: e saida pura, e sai no primeiro instante do
  // gesto. E a unica cena que a pessoa ja leu antes de rolar.
  return 1 - suave(faixa(agoraSaida(), 0.004, noToque() ? 0.05 : 0.035))
}

/** Cada pilar acende ao chegar na sua cena, um pouco depois do outro. */
/** A cena que mostra os quatro cards, e nao um texto corrido. */
const CENA_DOS_CARDS = 4

export function pilarAceso(i: number, p: number = agora()): number {
  // Os quatro terminam de acender antes da parada. Na versao anterior o
  // ultimo acendia junto com a saida da cena e nunca chegava a ser lido.
  const base = CAPITULOS[4]
  const de = base - 0.058 + i * 0.012
  return suave(faixa(p, de, de + 0.016))
}

/**
 * O filme se apaga no fim do pin.
 *
 * Os trabalhos vem logo abaixo, e cinco telas de site sobre um planeta em
 * chamas e uma imagem brigando com a outra. A rede cumpriu o papel dela.
 */
export function filmeApaga(): number {
  // Nao depende do pin: enquanto a trilha existe, o filme fica inteiro na
  // tela ate o ultimo quadro — e o ultimo quadro e a rede toda acesa, que e
  // o fecho do filme. Apagar ali dentro cortava o final antes da hora. O
  // escurecimento comeca so quando o pin solta e os trabalhos entram.
  return suave(faixa(rolagem.saida, 0.1, 0.65)) * 0.92
}

/**
 * Veu da travessia.
 *
 * O clipe 2 termina dentro do buraco, quase todo preto (quadro 217, p 0.658).
 * O veu acompanha isso: fecha na aproximacao e abre junto com a saida para o
 * mundo, para a passagem nao parecer um corte.
 */
export function veuPortal(p: number = agora()): number {
  const fecha = suave(faixa(p, 0.6, 0.648))
  const abre = 1 - suave(faixa(p, 0.668, 0.72))
  return Math.min(1, fecha) * abre * 0.55
}

/**
 * Escurecida sob o texto.
 *
 * O filme e claro justamente onde a tipografia precisa ler — a rede acesa, o
 * anel. Em vez de contorno em cada letra, um veu que aparece so quando existe
 * texto na tela e some quando a cena e so imagem.
 */
export function fundoDoTexto(p: number = agora()): number {
  let maior = 0
  for (let i = 1; i < CAPITULOS.length - 1; i++) {
    // A cena dos quatro cards nao entra por inteiro.
    //
    // La cada card ja tem o proprio fundo escuro atras do texto — o contraste
    // esta resolvido dentro dele. O veu geral por cima disso escurecia a tela
    // toda em vinte por cento no unico momento em que o filme esta no auge:
    // medido na gravacao, a imagem caia treze por cento bem quando os cards
    // entravam, e o filme, sozinho, so subia de brilho ali. Era a nossa
    // camada apagando o melhor quadro do filme.
    const peso = i === CENA_DOS_CARDS ? 0.3 : 1
    maior = Math.max(maior, cena(i, p) * peso)
  }
  return maior * 0.2
}

/**
 * Piscada de preto nas emendas — desligada.
 *
 * Existiam duas, uma em cada ponto onde os clipes originais se encontravam.
 * Faziam sentido quando o filme era a concatenacao de tres arquivos e o corte
 * aparecia. Depois que tudo virou um mp4 unico reencodado, medi a diferenca
 * entre os quadros vizinhos de cada emenda: na primeira deu 11,3 contra 11,8 e
 * 11,1 dos vizinhos, e na segunda 5,4 contra 5,2 e 3,6. Ou seja, nao ha
 * emenda nenhuma para esconder — as duas piscadas escureciam a tela por
 * conta propria.
 *
 * A primeira caia em p 0,36, bem no meio do salto de "A virada" para os
 * quatro cards, e era a escurecida que aparecia ali. A segunda tirava 72% da
 * luz dentro do salto do portal, onde o `veuPortal` ja faz o fechamento de
 * proposito.
 *
 * COSTURAS continua exportado: FilmeScroll usa as posicoes para nao tentar
 * interpolar por cima do encontro dos clipes.
 */
export function costura(): number {
  return 0
}

/** Halo quente atras do texto. */
export function brilhoCena(p: number = agora()): number {
  const sobe = suave(faixa(p, 0.24, 0.36))
  const cai = 1 - suave(faixa(p, 0.56, 0.62))
  const volta = suave(faixa(p, 0.7, 0.79))
  return Math.max(sobe * cai, volta) * 0.85
}
