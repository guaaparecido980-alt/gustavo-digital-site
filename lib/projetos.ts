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
    segmento: 'Barbearia · Curitiba',
    linha: 'Excelência em cada detalhe.',
    imagem: '/assets/trabalhos/barbearia-clube-desk.webp',
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
    segmento: 'Steel frame',
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
    id: 'dieff',
    nome: 'Dieff Detailing',
    segmento: 'Estética automotiva',
    linha: 'O detalhe que o cliente sente.',
    imagem: '/assets/trabalhos/dieff-desk.webp',
    url: 'https://guaaparecido980-alt.github.io/limpeza-automotiva/',
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
