/**
 * Projetos reais, com as URLs que ja estavam publicadas no site atual.
 * Nada aqui e inventado. Se um projeto nao tem link publico confirmado,
 * ele entra sem `url` e aparece como showcase, sem botao de abrir.
 */

export type Projeto = {
  id: string
  nome: string
  segmento: string
  linha: string
  imagem: string
  url?: string
}

export const projetos: Projeto[] = [
  {
    id: 'barbearia-clube',
    nome: 'Barbearia Clube',
    segmento: 'Barbearia · Mercês',
    linha: 'Excelência em cada detalhe.',
    imagem: '/assets/trabalhos/barbearia-clube-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/barbearia-clube/',
  },
  {
    id: 'quadros',
    nome: 'Quadros Gym',
    segmento: 'Academia · Batel',
    linha: 'Presença à altura do espaço.',
    imagem: '/assets/trabalhos/quadros-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/quadrosgym/',
  },
  {
    id: 'lhm',
    nome: 'LHM Engenharia',
    segmento: 'Steel frame · Curitiba',
    linha: 'Obra séria. Site no mesmo tom.',
    imagem: '/assets/trabalhos/lhm-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/obras/',
  },
  {
    id: 'cls',
    nome: 'CLS Advocacia',
    segmento: 'Família · Curitiba',
    linha: 'Confiança que se vê antes da consulta.',
    imagem: '/assets/trabalhos/cls-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/advogado/',
  },
  {
    id: 'wagner',
    nome: 'Wagner Alves',
    segmento: 'Visagismo masculino',
    linha: 'O corte que combina com o rosto.',
    imagem: '/assets/trabalhos/wagner-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/consutoria-visagismo/',
  },
  {
    id: 'wander',
    nome: 'Wander Aguiar',
    segmento: 'Design de interiores',
    linha: 'Projeto que se explica sozinho.',
    imagem: '/assets/trabalhos/wander-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/arquiteto/',
  },
  {
    id: 'maxima',
    nome: 'Máxima Desentupidora',
    segmento: 'Emergência 24h · Curitiba',
    linha: 'Achado na hora do aperto.',
    imagem: '/assets/trabalhos/maxima-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/Desentupidora/',
  },
  {
    id: 'ajl',
    nome: 'AJL Encanamentos',
    segmento: 'Caça-vazamento · Curitiba',
    linha: 'Serviço técnico, site técnico.',
    imagem: '/assets/trabalhos/ajl-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/ajl/',
  },
  {
    id: 'condominio',
    nome: 'Condomínio Serviços',
    segmento: 'Manutenção predial 24h',
    linha: 'Quem cuida do prédio, encontrado.',
    imagem: '/assets/trabalhos/condominio-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/condominio/',
  },
  {
    id: 'kaviski',
    nome: 'Kaviski Despachante',
    segmento: 'Despachante · Curitiba',
    linha: 'Burocracia resolvida rápido.',
    imagem: '/assets/trabalhos/kaviski-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/despachante/',
  },
  {
    id: 'dubigode',
    nome: 'Barbearia Du Bigode',
    segmento: 'Barbearia · CIC',
    linha: 'Clube com nome próprio.',
    imagem: '/assets/trabalhos/dubigode-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/dubigode-barbearia/',
  },
  {
    id: 'justsurprise',
    nome: 'Just Surprise',
    segmento: 'Barbearia · CIC',
    linha: 'Corte, barba e navalhado.',
    imagem: '/assets/trabalhos/justsurprise-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/just-surprise-barbershop/',
  },
  {
    id: 'visionary',
    nome: 'Visionary Barber Shop',
    segmento: 'Barbearia · CIC',
    linha: 'Presença que combina com a cadeira.',
    imagem: '/assets/trabalhos/visionary-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/visionary-barbershop/',
  },
  {
    id: 'studio7',
    nome: 'Studio 7 Barbearia',
    segmento: 'Barbearia · Curitiba',
    linha: 'Estilo e precisão.',
    imagem: '/assets/trabalhos/studio7-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/studio7barbearia/',
  },
  {
    id: 'emerson',
    nome: 'Emerson Chemimm',
    segmento: 'Barbeiro visagista',
    linha: 'Autoridade antes da primeira visita.',
    imagem: '/assets/trabalhos/emerson-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/emerson-chemimm-visagista/',
  },
  {
    id: 'envelopar',
    nome: 'Envelopar Art & Decor',
    segmento: 'Envelopamento · Curitiba',
    linha: 'O antes e o depois em primeiro plano.',
    imagem: '/assets/trabalhos/envelopar-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/moveis/',
  },
  {
    id: 'chimarrao',
    nome: 'Borracharia 24h',
    segmento: 'BR-376 · São José dos Pinhais',
    linha: 'Parou na estrada, resolve na hora.',
    imagem: '/assets/trabalhos/chimarrao-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/borracharia/',
  },
  {
    id: 'velmora',
    nome: 'Velmora',
    segmento: 'Bebida funcional',
    linha: 'Produto novo, vitrine pronta.',
    imagem: '/assets/trabalhos/velmora-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/saude/',
  },
]

/** Perguntas do FAQ. Precisam bater com o JSON-LD do layout. */
export const perguntas = [
  {
    p: 'O que está incluso nos R$200?',
    r: 'O site, o domínio, a hospedagem, o certificado de segurança, o botão de WhatsApp, a estrutura para o Google e as alterações que você pedir. Tudo no mesmo valor.',
  },
  {
    p: 'Existe taxa de criação?',
    r: 'Não. A criação já está dentro da mensalidade — você não paga nada para começar.',
  },
  {
    p: 'O domínio fica no meu nome?',
    r: 'Sim. O endereço é do seu negócio. Se você já tem um domínio, usamos o seu.',
  },
  {
    p: 'Preciso contratar hospedagem à parte?',
    r: 'Não. A hospedagem está inclusa e é nossa responsabilidade manter o site no ar.',
  },
  {
    p: 'Meu site vai aparecer no Google?',
    r: 'O site é entregue preparado para ser indexado, com a estrutura que o Google lê para entender o que você faz e onde atende. Posição em busca ninguém garante — e quem garante, está vendendo o que não pode cumprir.',
  },
  {
    p: 'Funciona bem no celular?',
    r: 'É onde ele mais funciona. A maioria das visitas chega por ali, então o site é feito pensando primeiro nessa tela.',
  },
  {
    p: 'Posso pedir alterações depois?',
    r: 'Sim, e está incluso. Mudou preço, horário, serviço ou foto: você manda no WhatsApp e a alteração é feita.',
  },
  {
    p: 'Quanto tempo leva para ficar pronto?',
    r: 'Depois que você envia as informações do negócio, montamos o site e combinamos a data de publicação com você. Nada vai ao ar sem a sua aprovação.',
  },
  {
    p: 'Posso cancelar quando quiser?',
    r: 'Pode. Não existe fidelidade nem multa: se quiser parar, é só avisar.',
  },
]

/** Os 4 pilares da secao Solucao. */
export const pilares = [
  {
    titulo: 'DESIGN',
    texto: 'As suas fotos, os seus serviços, as suas cores. Nada de modelo pronto com o nome trocado.',
  },
  {
    titulo: 'VISIBILIDADE',
    texto: 'Estrutura preparada para o Google entender o que você faz e onde atende. Domínio no seu nome, certificado ativo.',
  },
  {
    titulo: 'PERFORMANCE',
    texto: 'Abre rápido no celular, que é onde ele vai abrir. Um toque leva ao WhatsApp com a mensagem pronta.',
  },
  {
    titulo: 'MANUTENÇÃO',
    texto: 'Mudou preço, horário, serviço ou foto: você manda e a alteração é feita. O site não envelhece sozinho.',
  },
]
