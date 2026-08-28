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
    r: 'Site profissional, domínio, hospedagem, certificado de segurança, botão de WhatsApp, estrutura para o Google e alterações quando precisar.',
  },
  {
    p: 'Existe taxa de criação?',
    r: 'Não. São R$200 por mês, e a criação do site já está incluída.',
  },
  {
    p: 'Domínio e hospedagem estão inclusos?',
    r: 'Sim. O domínio e a hospedagem estão dentro dos R$200 por mês. Se você já tiver um domínio, usamos o seu.',
  },
  {
    p: 'Posso cancelar quando quiser?',
    r: 'Sim. Não tem contrato de fidelidade. Se quiser parar, é só avisar.',
  },
  {
    p: 'Quanto tempo leva para ficar pronto?',
    r: 'Depois que você envia as informações, montamos o site e te mostramos antes de publicar.',
  },
  {
    p: 'Vocês fazem alterações depois?',
    r: 'Sim. Mudou preço, serviço, horário ou foto, você chama no WhatsApp e a alteração é feita. Está incluso.',
  },
]

/** Os 4 pilares da secao Solucao. */
export const pilares = [
  {
    titulo: 'DESIGN',
    texto: 'Um lugar próprio: as suas fotos, os seus serviços, as suas cores. Nada de template com o nome trocado.',
  },
  {
    titulo: 'VISIBILIDADE',
    texto: 'Estrutura para a sua região te encontrar no Google, com domínio no seu nome e certificado de segurança.',
  },
  {
    titulo: 'PERFORMANCE',
    texto: 'Abre rápido no celular e leva o cliente direto pro WhatsApp, com a conversa já começada.',
  },
  {
    titulo: 'MANUTENÇÃO',
    texto: 'Mudou preço, serviço, horário ou foto? Você chama e a alteração é feita. O site não fica largado.',
  },
]
